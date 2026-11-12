import { Router } from "express";
import {
  chnagePasswordController,
  forgottenPasswordController,
  loginController,
  registerController,
  resetPasswordController,
  verifyOtpController,
} from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import {
  forgottenPasswordSchema,
  loginSchema,
  otpSchema,
  registerSchema,
  resetPasswordSchema,
} from "../../schemas/auth.schema";

export const authRouter = Router();

authRouter.post("/login", validate({ body: loginSchema }), loginController);

authRouter.post(
  "/register",
  validate({ body: registerSchema }),
  registerController,
);

authRouter.post(
  "/verify-otp",
  validate({ body: otpSchema }),
  verifyOtpController,
);

authRouter.post(
  "/forgotten-password",
  validate({ body: forgottenPasswordSchema }),
  forgottenPasswordController,
);

authRouter.post(
  "/reset-password",
  validate({ body: resetPasswordSchema }),
  resetPasswordController,
);

authRouter.post(
  "/change-password",
  validate({ body: resetPasswordSchema }),
  chnagePasswordController,
);
