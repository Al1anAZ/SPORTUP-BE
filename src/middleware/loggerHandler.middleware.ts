import { RequestHandler } from "express";
import { logger } from "../server";

export const loogerHandlerMiddleware: RequestHandler = (req, _, next) => {
  logger.log(`${req.path} ${req.method}`);
  next();
};
