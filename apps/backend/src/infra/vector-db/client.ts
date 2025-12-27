import { isNil } from "es-toolkit";
import type { PoolOptions } from "pg";
import { getConfig } from "@/lib/config";
import { createPgvectorAdapter } from "./adapters/pgvector.adapter";
import type { VectorDbAdapter, VectorDbConfig, VectorDbStatement } from "./interface";

let adapter: VectorDbAdapter | null = null;

function createAdapter(config: VectorDbConfig): VectorDbAdapter {
  switch (config.vendor) {
    case "pgvector": {
      return createPgvectorAdapter(config.options);
    }
    default: {
      throw new Error(`Unsupported vector-db vendor: ${config.vendor}`);
    }
  }
}

function getAdapter() {
  if (isNil(adapter)) {
    throw new Error("Vector DB is not ready");
  }

  return adapter;
}

export async function configureVectorDb() {
  if (isNil(adapter)) {
    const { vectorDb } = getConfig();
    adapter = createAdapter(vectorDb);
  }

  await adapter.configure();
}

export function getVectorDbPool() {
  return getAdapter().getPool();
}

export function newVectorDbPool(options?: PoolOptions) {
  return getAdapter().newPool(options);
}

export async function destroyVectorDb() {
  if (isNil(adapter)) return;
  const current = adapter;
  adapter = null;
  await current.destroy();
}

export async function queryVectorDb<T = unknown>(input: VectorDbStatement) {
  return getAdapter().query<T>(input);
}

export async function createVectorDb<T = unknown>(input: VectorDbStatement) {
  return getAdapter().create<T>(input);
}

export async function readVectorDb<T = unknown>(input: VectorDbStatement) {
  return getAdapter().read<T>(input);
}

export async function updateVectorDb<T = unknown>(input: VectorDbStatement) {
  return getAdapter().update<T>(input);
}

export async function deleteVectorDb<T = unknown>(input: VectorDbStatement) {
  return getAdapter().delete<T>(input);
}
