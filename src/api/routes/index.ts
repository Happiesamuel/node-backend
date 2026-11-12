import { Router } from "express";
import { healthRouter } from "./health.route";
import { authRouter } from "./auth.route";

export const api = Router();

api.use("/health", healthRouter);

api.use("/auth", authRouter);
