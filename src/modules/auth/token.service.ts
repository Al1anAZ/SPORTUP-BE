import config from "@/config";
import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export class TokenService {
  static generate(userId: number, role: User["role"]) {
    const accessToken = jwt.sign({ userId, role }, config.JWT_SECRET, {
      expiresIn: config.ACCESS_TOKEN_EXPIRE,
    });
    const refreshToken = jwt.sign({ userId, role }, config.JWT_REFRESH_SECRET, {
      expiresIn: config.REFRESH_TOKEN_EXPIRES,
    });
    return { accessToken, refreshToken };
  }

  static verifyAccessToken(token: string) {
    return jwt.verify(token, config.JWT_SECRET) as { userId: number, role: User["role"] };
  }

  static verifyRefreshToken(token: string) {
    return jwt.verify(token, config.JWT_REFRESH_SECRET) as { userId: number, role: User["role"] };
  }

  static async hash(value: string) {
    return bcrypt.hash(value, config.BCRYPT_SALT_ROUNDS);
  }

  static async compare(value: string, hash: string) {
    return bcrypt.compare(value, hash);
  }
}