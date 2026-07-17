import "dotenv/config";
import path from "node:path";
import { z } from "zod";

const booleanFromEnv = z.preprocess((value) => {
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  return value;
}, z.boolean());

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  APP_URL: z.string().url().default("http://localhost:3333"),
  WEB_URL: z.string().url().default("http://localhost:3000"),
  MONGODB_URI: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  JWT_EXPIRES_IN: z.string().default("1d"),
  AUTH_COOKIE_NAME: z.string().default("portfolio_token"),
  ADMIN_NAME: z.string().default("Admin"),
  ADMIN_EMAIL: z.string().email().default("admin@example.com"),
  ADMIN_PASSWORD: z.string().min(8).default("change-me-now"),
  UPLOADS_ROOT: z.string().default("../../storage/tmp/uploads"),
  FILES_BASE_PATH: z.string().default("/files"),
  GITHUB_TOKEN: z.string().optional(),
  AUTH_ENABLED: booleanFromEnv.default(false),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().default("Portfolio <onboarding@resend.dev>"),
});

const parsed = envSchema.parse(process.env);

export const env = {
  port: parsed.PORT,
  appUrl: parsed.APP_URL,
  webUrl: parsed.WEB_URL,
  mongodbUri: parsed.MONGODB_URI,
  jwtSecret: parsed.JWT_SECRET,
  jwtExpiresIn: parsed.JWT_EXPIRES_IN,
  authCookieName: parsed.AUTH_COOKIE_NAME,
  adminName: parsed.ADMIN_NAME,
  adminEmail: parsed.ADMIN_EMAIL,
  adminPassword: parsed.ADMIN_PASSWORD,
  uploadsRoot: path.resolve(process.cwd(), parsed.UPLOADS_ROOT),
  filesBasePath: parsed.FILES_BASE_PATH,
  githubToken: parsed.GITHUB_TOKEN,
  authEnabled: parsed.AUTH_ENABLED,
  resendApiKey: parsed.RESEND_API_KEY,
  resendFromEmail: parsed.RESEND_FROM_EMAIL,
};
