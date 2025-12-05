import { RequestHandler } from "express";
import { authService } from "./auth.service";
import config from "@/config";

export const register: RequestHandler = async (req, res, next) => {
  try {
    const registerData = await authService.register(req.body);
    res.cookie("refreshToken", registerData.refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: config.REFRESH_TOKEN_EXPIRES * 1000,
    });
    res.json({
      accessToken: registerData.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const loginData = await authService.login(req.body);
    res.cookie("refreshToken", loginData.refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: config.REFRESH_TOKEN_EXPIRES * 1000,
    });
    res.json({
      accessToken: loginData.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken: RequestHandler = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const payload = authService.verifyRefreshToken(refreshToken);

    const { refreshToken: newRefreshToken, accessToken } =
      await authService.rotateRefreshToken(payload.userId, refreshToken);

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
    const payload = authService.verifyRefreshToken(refreshToken);
    await authService.removeRefreshToken(refreshToken, payload.userId);

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
