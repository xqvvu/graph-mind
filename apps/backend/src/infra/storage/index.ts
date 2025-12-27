export { AwsS3Adapter } from "./adapters/aws-s3.adapter";
export { MemoryAdapter } from "./adapters/memory.adapter";
export { MinioAdapter } from "./adapters/minio.adapter";
export { RustFsAdapter } from "./adapters/rustfs.adapter";
export {
  configureStorage,
  destroyStorage,
  getBucketNames,
  getEndpoints,
  getStorage,
} from "./client";
export { getStorageLogger } from "./helpers";
export type { IStorage } from "./interface";
