import path from "node:path";
import { beforeAll } from "vitest";
import { configureStorage } from "./client";

beforeAll(() => {
  process.loadEnvFile(path.join(import.meta.dirname, "../../../.env"));
  configureStorage();
});
