import type { Pool, PoolOptions } from "pg";

export type VectorDbVendor = "pgvector";

export type VectorDbStatement = {
  statement: string;
  params?: unknown[];
};

export type VectorDbAdapterOptions = {
  url: string;
  poolMaxConnections: number;
  poolIdleTimeoutMillis: number;
  poolMaxLifetimeSeconds: number;
};

export type VectorDbConfig = {
  vendor: VectorDbVendor;
  options: VectorDbAdapterOptions;
};

export type VectorDbAdapter = {
  vendor: VectorDbVendor;
  configure: () => Promise<void>;
  destroy: () => Promise<void>;
  getPool: () => Pool;
  newPool: (options?: PoolOptions) => Pool;
  query: <T = unknown>(input: VectorDbStatement) => Promise<T[]>;
  create: <T = unknown>(input: VectorDbStatement) => Promise<T[]>;
  read: <T = unknown>(input: VectorDbStatement) => Promise<T[]>;
  update: <T = unknown>(input: VectorDbStatement) => Promise<T[]>;
  delete: <T = unknown>(input: VectorDbStatement) => Promise<T[]>;
};
