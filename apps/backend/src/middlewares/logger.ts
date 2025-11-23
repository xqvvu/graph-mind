import { performance } from "node:perf_hooks";
import { createMiddleware } from "hono/factory";
import { getLogger, http } from "@/infra/logger";

export const logger = createMiddleware<Env>(
  async function loggerMiddleware(c, next) {
    c.set("logger", getLogger(http.warn));

    const requestLogger = getLogger(http.request);
    requestLogger.info`${c.req.method} ${c.req.path}`;
    const start = performance.now();

    await next();

    const duration = Number((performance.now() - start).toFixed(3));
    const responseLogger = getLogger(http.response);
    responseLogger.info`${c.res.status} ${c.req.method} ${c.req.path} - ${duration}ms`;
  },
);
