import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  client: {
    VITE_APP_NAME: z.string().default("Graph Mind"),
    VITE_API_BASE_URL: z.url(),
  },
  clientPrefix: "VITE_",
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});
