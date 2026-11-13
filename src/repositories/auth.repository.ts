import { ApiError } from "../utils/ApiError";
import { OTP_TTL_MS, REFRESH_TTL_MS } from "../utils/constants";
import { prisma } from "../utils/prisma";
type OtpType = "EMAIL_VERIFICATION" | "PASSWORD_RESET";

export async function getUserByEmail({ email }: { email: string }) {
  return await prisma.user.findUnique({
    where: { email: email },
  });
}

export async function createUser(data: {
  fullName: string;
  email: string;
  passwordHash: string;
}) {
  const user = await prisma.user.create({
    data: data,
    select: {
      id: true,
    },
  });

  return user.id;
}

export async function createOtp({
  userId,
  otpHash,
  type,
}: {
  userId: string;
  otpHash: string;
  type: OtpType;
}) {
  await prisma.otp.create({
    data: {
      userId: userId,
      codeHash: otpHash,
      type: type,
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    },
  });
}

export async function issueSession(refreshToken: string, userId: string) {
  await prisma.refreshToken.create({
    data: {
      userId: userId,
      tokenHash: refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
    },
  });
}

export async function findActiveOtp({
  userId,
  otpType,
}: {
  userId: string;
  otpType: OtpType;
}) {
  return await prisma.otp.findFirst({
    where: {
      userId,
      type: otpType,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });
}

export function increaseOtpAttempts(id: string) {
  return prisma.otp.update({
    where: { id },
    data: { attempts: { increment: 1 } },
  });
}

export async function updateOtpAndUser(otpId: string, userId: string) {
  await prisma.$transaction(async (tx) => {
    const updated = tx.otp.updateMany({
      where: { id: otpId, usedAt: null },
      data: { usedAt: new Date() },
    });

    if ((await updated).count === 0) throw new ApiError(404, "OTP not found");

    await tx.user.update({
      where: { id: userId },
      data: { emailVerified: true },
    });
  });
}

export async function findLatestOtp(userId: string, type: OtpType) {
  return prisma.otp.findFirst({
    where: { userId, type },
    orderBy: { createdAt: "desc" },
  });
}

export async function createFreshOtp(data: {
  userId: string;
  type: OtpType;
  otpHash: string;
  expiresAt: Date;
}) {
  return prisma.$transaction(async (tx) => {
    await tx.otp.updateMany({
      where: { userId: data.userId, type: data.type, usedAt: null },
      data: { usedAt: new Date() },
    });
    return tx.otp.create({
      data: {
        userId: data.userId,
        type: data.type,
        codeHash: data.otpHash,
        expiresAt: data.expiresAt,
      },
    });
  });
}
export async function passwordUpdate(
  otpId: string,
  userId: string,
  passwordHash: string,
) {
  return await prisma.$transaction(async (tx) => {
    const consumed = await tx.otp.updateMany({
      where: { id: otpId, usedAt: null },
      data: { usedAt: new Date() },
    });
    if (consumed.count === 0) throw new ApiError(429, "Error");

    await tx.user.update({
      where: { id: userId },
      data: { passwordHash, emailVerified: true },
    });

    await tx.refreshToken.updateMany({
      where: { userId: userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  });
}
