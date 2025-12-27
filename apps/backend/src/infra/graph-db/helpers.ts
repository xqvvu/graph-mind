import { isError } from "es-toolkit";
import type { PoolClient } from "pg";
import { getLogger, infra } from "@/infra/logger";
import { getGraphDbPool } from "./client";

export async function withTransaction<T>(
  handler: (conn: PoolClient) => Promise<T> | T,
): Promise<T> {
  const pool = getGraphDbPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await handler(client);
    await client.query("COMMIT");

    return result;
  } catch (error) {
    const message = isError(error) ? error.message : "Unknown error";
    getLogger(infra.graphDb).error(`Transaction failed and rollback: ${message}`);

    await client.query("ROLLBACK");

    throw error;
  } finally {
    client.release();
  }
}

export function getGraphDbLogger() {
  return getLogger(infra.graphDb);
}
