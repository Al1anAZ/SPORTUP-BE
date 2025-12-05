import { prismaClient } from "@/lib/prisma";
import { sanitizeUser } from "@/utils/sinitizeUser";
import { awsService } from "../aws/aws.service";
import { User } from "@prisma/client";

export class userService {
  static async userInfo(id: number) {
    const user = await prismaClient.user.findUniqueOrThrow({ where: { id } });
    const avatarUrl = await awsService.s3Get(user.avatarKey);

    return {
      ...sanitizeUser(user),
      avatarUrl,
    };
  }

  static async uploadAvatar(id: number, file: Express.Multer.File) {
    const key = `avatars/${id}-${Date.now()}.jpg`;

    const { key: s3Key } = await awsService.s3Upload(
      file.buffer,
      key,
      file.mimetype
    );

    await prismaClient.user.update({
      where: { id },
      data: { avatarKey: s3Key },
    });

    const newAvatar = await awsService.s3Get(s3Key);
    return newAvatar;
  }

  static async updateInfo(id: number, { name, email, phone, address }: User) {
    const updatedInfo = await prismaClient.user.update({
      where: { id },
      data: { name, email, phone, address },
    });

    return sanitizeUser(updatedInfo);
  }
}
