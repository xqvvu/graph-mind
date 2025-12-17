import { ErrorCode } from "@graph-mind/shared/lib/error-codes";
import { isError, isNil, isNotNil, toMerged } from "es-toolkit";
import type { PoolClient, PoolOptions } from "pg";
import { Pool } from "pg";
import { SystemException } from "@/exceptions/system-exception";
import { getLogger, infra } from "@/infra/logger";
import { getConfig } from "@/lib/config";

let pool: Pool | null = null;

export async function configure() {
  if (isNil(pool)) {
    const config = getConfig();

    pool = new Pool({
      connectionString: config.ageUrl,
      max: config.agePoolMaxConnections,
      idleTimeoutMillis: config.agePoolIdleTimeoutMillis,
      maxLifetimeSeconds: config.agePoolMaxLifetimeSeconds,
    });
  }

  pool.on("connect", (conn) => {
    const sql = `
LOAD 'age';
SET search_path = ag_catalog, "$user", public;`;

    conn.query(sql);
  });

  let client: PoolClient | null = null;
  try {
    client = await pool.connect();
    await client.query("SELECT 1");
    getLogger(infra.age).info("AGE is ready");
  } catch (error) {
    const message = isError(error) ? error.message : "Unknown error";
    getLogger(infra.age).error(`Failed to connect to AGE: ${message}`);
    throw new SystemException({
      errcode: ErrorCode.INTERNAL_ERROR,
      message: `Failed to connect to AGE: ${message}`,
    });
  } finally {
    client?.release();
  }
}

export function getAgePool() {
  if (isNil(pool)) {
    throw new SystemException({
      errcode: ErrorCode.INTERNAL_ERROR,
      message: "Failed to get an AGE connection",
    });
  }

  return pool;
}

export function newAgePool(options?: PoolOptions) {
  if (isNil(pool)) {
    throw new SystemException({
      errcode: ErrorCode.INTERNAL_ERROR,
      message: "Failed to create a new AGE connection pool",
    });
  }

  const poolOptions = toMerged(pool.options, options ?? {});

  return new Pool(poolOptions);
}

export async function destroyAgePool() {
  if (isNotNil(pool) && !pool.ended) {
    await pool.end();
  }
  pool = null;
}
