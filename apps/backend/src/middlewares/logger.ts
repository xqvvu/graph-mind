import { performance } from "node:perf_hooks";
import { createMiddleware } from "hono/factory";
import { getLogger, http } from "@/infra/logger";

export const logger = createMiddleware<Env>(async function loggerMiddleware(c, next) {
  c.set("logger", getLogger(http.warn));

  const method = c.req.method;
  const path = c.req.path;

  getLogger(http.request).info(`[${method}] ${path}`);
  const start = performance.now();

  await next();

  const duration = Number((performance.now() - start).toFixed(3));
  getLogger(http.response).info(`[${method}] ${path} - ${duration}ms ${c.res.status}`);
});
