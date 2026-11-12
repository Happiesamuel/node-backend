import { sendOtpEmail } from "../email/auth.email";
import { logger } from "../utils/logger";

export async function loginService({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const accessToken = "sam";
  return { accessToken };
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
  const name = `${firstName} ${lastName}`;
  await sendOtpEmail(email, 123456, name);
}

export async function verifyOtpService({
  otp,
  email,
}: {
  otp: number;
  email: string;
}) {
  //   return true;

  console.log(true);
}

export async function forgottenPasswordService({ email }: { email: string }) {
  //! Find user in db...if user exists...send otp to email...

  await sendOtpEmail(email, 123456);
  //! if not throw apperror email doesnt exists
}

export async function resetPasswordService({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  //   return true;

  //! Update the user pasword in dm

  console.log(true);
}

export async function changePasswordService({
  userId,
  password,
  newPassword,
}: {
  userId: string;
  password: string;
  newPassword: string;
}) {
  //! find the user in the db...if exist update papssword in db...else throw error
}
