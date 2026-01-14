import { prismaClient } from "@/lib/prisma";

export class RefreshTokenRepository {
  static create(userId: number, tokenHash: string, expiresAt: Date) {
    return prismaClient.refreshToken.create({
      data: { userId, tokenHash, expiresAt },
    });
  }

  static findValidByUser(userId: number) {
    return prismaClient.refreshToken.findMany({
      where: {
        userId,
        expiresAt: { gt: new Date() },
      },
    });
  }

  static deleteById(id: number) {
    return prismaClient.refreshToken.delete({ where: { id } });
  }

  static deleteByUserId(userId: number) {
    return prismaClient.refreshToken.deleteMany({ where: { userId } });
  }
}
