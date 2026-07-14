import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("3000"),

  // Environment
  NODE_ENV: z.enum(["development", "production", "test"]),

  // Session
  SESSION_SECRET: z.string(),

  // Database
  DATABASE_URL: z.string(),

  // JWT
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),

  // Password Hashing
  PASSWORD_HASH_SALT: z.string(),

  // Redis
  REDIS_HOST: z.string(),
  REDIS_URL: z.string().url(),

  // Stripe
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),

  // bKash
  BKASH_BASE_URL: z.string().url(),
  BKASH_USERNAME: z.string(),
  BKASH_PASSWORD: z.string(),
  BKASH_APP_KEY: z.string(),
  BKASH_APP_SECRET: z.string(),
  BKASH_CALLBACK_URL: z.string().url(),

  // Client and Server URLs
  CLIENT_URL : z.string().url(),
  SERVER_URL : z.string().url()
});

export const env = envSchema.parse(process.env);