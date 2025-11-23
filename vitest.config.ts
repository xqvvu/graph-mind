import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      "apps/backend/vitest.config.unit.ts",
      "apps/backend/vitest.config.integration.ts",
      "packages/shared/vitest.config.ts",
    ],
  },
});
