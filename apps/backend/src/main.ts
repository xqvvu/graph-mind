import { serve } from "@hono/node-server";
import { createApp } from "@/app";
import { configureCache, destroyCache } from "@/infra/cache";
import { configureGraphDb, destroyGraphDb } from "@/infra/graph-db";
import { destroyLogger, getLogger, configure as logger, root } from "@/infra/logger";
import { configureQueue } from "@/infra/queue";
import { configureRelDb, destroyRelDb } from "@/infra/rel-db";
import { configureStorage, destroyStorage } from "@/infra/storage";
import { configureVectorDb, destroyVectorDb } from "@/infra/vector-db";
import { configure as betterAuth } from "@/lib/auth";
import { getConfig } from "@/lib/config";

export async function prepare() {
  await logger();
  await Promise.all([
    configureRelDb(),
    configureGraphDb(),
    configureVectorDb(),
    configureCache(),
    configureStorage(),
    configureQueue(),
    betterAuth(),
  ]);
}

export async function destroy() {
  await Promise.all([
    destroyRelDb(),
    destroyGraphDb(),
    destroyVectorDb(),
    destroyCache(),
    destroyStorage(),
  ]);
  await destroyLogger();
}

async function shutdown() {
  const logger = getLogger(root);
  logger.info("Gracefully shutdown");

  await destroy();
  process.exit(0);
}

async function bootstrap() {
  await prepare();

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);

  const config = getConfig();
  const app = await createApp(config);

  serve(
    {
      fetch: app.fetch,
      port: config.server.port,
    },
    (info) => {
      const logger = getLogger(root);
      const address = info.address === "::" ? "localhost" : info.address;
      const url = `http://${address}:${info.port}`;
      logger.info(`Node.js version: ${process.version}`);
      logger.info(`Server is running on ${url}`);
    },
  );
}

void bootstrap();
