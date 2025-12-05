import { NextFunction, Request } from "express";
import z from "zod";

export const validate =
  <T>(schema: z.ZodType<T>) =>
  (req: Request<{}, any, T>, _, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
