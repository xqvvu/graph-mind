import { isNil } from "es-toolkit";
import type { PoolOptions } from "pg";
import { getConfig } from "@/lib/config";
import { createAgeAdapter } from "./adapters/age.adapter";
import type { GraphDbAdapter, GraphDbConfig, GraphDbStatement } from "./interface";

let adapter: GraphDbAdapter | null = null;

function createAdapter(config: GraphDbConfig): GraphDbAdapter {
  switch (config.vendor) {
    case "age": {
      return createAgeAdapter(config.options);
    }
    default: {
      throw new Error(`Unsupported graph-db vendor: ${config.vendor}`);
    }
  }
}

function getAdapter() {
  if (isNil(adapter)) {
    throw new Error("Graph DB is not ready");
  }

  return adapter;
}

export async function configureGraphDb() {
  if (isNil(adapter)) {
    const { graphDb } = getConfig();
    adapter = createAdapter(graphDb);
  }

  await adapter.configure();
}

export function getGraphDbPool() {
  return getAdapter().getPool();
}

export function newGraphDbPool(options?: PoolOptions) {
  return getAdapter().newPool(options);
}

export async function destroyGraphDb() {
  if (isNil(adapter)) return;
  const current = adapter;
  adapter = null;
  await current.destroy();
}

export async function queryGraphDb<T = unknown>(input: GraphDbStatement) {
  return getAdapter().query<T>(input);
}

export async function createGraphDb<T = unknown>(input: GraphDbStatement) {
  return getAdapter().create<T>(input);
}

export async function readGraphDb<T = unknown>(input: GraphDbStatement) {
  return getAdapter().read<T>(input);
}

export async function updateGraphDb<T = unknown>(input: GraphDbStatement) {
  return getAdapter().update<T>(input);
}

export async function deleteGraphDb<T = unknown>(input: GraphDbStatement) {
  return getAdapter().delete<T>(input);
}
