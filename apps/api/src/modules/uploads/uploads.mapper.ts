import type { UploadDto } from "@portfolio/contracts";
import type { UploadDocument } from "./upload.model";

export function toUploadDto(upload: UploadDocument): UploadDto {
  return {
    id: String(upload._id),
    originalName: upload.originalName,
    mimeType: upload.mimeType,
    size: upload.size,
    path: upload.path,
    createdAt: upload.createdAt.toISOString(),
  };
}
