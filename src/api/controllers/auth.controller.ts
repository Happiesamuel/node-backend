import { NextFunction, Request, Response } from "express";
import { loginService } from "../../services/auth.service";

export function loginController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, password } = req.body;
    const { accessToken } = loginService({ email, password });
    res.status(200).json({
      success: true,
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
}
