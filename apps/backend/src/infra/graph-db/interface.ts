import type { Pool, PoolOptions } from "pg";

export type GraphDbVendor = "age";

export type GraphDbStatement = {
  statement: string;
  params?: unknown[];
};

export type GraphDbAdapterOptions = {
  url: string;
  poolMaxConnections: number;
  poolIdleTimeoutMillis: number;
  poolMaxLifetimeSeconds: number;
};

export type GraphDbConfig = {
  vendor: GraphDbVendor;
  options: GraphDbAdapterOptions;
};

export type GraphDbAdapter = {
  vendor: GraphDbVendor;
  configure: () => Promise<void>;
  destroy: () => Promise<void>;
  getPool: () => Pool;
  newPool: (options?: PoolOptions) => Pool;
  query: <T = unknown>(input: GraphDbStatement) => Promise<T[]>;
  create: <T = unknown>(input: GraphDbStatement) => Promise<T[]>;
  read: <T = unknown>(input: GraphDbStatement) => Promise<T[]>;
  update: <T = unknown>(input: GraphDbStatement) => Promise<T[]>;
  delete: <T = unknown>(input: GraphDbStatement) => Promise<T[]>;
};
