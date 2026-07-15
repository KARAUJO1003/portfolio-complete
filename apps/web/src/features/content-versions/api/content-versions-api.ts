import type {
  ContentVersionDto,
  ContentVersionKind,
  CreateContentVersionRequest,
  UpdateContentVersionRequest,
} from "@portfolio/contracts";
import { api } from "@/core/api/axios-instance";

export async function listContentVersions(kind: ContentVersionKind) {
  const response = await api.get<{ versions: ContentVersionDto[] }>("/content-versions", { params: { kind } });
  return response.data.versions;
}

export async function createContentVersion(input: CreateContentVersionRequest) {
  const response = await api.post<{ version: ContentVersionDto }>("/content-versions", input);
  return response.data.version;
}

export async function updateContentVersion(id: string, input: UpdateContentVersionRequest) {
  const response = await api.put<{ version: ContentVersionDto }>(`/content-versions/${id}`, input);
  return response.data.version;
}

export async function publishContentVersion(id: string) {
  const response = await api.post<{ version: ContentVersionDto }>(`/content-versions/${id}/publish`);
  return response.data.version;
}

export async function deleteContentVersion(id: string) {
  await api.delete(`/content-versions/${id}`);
}
