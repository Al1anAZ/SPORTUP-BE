import { User } from "@prisma/client";
import "express";

declare module "express-serve-static-core" {
  interface Request {
    userId?: number;
    role?: User["role"]
  }
}