import { sessions } from "@gd/shared/tables/auth";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

export const SelectSessionSchema = createSelectSchema(sessions);
export type ISession = z.infer<typeof SelectSessionSchema>;
