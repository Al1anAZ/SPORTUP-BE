import { RequestHandler } from "express";
import { UserService } from "./user.service";
import { fileTypeFromBuffer } from "file-type";
import { createError } from "@/utils/createError";
import { ValidatedRequest } from "@/types/validation.middleware";
import { User } from "@prisma/client";

export const getUserProfile: RequestHandler = async (req, res, next) => {
  try {
    const userProfile = await UserService.getUserProfile(req.userId);
    return res.json(userProfile);
  } catch (error) {
    next(error);
  }
};

export const updateUserAvatar: RequestHandler = async (req, res, next) => {
  try {
    const type = await fileTypeFromBuffer(req.file.buffer);

    if (!type || !["image/png", "image/jpeg"].includes(type.mime)) {
      throw createError("InvalidType", "Invalid File Type");
    }

    const avatarUrl = await UserService.uploadAvatar(req.userId, req.file);

    return res.json({ avatarUrl });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile: RequestHandler = async (
  req: ValidatedRequest<User>,
  res,
  next
) => {
  try {
    const updatedProfile = await UserService.updateUserProfile(
      req.userId,
      req.validatedBody
    );

    return res.json(updatedProfile);
  } catch (error) {
    next(error);
  }
};
