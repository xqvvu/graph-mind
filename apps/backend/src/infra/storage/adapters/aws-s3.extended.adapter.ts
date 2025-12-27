import type { IStorage } from "../interface";
import { AwsS3Adapter } from "./aws-s3.adapter";

export class AwsS3ExtendedAdapter extends AwsS3Adapter implements IStorage {
  async ensureBucket(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async ensureBucketPublicPolicy(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
