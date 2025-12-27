import type { IStorage } from "../interface";
import { AwsS3ExtendedAdapter } from "./aws-s3.extended.adapter";

export class RustFsAdapter extends AwsS3ExtendedAdapter implements IStorage {}
