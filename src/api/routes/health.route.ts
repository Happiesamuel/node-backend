import { NextFunction, Request, Response, Router } from "express";

export const healthRouter = Router();

healthRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(300).json({ success: true, message: "Ok" });
    } catch (error) {
      next(error);
    }
  },
);
