export {
  configure,
  type Database as DB,
  destroyDb,
  getDb,
} from "@/infra/database/client";
export { getDbLogger } from "@/infra/database/helpers";
