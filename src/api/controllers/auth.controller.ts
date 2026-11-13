import { NextFunction, Request, Response } from "express";
import {
  forgottenPasswordService,
  loginService,
  registerUserService,
  resendOtpService,
  resetPasswordService,
  verifyOtpService,
} from "../../services/auth.service";

export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await loginService({
      email,
      password,
    });
    res.status(200).json({
      success: true,
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    next(error);
  }
}

export async function registerController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, password, firstName, lastName } = req.body;
    await registerUserService({
      email,
      password,
      firstName,
      lastName,
    });
    res.status(200).json({
      success: true,
      message: "Account created! Check your email for your verification code.",
    });
  } catch (error) {
    next(error);
  }
}
export async function verifyOtpController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, otp } = req.body;
    await verifyOtpService({ email, otp });
    res.status(200).json({
      success: true,
      message: "Email verified. login to get started",
    });
  } catch (error) {
    next(error);
  }
}
export async function resendOtpController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email } = req.body;
    await resendOtpService({ email });
    return res.status(200).json({
      success: true,
      message:
        "If an account exists and isn't verified, a new code has been sent.",
    });
  } catch (error) {
    next(error);
  }
}
export async function forgottenPasswordController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email } = req.body;
    await forgottenPasswordService({ email });
    res.status(200).json({
      success: true,
      message: "Otp sent email",
    });
  } catch (error) {
    next(error);
  }
}
export async function resetPasswordController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, password, code } = req.body;
    await resetPasswordService({ email, password, code });
    res.status(200).json({
      success: true,
      message: "Password chnaged successfully. login to continue",
    });
  } catch (error) {
    next(error);
  }
}
export async function chnagePasswordController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId, password, newPassword } = req.body;
    // await changePasswordService({ userId, password, newPassword });
    res.status(200).json({
      success: true,
      message: "Password chnaged successfully.",
    });
  } catch (error) {
    next(error);
  }
}
