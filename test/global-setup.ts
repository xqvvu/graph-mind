import path from "node:path";

export default async function globalSetup() {
  // Load test environment variables
  process.loadEnvFile(
    path.join(import.meta.dirname, "../apps/backend/.env.test"),
  );
}
