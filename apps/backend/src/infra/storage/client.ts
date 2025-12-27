import { isNil, isNotNil } from "es-toolkit";
import { getConfig } from "@/lib/config";
import { AwsS3Adapter } from "./adapters/aws-s3.adapter";
import { MemoryAdapter } from "./adapters/memory.adapter";
import { MinioAdapter } from "./adapters/minio.adapter";
import { RustFsAdapter } from "./adapters/rustfs.adapter";
import type { IStorage, IStorageOptions } from "./interface";

let storageClient: IStorage | null = null;

/**
 * 创建存储适配器实例
 */
function createStorageAdapter(options: IStorageOptions): IStorage {
  switch (options.vendor) {
    case "aws-s3": {
      return new AwsS3Adapter(options);
    }

    case "rustfs": {
      return new RustFsAdapter(options);
    }

    case "minio": {
      return new MinioAdapter(options);
    }

    case "r2": {
      throw new Error("R2 adapter not implemented");
    }

    case "oss": {
      throw new Error("OSS adapter not implemented");
    }

    case "cos": {
      throw new Error("COS adapter not implemented");
    }

    case "memory": {
      return new MemoryAdapter(options);
    }

    default: {
      throw new Error(`Unsupported storage vendor: ${options.vendor}`);
    }
  }
}

/**
 * 配置存储实例，使用 internalEndpoint 创建主实例
 */
export async function configureStorage() {
  if (isNil(storageClient)) {
    const { storage } = getConfig();

    // 使用 internal endpoint 创建主实例（用于服务端操作）
    const options: IStorageOptions = {
      vendor: storage.vendor,
      endpoint: storage.options.internalEndpoint,
      region: storage.options.region,
      forcePathStyle: storage.options.forcePathStyle,
      accessKeyId: storage.options.accessKeyId,
      secretAccessKey: storage.options.secretAccessKey,
    };

    storageClient = createStorageAdapter(options);
  }
}

/**
 * 获取存储实例，用于服务端操作
 */
export function getStorage() {
  if (isNil(storageClient)) {
    throw new Error("Storage is not ready");
  }
  return storageClient;
}

/**
 * 获取配置中的 bucket 名称
 */
export function getBucketNames() {
  const { storage } = getConfig();
  return {
    publicBucket: storage.options.publicBucketName,
    privateBucket: storage.options.privateBucketName,
  };
}

/**
 * 获取端点配置
 */
export function getEndpoints() {
  const { storage } = getConfig();
  return {
    internalEndpoint: storage.options.internalEndpoint,
    externalEndpoint: storage.options.externalEndpoint,
  };
}

export async function destroyStorage() {
  if (isNotNil(storageClient)) {
    storageClient.destroy();
    storageClient = null;
  }
}
