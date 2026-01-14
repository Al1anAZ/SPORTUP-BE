import { ROUTES } from "@/constants";
import { Router } from "express";
import {
  getUserProfile,
  updateUserAvatar,
  updateUserProfile,
} from "./user.controller";
import { authMiddleware } from "@/middleware/auth.middleware";
import { upload } from "@/utils/multer";
import { validateMiddleware } from "@/middleware/validateHandler.middleware";
import { userSchema } from "./user.schema";

const userRouter = Router();

userRouter.get(ROUTES.USER, authMiddleware, getUserProfile);

userRouter.patch(
  ROUTES.AVATAR,
  authMiddleware,
  upload.single("file"),
  updateUserAvatar
);

userRouter.patch(
  ROUTES.USER,
  authMiddleware,
  validateMiddleware({ body: userSchema }),
  updateUserProfile
);

export default userRouter;
