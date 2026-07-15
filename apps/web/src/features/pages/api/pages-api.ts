import type {
  CreateCustomPageRequest,
  CustomPageDto,
  UpdateCustomPageRequest,
} from "@portfolio/contracts";
import { api } from "@/core/api/axios-instance";

export async function listPages() {
  const response = await api.get<{ pages: CustomPageDto[] }>("/pages");
  return response.data.pages;
}

export async function getPublishedPage(slug: string) {
  const response = await api.get<{ page: CustomPageDto }>(`/pages/public/${slug}`);
  return response.data.page;
}

export async function createPage(input: CreateCustomPageRequest) {
  const response = await api.post<{ page: CustomPageDto }>("/pages", input);
  return response.data.page;
}

export async function updatePage(id: string, input: UpdateCustomPageRequest) {
  const response = await api.put<{ page: CustomPageDto }>(`/pages/${id}`, input);
  return response.data.page;
}

export async function deletePage(id: string) {
  await api.delete(`/pages/${id}`);
}
