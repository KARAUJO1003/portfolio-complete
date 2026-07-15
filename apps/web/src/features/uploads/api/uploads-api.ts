import type { UploadDto } from "@portfolio/contracts";
import { api } from "@/core/api/axios-instance";

export async function uploadFile(file: File, folder: string) {
  const body = new FormData();
  body.append("folder", folder);
  body.append("file", file);
  const response = await api.post<{ upload: UploadDto }>("/uploads", body, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.upload;
}
