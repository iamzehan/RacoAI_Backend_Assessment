import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("3000"),
  // environment
  NODE_ENV: z.enum(["development", "production", "test"]),
  // session
  SESSION_SECRET: z.string(),
  // database
  DATABASE_URL: z.string(),
  // jwt
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  // password hashing
  PASSWORD_HASH_SALT: z.string(),
  // redis
  REDIS_URL: z.string(),
});

export const env = envSchema.parse(process.env);
