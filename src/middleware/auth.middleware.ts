import { RequestHandler } from "express";
import { TokenService } from "@/modules/auth/token.service";

export const authMiddleware: RequestHandler = (req, _, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const error = new Error("Unauthorized");
    (error as any).status = 401;
    return next(error);
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = TokenService.verifyAccessToken(token);
    req.userId = payload.userId;
    next();
  } catch (err: any) {
    return next(err);
  }
};
