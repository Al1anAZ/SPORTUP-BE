import { prismaClient } from "@/lib/prisma";
import { loginInput, registerInput } from "./auth.schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "@/config";
import { createError } from "@/utils/createError";
import { User } from "@prisma/client";

export class authService {
  static async login({ email, password }: loginInput) {
    const user = await prismaClient.user.findUniqueOrThrow({
      where: { email },
    });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    const tokens = this.generateTokens(user.id, user.role);

    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return { ...tokens };
  }

  static async register(registerData: registerInput) {
    const hashedPassword = await bcrypt.hash(
      registerData.password,
      config.BCRYPT_SALT_ROUNDS
    );
    const user = await prismaClient.user.create({
      data: { ...registerData, password: hashedPassword },
    });
    const tokens = this.generateTokens(user.id, user.role);

    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return { ...tokens };
  }

  static generateTokens(userId: number, role: User["role"]) {
    const accessToken = jwt.sign({ userId, role }, config.JWT_SECRET, {
      expiresIn: config.ACCESS_TOKEN_EXPIRE,
    });
    const refreshToken = jwt.sign({ userId, role }, config.JWT_REFRESH_SECRET, {
      expiresIn: config.REFRESH_TOKEN_EXPIRES,
    });
    return { accessToken, refreshToken };
  }

  static async saveRefreshToken(userId: number, refreshToken: string) {
    const tokenHash = await bcrypt.hash(
      refreshToken,
      config.BCRYPT_SALT_ROUNDS
    );
    const expiresAt = new Date(
      Date.now() + config.REFRESH_TOKEN_EXPIRES * 1000
    );

    return prismaClient.refreshToken.create({
      data: { userId, tokenHash, expiresAt },
    });
  }

  static async removeRefreshToken(refreshToken: string, userId: number) {
    const tokens = await prismaClient.refreshToken.findMany({
      where: { userId },
    });
    for (const record of tokens) {
      const match = await bcrypt.compare(refreshToken, record.tokenHash);
      if (match) {
        return prismaClient.refreshToken.delete({ where: { id: record.id } });
      }
    }
    throw createError("P2025", "Refresh token not found");
  }

  static async rotateRefreshToken(userId: number, role: User["role"], refreshToken: string) {
    await this.validateRefreshToken(refreshToken, userId);
    await this.removeRefreshToken(refreshToken, userId);

    const tokens = this.generateTokens(userId, role);

    await this.saveRefreshToken(userId, tokens.refreshToken);

    return tokens;
  }

  static verifyAccessToken(token: string) {
    return jwt.verify(token, config.JWT_SECRET) as { userId: number, role: User["role"] };
  }

  static verifyRefreshToken(token: string) {
    return jwt.verify(token, config.JWT_REFRESH_SECRET) as { userId: number, role: User["role"] };
  }

  static async validateRefreshToken(refreshToken: string, userId: number) {
    const tokens = await prismaClient.refreshToken.findMany({
      where: { userId, expiresAt: { gt: new Date() } },
    });

    for (const record of tokens) {
      const match = await bcrypt.compare(refreshToken, record.tokenHash);
      if (match && record.expiresAt > new Date()) {
        return;
      }
    }
    throw createError("P2025", "Refresh token not found");
  }
}
