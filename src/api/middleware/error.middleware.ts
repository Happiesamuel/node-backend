import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../utils/ApiError";
import { logger } from "../../utils/logger";

export function ErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.error({ err }, "Unhandled error");
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ message: err.message, success: false });
    return;
  } else {
    console.log(err);
    res.status(500).json({ message: "Internal server error", success: false });
  }
}
