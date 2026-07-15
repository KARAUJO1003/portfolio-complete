import type { CreateCustomPageRequest, UpdateCustomPageRequest } from "@portfolio/contracts";
import { ApiError } from "../../shared/errors/api-error";
import { toCustomPageDto } from "./pages.mapper";
import * as repository from "./pages.repository";

export async function list(ownerId: string) {
  const pages = await repository.listPages(ownerId);
  return pages.map(toCustomPageDto);
}

export async function findPublished(slug: string) {
  const page = await repository.findPublishedPageBySlug(slug);
  if (!page) throw new ApiError("Page not found", 404);
  return toCustomPageDto(page);
}

export async function create(ownerId: string, input: CreateCustomPageRequest) {
  const page = await repository.createPage(ownerId, input);
  return toCustomPageDto(page);
}

export async function update(ownerId: string, id: string, input: UpdateCustomPageRequest) {
  const page = await repository.updatePage(ownerId, id, input);
  if (!page) throw new ApiError("Page not found", 404);
  return toCustomPageDto(page);
}

export async function remove(ownerId: string, id: string) {
  const page = await repository.deletePage(ownerId, id);
  if (!page) throw new ApiError("Page not found", 404);
}
