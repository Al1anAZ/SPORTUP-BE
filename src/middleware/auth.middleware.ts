import { RequestHandler } from "express";
import { authService } from "@/modules/auth/auth.service";

export const authMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const error = new Error("Unauthorized");
    (error as any).status = 401;
    return next(error);
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = authService.verifyAccessToken(token);
    req.userId = payload.userId;
    next();
  } catch (err: any) {
    return next(err);
  }
};
