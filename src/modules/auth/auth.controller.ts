import { RequestHandler } from "express";
import { AuthService } from "./auth.service";
import config from "@/config";
import { ValidatedRequest } from "@/types/validation.middleware";
import { loginDTO, registerDTO } from "./auth.schema";
import { TokenService } from "./token.service";

export const register: RequestHandler = async (
  req: ValidatedRequest<registerDTO>,
  res,
  next
) => {
  try {
    const tokens = await AuthService.register(req.validatedBody);
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: config.REFRESH_TOKEN_EXPIRES * 1000,
    });
    res.json({
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const login: RequestHandler = async (
  req: ValidatedRequest<loginDTO>,
  res,
  next
) => {
  try {
    const tokens = await AuthService.login(req.validatedBody);
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: config.REFRESH_TOKEN_EXPIRES * 1000,
    });
    res.json({
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken: RequestHandler = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const payload = TokenService.verifyRefreshToken(refreshToken);

    const { refreshToken: newRefreshToken, accessToken } =
      await AuthService.rotateRefreshToken(
        payload.userId,
        payload.role,
        refreshToken
      );

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: config.REFRESH_TOKEN_EXPIRES * 1000,
    });

    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const payload = TokenService.verifyRefreshToken(refreshToken);
    await AuthService.logout(payload.userId);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "lax",
    });
    res.status(200).json({ message: "Logged out" });
  } catch (error) {
    next(error);
  }
};
