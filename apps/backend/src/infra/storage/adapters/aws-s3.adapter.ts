import { Readable } from "node:stream";
import type { S3Client, S3ClientConfig } from "@aws-sdk/client-s3";
import {
  S3Client as AwsS3Client,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadBucketCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { addSeconds } from "date-fns";
import { chunk } from "es-toolkit";
import { getConfig } from "@/lib/config";
import type { IStorage } from "../interface";
import type {
  Body,
  CheckObjectIfExistsParams,
  CheckObjectIfExistsResult,
  DeleteObjectByMultiKeysParams,
  DeleteObjectByMultiKeysResult,
  DeleteObjectByPrefixParams,
  DeleteObjectByPrefixResult,
  DeleteObjectParams,
  DeleteObjectResult,
  DownloadObjectParams,
  DownloadObjectResult,
  EnsureBucketResult,
  GeneratePresignedGetUrlParams,
  GeneratePresignedGetUrlResult,
  GeneratePresignedPutUrlParams,
  GeneratePresignedPutUrlResult,
  GeneratePublicGetUrlParams,
  GeneratePublicGetUrlResult,
  GetObjectMetaDataParams,
  GetObjectMetaDataResult,
  ListAllObjectKeysParams,
  ListAllObjectKeysResult,
  UploadObjectParams,
  UploadObjectResult,
} from "../types";

export class AwsS3Adapter implements IStorage {
  public readonly bucketName: string;
  protected readonly internal: S3Client;
  protected readonly external?: S3Client;
  protected readonly region: string;
  protected readonly forcePathStyle: boolean;
  protected readonly internalEndpoint?: string;
  protected readonly externalEndpoint?: string;

  constructor(bucketName: string) {
    const { storage } = getConfig();

    this.bucketName = bucketName;
    this.region = storage.options.region;
    this.forcePathStyle = storage.options.forcePathStyle;
    this.internalEndpoint = storage.options.internalEndpoint;
    this.externalEndpoint = storage.options.externalEndpoint;

    const credentials =
      storage.options.accessKeyId && storage.options.secretAccessKey
        ? {
            accessKeyId: storage.options.accessKeyId,
            secretAccessKey: storage.options.secretAccessKey,
          }
        : undefined;

    const config: S3ClientConfig = {
      region: storage.options.region,
      endpoint: storage.options.internalEndpoint,
      forcePathStyle: storage.options.forcePathStyle,
      credentials: credentials,
    };

    this.internal = new AwsS3Client(config);

    if (this.externalEndpoint) {
      this.external = new AwsS3Client({
        ...config,
        endpoint: this.externalEndpoint,
      });
    }
  }

  async ensureBucket(): Promise<EnsureBucketResult> {
    await this.internal.send(
      new HeadBucketCommand({
        Bucket: this.bucketName,
      }),
    );

    return {
      bucket: this.bucketName,
      created: false,
      existed: true,
    };
  }

  async uploadObject(params: UploadObjectParams): Promise<UploadObjectResult> {
    const { body, key, contentType, metadata } = params;

    const upload = new Upload({
      client: this.internal,
      params: {
        Bucket: this.bucketName,
        Key: key,
        ContentType: contentType,
        Metadata: metadata,
        Body: body,
      },
    });

    const { ETag } = await upload.done();

    return {
      bucket: this.bucketName,
      etag: ETag,
      key: key,
      uploadTime: new Date(),
    };
  }

  async generatePresignedPutUrl(
    params: GeneratePresignedPutUrlParams,
  ): Promise<GeneratePresignedPutUrlResult> {
    const { key, contentType, expiresIn = 900, metadata } = params;

    const client = this.external ?? this.internal;
    const expiresAt = addSeconds(new Date(), expiresIn);

    const url = await getSignedUrl(
      client,
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: contentType,
        Metadata: metadata,
      }),
      { expiresIn },
    );

    return {
      bucket: this.bucketName,
      expiresAt: expiresAt,
      key: key,
      url: url,
    };
  }

  async generatePresignedGetUrl(
    params: GeneratePresignedGetUrlParams,
  ): Promise<GeneratePresignedGetUrlResult> {
    const { key, expiresIn = 900 } = params;

    const client = this.external ?? this.internal;
    const expiresAt = addSeconds(new Date(), expiresIn);

    const url = await getSignedUrl(
      client,
      new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      }),
      { expiresIn },
    );

    return {
      bucket: this.bucketName,
      expiresAt: expiresAt,
      key: key,
      url: url,
    };
  }

  async generatePublicGetUrl(
    params: GeneratePublicGetUrlParams,
  ): Promise<GeneratePublicGetUrlResult> {
    const { key } = params;
    const encodedKey = encodeObjectKey(key);
    const endpoint = this.externalEndpoint ?? this.internalEndpoint;

    let url: string;
    if (endpoint) {
      const base = new URL(endpoint);
      if (this.forcePathStyle) {
        base.pathname = joinUrlPath(base.pathname, `${this.bucketName}/${encodedKey}`);
        url = base.toString();
      } else {
        base.hostname = `${this.bucketName}.${base.hostname}`;
        base.pathname = joinUrlPath(base.pathname, encodedKey);
        url = base.toString();
      }
    } else {
      url = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${encodedKey}`;
    }

    return {
      bucket: this.bucketName,
      key: key,
      url: url,
    };
  }

  async downloadObject(params: DownloadObjectParams): Promise<DownloadObjectResult> {
    const { key } = params;

    const response = await this.internal.send(
      new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      }),
    );

    if (!response.Body) {
      throw new Error(`Empty body for ${this.bucketName}/${key}`);
    }

    const body = await normalizeBody(response.Body);

    return {
      bucket: this.bucketName,
      key: key,
      body: body,
      metadata: {
        contentType: response.ContentType,
        contentLength: response.ContentLength,
        etag: response.ETag,
        lastModified: response.LastModified,
        customMetadata: response.Metadata,
      },
    };
  }

  async deleteObject(params: DeleteObjectParams): Promise<DeleteObjectResult> {
    const { key } = params;

    await this.internal.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      }),
    );

    return {
      bucket: this.bucketName,
      key: key,
      deleted: true,
    };
  }

  async deleteObjectByMultiKeys(
    params: DeleteObjectByMultiKeysParams,
  ): Promise<DeleteObjectByMultiKeysResult> {
    const { keys } = params;

    const result = await deleteObjectChunks(this.internal, this.bucketName, keys);

    return {
      bucket: this.bucketName,
      deleted: result.deleted,
      failed: result.failed,
      total: keys.length,
    };
  }

  async deleteObjectByPrefix(
    params: DeleteObjectByPrefixParams,
  ): Promise<DeleteObjectByPrefixResult> {
    const { prefix } = params;

    const keys = await listAllKeys(this.internal, this.bucketName, prefix);
    const result = await deleteObjectChunks(this.internal, this.bucketName, keys);

    return {
      bucket: this.bucketName,
      prefix: prefix,
      deletedCount: result.deleted.length,
      deletedKeys: result.deleted,
      failed: result.failed,
    };
  }

  async listAllObjectKeys(params?: ListAllObjectKeysParams): Promise<ListAllObjectKeysResult> {
    const prefix = params?.prefix ?? "";
    const delimiter = params?.delimiter;

    const keys = await listAllKeys(this.internal, this.bucketName, prefix, delimiter);

    return {
      bucket: this.bucketName,
      keys: keys,
      prefix: prefix,
    };
  }

  async getObjectMetaData(params: GetObjectMetaDataParams): Promise<GetObjectMetaDataResult> {
    const { key } = params;

    const response = await this.internal.send(
      new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      }),
    );

    return {
      bucket: this.bucketName,
      key: key,
      metadata: {
        contentType: response.ContentType,
        contentLength: response.ContentLength,
        etag: response.ETag,
        lastModified: response.LastModified,
        customMetadata: response.Metadata,
      },
    };
  }

  async checkObjectIfExists(params: CheckObjectIfExistsParams): Promise<CheckObjectIfExistsResult> {
    const { keys } = params;

    if (keys.length === 0) {
      return {
        bucket: this.bucketName,
        existsKeys: [],
        missingKeys: [],
      };
    }

    const results = await Promise.allSettled(
      keys.map((key) =>
        this.internal.send(
          new HeadObjectCommand({
            Bucket: this.bucketName,
            Key: key,
          }),
        ),
      ),
    );

    const existsKeys: string[] = [];
    const missingKeys: string[] = [];

    results.forEach((result, index) => {
      const key = keys[index];

      if (result.status === "fulfilled") {
        existsKeys.push(key);
        return;
      }

      if (isObjectNotFound(result.reason)) {
        missingKeys.push(key);
        return;
      }

      throw result.reason;
    });

    return {
      bucket: this.bucketName,
      existsKeys: existsKeys,
      missingKeys: missingKeys,
    };
  }

  destroy(): void {
    this.internal.destroy();
    this.external?.destroy();
  }
}

function isObjectNotFound(error: unknown) {
  const err = error as { name?: string; $metadata?: { httpStatusCode?: number } };
  return (
    err?.name === "NotFound" || err?.name === "NoSuchKey" || err?.$metadata?.httpStatusCode === 404
  );
}

async function deleteObjectChunks(client: S3Client, bucket: string, keys: string[]) {
  const deleted: string[] = [];
  const failed: Array<{ key: string; error: string }> = [];

  if (keys.length === 0) {
    return { deleted, failed };
  }

  const chunks = chunk(keys, 1000);
  for (const chunk of chunks) {
    const response = await client.send(
      new DeleteObjectsCommand({
        Bucket: bucket,
        Delete: {
          Objects: chunk.map((key) => ({ Key: key })),
          Quiet: false,
        },
      }),
    );

    if (response.Deleted) {
      for (const item of response.Deleted) {
        if (item.Key) {
          deleted.push(item.Key);
        }
      }
    }

    if (response.Errors) {
      for (const item of response.Errors) {
        failed.push({
          key: item.Key ?? "",
          error: item.Message ?? "Unknown error",
        });
      }
    }
  }

  return { deleted, failed };
}

async function listAllKeys(client: S3Client, bucket: string, prefix?: string, delimiter?: string) {
  const keys: string[] = [];
  let continuationToken: string | undefined;

  do {
    const response = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix || undefined,
        Delimiter: delimiter,
        ContinuationToken: continuationToken,
      }),
    );

    if (response.Contents) {
      for (const item of response.Contents) {
        if (item.Key) {
          keys.push(item.Key);
        }
      }
    }

    continuationToken = response.IsTruncated ? response.NextContinuationToken : undefined;
  } while (continuationToken);

  return keys;
}

function encodeObjectKey(key: string) {
  return encodeURIComponent(key).replace(/%2F/g, "/");
}

function joinUrlPath(basePath: string, addPath: string) {
  if (basePath.endsWith("/")) {
    return `${basePath}${addPath}`;
  }
  return `${basePath}/${addPath}`;
}

async function normalizeBody(payload: unknown): Promise<Body> {
  if (typeof payload === "string") {
    return payload;
  }

  if (Buffer.isBuffer(payload)) {
    return payload;
  }

  if (payload instanceof Readable) {
    return payload;
  }

  if (payload instanceof Uint8Array) {
    return Buffer.from(payload);
  }

  if (typeof Blob !== "undefined" && payload instanceof Blob) {
    const buffer = await payload.arrayBuffer();
    return Buffer.from(buffer);
  }

  throw new Error("Unsupported response body type");
}
