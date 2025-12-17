import type { S3Client } from "@aws-sdk/client-s3";
import {
  BucketAlreadyExists,
  BucketAlreadyOwnedByYou,
  CreateBucketCommand,
  HeadBucketCommand,
  NotFound,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { isError } from "es-toolkit";
import { getLogger, infra } from "@/infra/logger";
import type { IObjectStorage } from "@/infra/storage/interface";
import type {
  EnsureBucketResult,
  GeneratePresignedPutUrlParams,
  GeneratePresignedPutUrlResult,
  UploadObjectParams,
} from "@/infra/storage/types";

export class AWSS3StorageAdapter implements IObjectStorage {
  constructor(
    protected readonly client: S3Client,
    protected readonly bucket: string,
  ) {}

  async ensureBucket(): Promise<EnsureBucketResult> {
    const logger = getLogger(infra.storage);

    try {
      await this.client.send(
        new HeadBucketCommand({
          Bucket: this.bucket,
        }),
      );

      logger.info(`Bucket ${this.bucket} already exists`);

      return {
        bucket: this.bucket,
        exists: true,
        created: false,
      };
    } catch (error) {
      if (error instanceof NotFound || (isError(error) && error.name === "NotFound")) {
        logger.info(`Bucket ${this.bucket} does not exist`);
      } else {
        logger.error(`Error checking bucket ${this.bucket}`);
        throw error;
      }
    }

    try {
      await this.client.send(
        new CreateBucketCommand({
          Bucket: this.bucket,
        }),
      );

      logger.info(`Bucket ${this.bucket} created successfully`);
      return {
        bucket: this.bucket,
        exists: true,
        created: true,
      };
    } catch (error) {
      if (
        error instanceof BucketAlreadyExists ||
        error instanceof BucketAlreadyOwnedByYou ||
        (isError(error) &&
          (error.name === "BucketAlreadyExists" || error.name === "BucketAlreadyOwnedByYou"))
      ) {
        logger.warn(`Bucket ${this.bucket} was created by someone else during creation process`);

        return {
          bucket: this.bucket,
          exists: true,
          created: false,
        };
      }

      logger.error(`Failed to create bucket ${this.bucket}`);
      throw error;
    }
  }

  async uploadObject(params: UploadObjectParams): Promise<void> {
    const { contentType, key, body } = params;

    const upload = new Upload({
      client: this.client,
      params: {
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      },
    });

    await upload.done();
  }

  downloadObject(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  deleteObject(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async generatePresignedPutUrl(
    params: GeneratePresignedPutUrlParams,
  ): Promise<GeneratePresignedPutUrlResult> {
    const { key } = params;

    const url = await getSignedUrl(
      this.client,
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );

    return {
      url,
      bucket: this.bucket,
      key,
    };
  }

  destroy(): void {
    this.client.destroy();
  }
}
