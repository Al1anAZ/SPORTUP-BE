import { User } from "@prisma/client";

export const sanitizeUser = (user: User) => {
  const { password, deleted, updatedAt, createdAt, id, avatarKey , ...safeUser } = user;
  return safeUser;
};