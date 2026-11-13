import { Router } from "express";
import {
  chnagePasswordController,
  forgottenPasswordController,
  loginController,
  registerController,
  resendOtpController,
  resetPasswordController,
  verifyOtpController,
} from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import {
  forgottenPasswordSchema,
  loginSchema,
  otpSchema,
  registerSchema,
  resendOtpSchema,
  resetPasswordSchema,
} from "../../schemas/auth.schema";
import {
  loginAttemptLimiter,
  loginEmailLimiter,
  loginIpLimiter,
  otpSendLimiter,
  otpVerifyLimiter,
  resetPasswordLimiter,
} from "../../utils/Ratelimit";

export const authRouter = Router();

authRouter.post(
  "/login",
  loginIpLimiter,
  loginEmailLimiter,
  loginAttemptLimiter,
  loginController,
  validate({ body: loginSchema }),
  loginController,
);

authRouter.post(
  "/register",
  validate({ body: registerSchema }),
  registerController,
);

authRouter.post(
  "/verify-otp",
  otpVerifyLimiter,
  validate({ body: otpSchema }),
  verifyOtpController,
);
authRouter.post(
  "/resend-otp",
  validate({ body: resendOtpSchema }),
  resendOtpController,
);

authRouter.post(
  "/forgotten-password",
  otpSendLimiter,
  validate({ body: forgottenPasswordSchema }),
  forgottenPasswordController,
);

authRouter.post(
  "/reset-password",
  resetPasswordLimiter,
  validate({ body: resetPasswordSchema }),
  resetPasswordController,
);

authRouter.post(
  "/change-password",
  validate({ body: resetPasswordSchema }),
  chnagePasswordController,
);
