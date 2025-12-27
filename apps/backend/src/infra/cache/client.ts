import { isNil, isNotNil } from "es-toolkit";
import { createClient } from "redis";
import { getErrorMessage } from "@/errors";
import { getLogger, infra } from "@/infra/logger";
import { getConfig } from "@/lib/config";

export type CacheClient = ReturnType<typeof createClient>;
let client: CacheClient | null = null;

export async function configureCache() {
  if (isNotNil(client)) return;

  const config = getConfig();
  const logger = getLogger(infra.cache);

  client = createClient({
    RESP: 3,
    url: config.cache.options.url,
    maintNotifications: "disabled",
    socket: {
      keepAlive: true,
      connectTimeout: 5_000,
      reconnectStrategy: (times) => Math.min(times * 100, 1_000),
    },
    commandOptions: {
      timeout: 3_000,
    },
  });

  client.on("ready", () => void logger.info("Cache is ready"));
  client.on("error", (err) => void logger.error(getErrorMessage(err)));

  await client.connect();
}

export function getCache() {
  if (isNil(client)) {
    throw new Error("Cache is not ready");
  }

  return client;
}

export async function destroyCache() {
  if (isNotNil(client)) {
    await client.quit();
    client = null;
  }
}
