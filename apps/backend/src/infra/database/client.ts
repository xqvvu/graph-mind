import { ErrorCode } from "@graph-mind/shared/lib/error-codes";
import { schema } from "@graph-mind/shared/schemas";
import { drizzle } from "drizzle-orm/node-postgres";
import { isError, isNil, isNotNil } from "es-toolkit";
import type { PoolClient } from "pg";
import { SystemException } from "@/exceptions/system-exception";
import { getLogger, infra } from "@/infra/logger";
import { getConfig } from "@/lib/config";

export type Database = ReturnType<typeof drizzle<typeof schema>>;

let db: Database | null = null;

export async function configure() {
  if (isNil(db)) {
    const config = getConfig();

    db = drizzle({
      schema,
      casing: "snake_case",
      connection: config.databaseUrl,
    });

    let clinet: PoolClient | null = null;
    try {
      clinet = await db.$client.connect();
      await clinet.query("SELECT 1");
      getLogger(infra.database).info("Database is ready");
    } catch (error) {
      const message = isError(error) ? error.message : "Unknown error";
      getLogger(infra.database).error(`Failed to connect to database: ${message}`);
      throw new SystemException({
        errcode: ErrorCode.INTERNAL_ERROR,
        message: `Failed to connect to database: ${message}`,
      });
    } finally {
      clinet?.release();
    }
  }
}

export function getDb() {
  if (isNil(db)) {
    throw new SystemException({
      errcode: ErrorCode.INTERNAL_ERROR,
      message: "Database has not been initialized yet",
    });
  }

  return db;
}

export async function destroyDb() {
  if (isNotNil(db)) {
    await db.$client.end();
    db = null;
  }
}
