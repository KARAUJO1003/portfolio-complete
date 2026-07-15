import { UploadModel, type UploadDocument } from "./upload.model";

export async function createUpload(data: {
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  createdBy?: string;
}) {
  return UploadModel.create(data) as Promise<UploadDocument>;
}
