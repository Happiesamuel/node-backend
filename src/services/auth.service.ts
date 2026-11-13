import { sendOtpEmail } from "../email/auth.email";
import {
  createFreshOtp,
  createOtp,
  createUser,
  findActiveOtp,
  findLatestOtp,
  getUserByEmail,
  increaseOtpAttempts,
  issueSession,
  passwordUpdate,
  updateOtpAndUser,
} from "../repositories/auth.repository";
import { ApiError } from "../utils/ApiError";
import {
  compareHash,
  compareOtpHash,
  generateOtp,
  hashOtp,
  hashPassword,
} from "../utils/helper";
import { signInToken } from "../utils/jwt";
import {
  MAX_OTP_ATTEMPTS,
  OTP_TTL_MS,
  RESEND_COOLDOWN_MS,
} from "../utils/constants";

export async function loginService({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await getUserByEmail({ email });
  if (!user?.passwordHash) {
    throw new ApiError(404, "Invalid email or password.");
  }
  const verifyPassword = await compareHash(password, user.passwordHash);

  if (!verifyPassword) {
    throw new ApiError(404, "Invalid email or password.");
  }

  if (user.status !== "ACTIVE") {
    throw new ApiError(403, "This account is not active.");
  }

  if (!user.emailVerified) {
    throw new ApiError(403, "Please verify your email first.");
  }

  const payload = {
    userId: user.id,
    email: user.email,
  };

  const { accessToken, refreshToken } = signInToken(payload);

  await issueSession(refreshToken, user.id);

  return { accessToken, refreshToken };
}

export async function registerUserService({
  email,
  password,
  firstName,
  lastName,
}: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) {
  const existingUser = await getUserByEmail({ email });

  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  const passwordHash = await hashPassword(password);
  const user = {
    fullName: `${firstName} ${lastName}`,
    email,
    passwordHash,
  };

  const userId = await createUser(user);

  const otp = generateOtp();

  const hashedOtp = await hashOtp(otp);

  await createOtp({
    type: "EMAIL_VERIFICATION",
    otpHash: hashedOtp,
    userId: userId,
  });

  await sendOtpEmail(user.email, otp);
}

export async function resendOtpService({ email }: { email: string }) {
  const user = await getUserByEmail({ email });

  if (!user || user.emailVerified || user.status !== "ACTIVE") return;

  await sendOtp(user.id, "PASSWORD_RESET", user.email, RESEND_COOLDOWN_MS);
}

export async function verifyOtpService({
  otp,
  email,
}: {
  otp: string;
  email: string;
}) {
  const user = await getUserByEmail({ email });

  if (!user) {
    throw new ApiError(404, "Invalid or expired code");
  }
  const activeOtp = await checkActiveOtp("EMAIL_VERIFICATION", user.id, otp);

  await updateOtpAndUser(activeOtp.id, user.id);
}

export async function forgottenPasswordService({ email }: { email: string }) {
  const user = await getUserByEmail({ email });

  if (!user || user.status !== "ACTIVE") return;

  await sendOtp(user.id, "PASSWORD_RESET", user.email, 60_000);
}

export async function resetPasswordService({
  email,
  password,
  code,
}: {
  email: string;
  password: string;
  code: string;
}) {
  const user = await getUserByEmail({ email });

  if (!user || user.status !== "ACTIVE")
    throw new ApiError(404, "Invalid or expired code");

  const otp = await checkActiveOtp("PASSWORD_RESET", user.id, code);
  const passwordHash = await hashPassword(password);

  await passwordUpdate(otp.id, user.id, passwordHash);
}

// export async function changePasswordService({
//   userId,
//   password,
//   newPassword,
// }: {
//   userId: string;
//   password: string;
//   newPassword: string;
// }) {
//   //! find the user in the db...if exist update papssword in db...else throw error
// }

async function sendOtp(
  id: string,
  type: "PASSWORD_RESET" | "EMAIL_VERIFICATION",
  email: string,
  coolDownTime: number,
) {
  const last = await findLatestOtp(id, type);
  if (last && Date.now() - last.createdAt.getTime() < coolDownTime) return;

  const code = generateOtp();

  const hashedOtp = await hashOtp(code);

  await createFreshOtp({
    userId: id,
    type: type,
    otpHash: hashedOtp,
    expiresAt: new Date(Date.now() + OTP_TTL_MS),
  });

  await sendOtpEmail(email, code);
}

async function checkActiveOtp(
  otpType: "PASSWORD_RESET" | "EMAIL_VERIFICATION",
  userId: string,
  otp: string,
) {
  const activeOtp = await findActiveOtp({
    otpType: otpType,
    userId: userId,
  });

  if (!activeOtp) {
    throw new ApiError(404, "Invalid or expired code");
  }

  const updated = await increaseOtpAttempts(activeOtp.id);

  if (updated.attempts > MAX_OTP_ATTEMPTS) {
    throw new ApiError(429, "Too many attempts. Request a new code.");
  }

  const otpCompare = await compareOtpHash(otp, activeOtp.codeHash);
  if (!otpCompare) {
    throw new ApiError(404, "Invalid or expired code");
  }
  return activeOtp;
}
