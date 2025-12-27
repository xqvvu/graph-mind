import { CreateBucketCommand, PutBucketPolicyCommand } from "@aws-sdk/client-s3";
import type { EnsureBucketResult } from "@/infra/storage/types";
import type { IStorage } from "../interface";
import { AwsS3Adapter } from "./aws-s3.adapter";

export class AwsS3ExtendedAdapter extends AwsS3Adapter implements IStorage {
  override async ensureBucket(): Promise<EnsureBucketResult> {
    try {
      return await super.ensureBucket();
    } catch (error) {
      if (!isBucketNotFound(error)) {
        throw error;
      }

      await this.internal.send(
        new CreateBucketCommand({
          Bucket: this.bucketName,
        }),
      );

      return {
        bucket: this.bucketName,
        created: true,
        existed: false,
      };
    }
  }

  async ensurePublicBucketPolicy(): Promise<void> {
    const policy = {
      Version: "2012-10-17",
      Statement: [
        {
          Sid: "PublicReadGetObject",
          Effect: "Allow",
          Principal: {
            AWS: ["*"],
          },
          Action: ["s3:GetObject"],
          Resource: [`arn:aws:s3:::${this.bucketName}/*`],
        },
      ],
    };

    await this.internal.send(
      new PutBucketPolicyCommand({
        Bucket: this.bucketName,
        Policy: JSON.stringify(policy),
      }),
    );
  }
}

function isBucketNotFound(error: unknown) {
  const err = error as { name?: string; $metadata?: { httpStatusCode?: number } };
  return (
    err?.name === "NotFound" ||
    err?.name === "NoSuchBucket" ||
    err?.$metadata?.httpStatusCode === 404
  );
}
