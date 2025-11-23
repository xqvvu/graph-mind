import { compact, trim } from "es-toolkit";
import { z } from "zod";

export const ConfigSchema = z.object({
  NODE_ENV: z.string().optional(),
  PORT: z.coerce.number<number>().int().min(1024).max(65535).default(10001),
  DATABASE_URL: z.string().regex(/^postgres(?:ql)?:\/\//),
  REDIS_URL: z.string().regex(/^redis{1,2}?:\/\//),
  CORS_ALLOWED_ORIGINS: z
    .string()
    .pipe(z.transform((v) => compact(v.split(",")).map((o) => trim(o))))
    .pipe(z.array(z.url().or(z.literal("*"))))
    .default([]),
  LOCALE: z.string().default("zh-CN"),
  TZ: z.string().default("Asia/Shanghai"),
  BETTER_AUTH_SECRET: z.string().nonempty(),
  BETTER_AUTH_URL: z.url(),
});
export type ConfigInit = z.infer<typeof ConfigSchema>;
