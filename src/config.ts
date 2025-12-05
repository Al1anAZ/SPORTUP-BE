import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
  ACCESS_TOKEN_EXPIRES: z.string().transform(Number).default(900),
  REFRESH_TOKEN_EXPIRES: z.string().transform(Number).default(604800),
  BCRYPT_SALT_ROUNDS: z.string().transform(Number).default(10),
  PORT: z.string().transform(Number).default(4000),
  CORS_ALLOW: z
    .string()
    .default("")
    .transform((val) =>
      val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    ),
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
  AWS_REGION: z.string().min(1),
  AWS_BUCKET_NAME: z.string().min(1)
});

const env = envSchema.parse(process.env);

const config = {
  DB_URL: env.DATABASE_URL,
  JWT_SECRET: env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: env.JWT_REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRE: env.ACCESS_TOKEN_EXPIRES,
  REFRESH_TOKEN_EXPIRES: env.REFRESH_TOKEN_EXPIRES,
  BCRYPT_SALT_ROUNDS: env.BCRYPT_SALT_ROUNDS,
  PORT: env.PORT,
  CORS_ALLOW: env.CORS_ALLOW,
  AWS: {
    REGION: env.AWS_REGION,
    ACCESS_KEY_ID: env.AWS_ACCESS_KEY_ID,
    SECRET_ACCESS_KEY: env.AWS_SECRET_ACCESS_KEY,
    BUCKET_NAME: env.AWS_BUCKET_NAME
  },
};

export default config;
