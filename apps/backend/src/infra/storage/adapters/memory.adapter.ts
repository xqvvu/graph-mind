import type {
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
} from "@/infra/storage/types";
import type { IStorage } from "../interface";

export class MemoryAdapter implements IStorage {
  ensureBucket(): Promise<EnsureBucketResult> {
    throw new Error("Method not implemented.");
  }
  uploadObject(params: UploadObjectParams): Promise<UploadObjectResult> {
    throw new Error("Method not implemented.");
  }
  generatePresignedPutUrl(
    params: GeneratePresignedPutUrlParams,
  ): Promise<GeneratePresignedPutUrlResult> {
    throw new Error("Method not implemented.");
  }
  generatePresignedGetUrl(
    params: GeneratePresignedGetUrlParams,
  ): Promise<GeneratePresignedGetUrlResult> {
    throw new Error("Method not implemented.");
  }
  generatePublicGetUrl(params: GeneratePublicGetUrlParams): Promise<GeneratePublicGetUrlResult> {
    throw new Error("Method not implemented.");
  }
  downloadObject(params: DownloadObjectParams): Promise<DownloadObjectResult> {
    throw new Error("Method not implemented.");
  }
  deleteObject(params: DeleteObjectParams): Promise<DeleteObjectResult> {
    throw new Error("Method not implemented.");
  }
  deleteObjectByMultiKeys(
    params: DeleteObjectByMultiKeysParams,
  ): Promise<DeleteObjectByMultiKeysResult> {
    throw new Error("Method not implemented.");
  }
  deleteObjectByPrefix(params: DeleteObjectByPrefixParams): Promise<DeleteObjectByPrefixResult> {
    throw new Error("Method not implemented.");
  }
  listAllObjectKeys(params?: ListAllObjectKeysParams): Promise<ListAllObjectKeysResult> {
    throw new Error("Method not implemented.");
  }
  getObjectMetaData(params: GetObjectMetaDataParams): Promise<GetObjectMetaDataResult> {
    throw new Error("Method not implemented.");
  }
  checkObjectIfExists(params: CheckObjectIfExistsParams): Promise<CheckObjectIfExistsResult> {
    throw new Error("Method not implemented.");
  }
  destroy(): void {
    throw new Error("Method not implemented.");
  }
}
