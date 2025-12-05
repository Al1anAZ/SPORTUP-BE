import { Router } from "express";
import { ROUTES } from "../../constants";
import { validate } from "../../middleware/validateHandler.middleware";
import { loginSchema, registerSchema } from "./auth.schema";
import { register, login, refreshToken, logout } from "./auth.controller";
import { authMiddleware } from "@/middleware/auth.middleware";

const authRouter = Router();

authRouter.post(ROUTES.LOGIN, validate(loginSchema), login);
authRouter.post(ROUTES.REGISTER, validate(registerSchema), register);
authRouter.post(ROUTES.REFRESH_TOKEN, refreshToken);
authRouter.post(ROUTES.LOGOUT, authMiddleware, logout);

export default authRouter;
