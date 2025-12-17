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
      connectionString: config.pgvectorUrl,
      max: config.pgvectorPoolMaxConnections,
      idleTimeoutMillis: config.pgvectorPoolIdleTimeoutMillis,
      maxLifetimeSeconds: config.pgvectorPoolMaxLifetimeSeconds,
    });

    let clinet: PoolClient | null = null;
    try {
      clinet = await pool.connect();
      await clinet.query("SELECT 1");
      getLogger(infra.pgvector).info("PgVector is ready");
    } catch (error) {
      const message = isError(error) ? error.message : "Unknown error";
      getLogger(infra.pgvector).error(`Failed to connect to PgVector: ${message}`);
      throw new SystemException({
        errcode: ErrorCode.INTERNAL_ERROR,
        message: `Failed to connect to PgVector: ${message}`,
      });
    } finally {
      clinet?.release();
    }
  }
}

export function getPgVectorPool() {
  if (isNil(pool)) {
    throw new SystemException({
      errcode: ErrorCode.INTERNAL_ERROR,
      message: "Failed to get an PgVector connection",
    });
  }

  return pool;
}

export function newPgVectorPool(options?: PoolOptions) {
  if (isNil(pool)) {
    throw new SystemException({
      errcode: ErrorCode.INTERNAL_ERROR,
      message: "Failed to create a new PgVector connection pool",
    });
  }

  const poolOptions = toMerged(pool.options, options ?? {});

  return new Pool(poolOptions);
}

export async function destroyPgVectorPool() {
  if (isNotNil(pool) && !pool.ended) {
    await pool.end();
  }
  pool = null;
}
