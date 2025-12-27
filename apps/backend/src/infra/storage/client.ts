import { isNil, isNotNil } from "es-toolkit";
import { getErrorMessage } from "@/errors";
import { getLogger, infra } from "@/infra/logger";
import { AwsS3ExtendedAdapter } from "@/infra/storage/adapters/aws-s3.extended.adapter";
import { getConfig } from "@/lib/config";
import { AwsS3Adapter } from "./adapters/aws-s3.adapter";
import { MemoryAdapter } from "./adapters/memory.adapter";
import { MinioAdapter } from "./adapters/minio.adapter";
import { RustFsAdapter } from "./adapters/rustfs.adapter";
import type { IStorage } from "./interface";

let publicStorageClient: IStorage | null = null;
let privateStorageClient: IStorage | null = null;

/**
 * 创建存储适配器实例
 */
function createStorageAdapter(
  vendor: ReturnType<typeof getConfig>["storage"]["vendor"],
  bucketName: string,
): IStorage {
  switch (vendor) {
    case "aws-s3": {
      return new AwsS3Adapter(bucketName);
    }

    case "rustfs": {
      return new RustFsAdapter(bucketName);
    }

    case "minio": {
      return new MinioAdapter(bucketName);
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
      return new MemoryAdapter();
    }

    default: {
      throw new Error(`Unsupported storage vendor: ${vendor}`);
    }
  }
}

/**
 * 配置存储实例，使用 internalEndpoint 创建主实例
 */
export async function configureStorage() {
  const logger = getLogger(infra.storage);

  if (isNil(publicStorageClient) || isNil(privateStorageClient)) {
    const { storage } = getConfig();

    publicStorageClient = createStorageAdapter(storage.vendor, storage.options.publicBucketName);
    privateStorageClient = createStorageAdapter(storage.vendor, storage.options.privateBucketName);

    try {
      await publicStorageClient.ensureBucket();
      if (publicStorageClient instanceof AwsS3ExtendedAdapter) {
        await publicStorageClient.ensurePublicBucketPolicy();
      }
      logger.info(`Ensure Bucket ${storage.options.publicBucketName}`);
    } catch (error) {
      const message = getErrorMessage(error);
      logger.error(`Ensure Bucket ${storage.options.publicBucketName} failed: ${message}`);
    }

    try {
      await privateStorageClient.ensureBucket();
      if (privateStorageClient instanceof AwsS3ExtendedAdapter) {
        await privateStorageClient.ensurePublicBucketPolicy();
      }
      logger.info(`Ensure Bucket ${storage.options.privateBucketName}`);
    } catch (error) {
      const message = getErrorMessage(error);
      logger.error(`Ensure Bucket ${storage.options.privateBucketName} failed: ${message}`);
    }
  }
}

/**
 * 获取公共 bucket 的存储实例
 */
export function getPublicStorage() {
  if (isNil(publicStorageClient)) {
    throw new Error("Storage is not ready");
  }
  return publicStorageClient;
}

/**
 * 获取私有 bucket 的存储实例
 */
export function getPrivateStorage() {
  if (isNil(privateStorageClient)) {
    throw new Error("Storage is not ready");
  }
  return privateStorageClient;
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
  if (isNotNil(publicStorageClient)) {
    publicStorageClient.destroy();
    publicStorageClient = null;
  }
  if (isNotNil(privateStorageClient)) {
    privateStorageClient.destroy();
    privateStorageClient = null;
  }
}
