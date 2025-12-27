import { getLogger, infra } from "@/infra/logger";

export function getRelDbLogger() {
  return getLogger(infra.relDb);
}
