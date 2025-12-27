import { getLogger, infra } from "@/infra/logger";

export function getCacheLogger() {
  return getLogger(infra.cache);
}
