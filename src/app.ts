import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import { loogerHandlerMiddleware } from "./middleware/loggerHandler.middleware";
import { errorHandlerMiddleware } from "./middleware/errorHandler.middleware";
import authRouter from "./modules/auth/auth.route";
import userRouter from "./modules/user/user.route";
import config from "./config";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed = config.CORS_ALLOW.includes(origin);
      callback(null, isAllowed);
    },
    credentials: true, 
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(loogerHandlerMiddleware);

app.use('/api/v1', authRouter);
app.use('/api/v1', userRouter);

app.use(errorHandlerMiddleware);

export default app;
