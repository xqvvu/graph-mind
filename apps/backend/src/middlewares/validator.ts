import { zValidator } from "@hono/zod-validator";
import type { ZodType } from "zod";

export const validator = <T extends ZodType>(
  type: Parameters<typeof zValidator>[0],
  schema: T,
) =>
  zValidator(type, schema, (result) => {
    if (!result.success) throw result.error;
  });
