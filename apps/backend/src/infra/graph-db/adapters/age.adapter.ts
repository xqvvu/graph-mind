import { isNil, isNotNil, toMerged } from "es-toolkit";
import type { PoolClient, PoolOptions } from "pg";
import { Pool } from "pg";
import { getErrorMessage } from "@/errors";
import { getLogger, infra } from "@/infra/logger";
import type { GraphDbAdapter, GraphDbAdapterOptions, GraphDbStatement } from "../interface";

export function createAgeAdapter(options: GraphDbAdapterOptions): GraphDbAdapter {
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
      getLogger(infra.graphDb).info("Graph DB (AGE) is ready");
    } catch (error) {
      const message = getErrorMessage(error);
      throw new Error(`Graph DB (AGE) is not ready: ${message}`);
    } finally {
      client?.release();
    }
  }

  function getPool() {
    if (isNil(pool)) {
      throw new Error("Graph DB (AGE) is not ready");
    }

    return pool;
  }

  function newPool(poolOptions?: PoolOptions) {
    if (isNil(pool)) {
      throw new Error("Create a new graph DB connection pool failed");
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

  async function query<T>({ statement, params = [] }: GraphDbStatement): Promise<T[]> {
    const currentPool = getPool();
    const { rows } = await currentPool.query(statement, params);
    return rows as T[];
  }

  return {
    vendor: "age",
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
