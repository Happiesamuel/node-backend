import dotenv from "dotenv";
import z from "zod";

dotenv.config();

const EnvSchema = z
  .object({
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    PORT: z.coerce.number().default(4000),
    LOG_LEVEL: z.string().default("info"),
  })
  .transform((env) => ({
    ...env,
    IS_PRODUCTION: env.NODE_ENV === "production",
  }));

export const env = EnvSchema.parse(process.env);

// export const env = {
//   PORT: Number(process.env.PORT || 4000),
//   nodeEnv: process.env.NODE_ENV ?? "development",
//   isProduction: (process.env.NODE_ENV ?? "development") === "production",
//   logLevel: process.env.LOG_LEVEL ?? "info",
// };
