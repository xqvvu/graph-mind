import path from "node:path";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { getDb } from "@/infra/database";
import { prepare } from "@/main";

export default async function () {
  await prepare();

  await migrate(getDb(), {
    migrationsFolder: path.join(import.meta.dirname, "../../drizzle"),
  });
}
