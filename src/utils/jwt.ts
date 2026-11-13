import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";
import { ApiError } from "./ApiError";

export interface Payload extends JwtPayload {
  userId: string;
  email: string;
}

export function signInToken(data: { userId: string; email: string }) {
  const accessToken = jwt.sign(data, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  } as jwt.SignOptions);

  const refreshToken = jwt.sign(data, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions);

  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string): Payload {
  try {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as Payload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(401, "Your session has expired. please log in again");
    }
    throw new ApiError(401, "Invalid authentication token.");
  }
}

export function verifyRefreshToken(token: string): Payload {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as Payload;
  } catch (error) {
    throw new ApiError(
      401,
      "Invalid or expired refresh token. Please log in again.",
    );
  }
}
