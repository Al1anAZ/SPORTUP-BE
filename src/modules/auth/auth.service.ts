import { prismaClient } from "@/lib/prisma";
import { loginDTO, registerDTO } from "./auth.schema";
import config from "@/config";
import { createError } from "@/utils/createError";
import { User } from "@prisma/client";
import { TokenService } from "./token.service";
import { RefreshTokenRepository } from "./refresh-token.repository";

export class AuthService {
  static async login({ email, password }: loginDTO) {
    const user = await prismaClient.user.findUniqueOrThrow({
      where: { email },
    });

    const valid = await TokenService.compare(password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    const tokens = TokenService.generate(user.id, user.role);

    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return { ...tokens };
  }

  static async register(registerData: registerDTO) {
    const hashedPassword = await TokenService.hash(
      registerData.password
    );
    const user = await prismaClient.user.create({
      data: { ...registerData, password: hashedPassword },
    });
    const tokens = TokenService.generate(user.id, user.role);

    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return { ...tokens };
  }

  static async logout(userId: number) {
    await RefreshTokenRepository.deleteByUserId(userId);
  }

  static async rotateRefreshToken(userId: number, role: User["role"], refreshToken: string) {
    await this.assertRefreshTokenValid(userId, refreshToken);

    const tokens = TokenService.generate(userId, role);

    await this.storeRefreshToken(userId, tokens.refreshToken);

    return tokens;
  }

  private static async assertRefreshTokenValid(
    userId: number,
    refreshToken: string
  ) {
    const tokens = await RefreshTokenRepository.findValidByUser(userId);

    if (tokens.length === 0) {
      throw createError("P2025", "Refresh token not found");
    }

    for (const record of tokens) {
      const match = await TokenService.compare(
        refreshToken,
        record.tokenHash
      );
      if (match) {
        await RefreshTokenRepository.deleteById(record.id);
        return;
      }
    }

    throw createError("P2025", "Refresh token not found");
  }

  private static async storeRefreshToken(
    userId: number,
    refreshToken: string
  ) {
    const tokenHash = await TokenService.hash(refreshToken);
    const expiresAt = new Date(
      Date.now() + config.REFRESH_TOKEN_EXPIRES * 1000
    );

    return RefreshTokenRepository.create(
      userId,
      tokenHash,
      expiresAt
    );
  }
}
