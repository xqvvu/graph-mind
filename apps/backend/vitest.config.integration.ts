import tsconfigPaths from "vite-tsconfig-paths";
import { defineProject } from "vitest/config";

export default defineProject({
  plugins: [tsconfigPaths()],

  test: {
    name: "backend:integration",
    testTimeout: 30000,
    environment: "node",
    globalSetup: [
      "../../test/global-setup.ts",
      "test/integration/global-setup.ts",
    ],
    setupFiles: ["test/integration/setup.ts"],
    include: ["test/integration/**/*.{test,spec}.ts"],
  },
});
