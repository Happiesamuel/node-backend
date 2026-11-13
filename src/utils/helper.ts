import crypto from "crypto";
import bcrypt from "bcryptjs";
import { BCRYPT_HASH, OTP_HASH } from "./constants";

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, BCRYPT_HASH);
}
export function hashOtp(otp: string): Promise<string> {
  return bcrypt.hash(otp, OTP_HASH);
}

export async function compareOtpHash(
  otp: string,
  hashOtp: string,
): Promise<boolean> {
  return await bcrypt.compare(otp, hashOtp);
}
export async function compareHash(
  password: string,
  hashPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(password, hashPassword);
}

export function generateOtp(length = 6): string {
  const max = Math.pow(10, length);
  const randomNumber = crypto.randomInt(0, max);

  return randomNumber.toString().padStart(length, "0");
}
