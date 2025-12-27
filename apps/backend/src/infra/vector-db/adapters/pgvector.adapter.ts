import { isNil, isNotNil, toMerged } from "es-toolkit";
import type { PoolClient, PoolOptions } from "pg";
import { Pool } from "pg";
import { getErrorMessage } from "@/errors";
import { getLogger, infra } from "@/infra/logger";
import type { VectorDbAdapter, VectorDbAdapterOptions, VectorDbStatement } from "../interface";

export function createPgvectorAdapter(options: VectorDbAdapterOptions): VectorDbAdapter {
  let pool: Pool | null = null;

  async function configure() {
    if (isNil(pool)) {
      pool = new Pool({
        connectionString: options.url,
        max: options.poolMaxConnections,
        idleTimeoutMillis: options.poolIdleTimeoutMillis,
        maxLifetimeSeconds: options.poolMaxLifetimeSeconds,
        keepAlive: true,
        keepAliveInitialDelayMillis: 10_000,
      });
    }

    let client: PoolClient | null = null;
    try {
      client = await pool.connect();
      await client.query("SELECT 1");
      getLogger(infra.vectorDb).info("Vector DB (pgvector) is ready");
    } catch (error) {
      const message = getErrorMessage(error);
      throw new Error(`Vector DB (pgvector) is not ready: ${message}`);
    } finally {
      client?.release();
    }
  }

  function getPool() {
    if (isNil(pool)) {
      throw new Error("Vector DB (pgvector) is not ready");
    }

    return pool;
  }

  function newPool(poolOptions?: PoolOptions) {
    if (isNil(pool)) {
      throw new Error("Create a new vector DB connection pool failed");
    }

    const nextOptions = toMerged(pool.options, poolOptions ?? {});

    return new Pool(nextOptions);
  }

  async function destroy() {
    if (isNotNil(pool) && !pool.ended) {
      await pool.end();
    }
    pool = null;
  }

  async function query<T>({ statement, params = [] }: VectorDbStatement): Promise<T[]> {
    const currentPool = getPool();
    const { rows } = await currentPool.query(statement, params);
    return rows as T[];
  }

  return {
    vendor: "pgvector",
    configure,
    destroy,
    getPool,
    newPool,
    query,
    create: query,
    read: query,
    update: query,
    delete: query,
  };
}
