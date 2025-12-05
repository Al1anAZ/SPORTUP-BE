import { RequestHandler } from "express";
import { userService } from "./user.service";
import { fileTypeFromBuffer } from "file-type";

export const getUserInfo: RequestHandler = async (req, res, next) => {
  try {
    const user = await userService.userInfo(req.userId);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUserAvatar: RequestHandler = async (req, res, next) => {
  try {
    const type = await fileTypeFromBuffer(req.file.buffer);

    if (!type || !["image/png", "image/jpeg"].includes(type.mime)) {
      res.status(400).json("Invalid file type");
    }

    const avatarUrl = await userService.uploadAvatar(req.userId, req.file);

    return res.json({ avatarUrl });
  } catch (error) {
    next(error);
  }
};

export const updateUserInfo: RequestHandler = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateInfo(req.userId, req.body);

    return res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};
