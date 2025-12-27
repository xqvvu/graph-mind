import path from "node:path";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { getRelDb } from "@/infra/rel-db";
import { prepare } from "@/main";

export default async function () {
  await prepare();

  await migrate(getRelDb(), {
    migrationsFolder: path.join(import.meta.dirname, "../../drizzle"),
  });
}
