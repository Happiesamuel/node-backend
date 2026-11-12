import { Router } from "express";
import { loginController } from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import { loginSchema } from "../../schemas/auth.schema";

export const authRouter = Router();

authRouter.post("/login", validate({ body: loginSchema }), loginController);
