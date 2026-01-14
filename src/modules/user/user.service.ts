import { prismaClient } from "@/lib/prisma";
import { userSelectDBQuery } from "@/utils/selectDBQuery";
import { AwsService } from "../aws/aws.service";
import { User } from "@prisma/client";

export class UserService {
  static async getUserProfile(id: number) {
    const user = await prismaClient.user.findUniqueOrThrow({
      where: { id },
      select: userSelectDBQuery,
    });
    const avatarUrl = await AwsService.s3Get(user.avatarKey);

    return {
      ...user,
      avatarUrl,
    };
  }

  static async uploadAvatar(id: number, file: Express.Multer.File) {
    const key = `avatars/${id}-${Date.now()}.jpg`;

    const { key: s3Key } = await AwsService.s3Upload(
      file.buffer,
      key,
      file.mimetype
    );

    await prismaClient.user.update({
      where: { id },
      data: { avatarKey: s3Key },
    });

    const newAvatar = await AwsService.s3Get(s3Key);
    return newAvatar;
  }

  static async updateUserProfile(
    id: number,
    { name, email, phone, address }: User
  ) {
    const updatedInfo = await prismaClient.user.update({
      where: { id },
      data: { name, email, phone, address },
      select: userSelectDBQuery,
    });

    return updatedInfo;
  }
}
