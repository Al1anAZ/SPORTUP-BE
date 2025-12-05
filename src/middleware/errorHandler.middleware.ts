import { ErrorRequestHandler } from "express";
import { logger } from "../server";
import { ERROR_MAP } from "@/constants";

type KnownError = {
  name?: string;
  code?: string;
  status?: number;
  message?: string;
};

export const errorHandlerMiddleware: ErrorRequestHandler = (
  error: KnownError,
  req,
  res,
  _
) => {
  const { name, code, message, status } = error;

  let statusCode = status || 500;
  let msg = message || "Internal Server Error";

  if ((code && ERROR_MAP[code]) || (name && ERROR_MAP[name])) {
    const key = code && ERROR_MAP[code] ? code : name!;
    statusCode = ERROR_MAP[key].status;
    msg = ERROR_MAP[key].msg;
  }

  logger.log(`Error on route ${req.path}: ${msg}`);

  return res.status(statusCode).json({ success: false, message: msg });
};

