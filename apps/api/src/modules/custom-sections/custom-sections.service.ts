import type { CreateCustomSectionRequest, UpdateCustomSectionRequest } from "@portfolio/contracts";
import { ApiError } from "../../shared/errors/api-error";
import { toCustomSectionDto } from "./custom-sections.mapper";
import * as repository from "./custom-sections.repository";
export async function list(ownerId: string) { return (await repository.listSections(ownerId)).map(toCustomSectionDto); }
export async function create(ownerId: string, input: CreateCustomSectionRequest) { return toCustomSectionDto(await repository.createSection(ownerId, input)); }
export async function update(ownerId: string, id: string, input: UpdateCustomSectionRequest) { const item = await repository.updateSection(ownerId, id, input); if (!item) throw new ApiError("Custom section not found", 404); return toCustomSectionDto(item); }
export async function remove(ownerId: string, id: string) { if (!await repository.deleteSection(ownerId, id)) throw new ApiError("Custom section not found", 404); }
