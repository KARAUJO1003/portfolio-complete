import type { ContentVersionKind, CreateContentVersionRequest, UpdateContentVersionRequest } from "@portfolio/contracts";
import { ApiError } from "../../shared/errors/api-error";
import { toContentVersionDto } from "./content-versions.mapper";
import { ContentVersionModel } from "./content-versions.model";
import * as repository from "./content-versions.repository";

export async function list(ownerId: string, kind?: ContentVersionKind) {
  return (await repository.listVersions(ownerId, kind)).map(toContentVersionDto);
}

export async function get(ownerId: string, id: string) {
  const version = await repository.findVersion(ownerId, id);
  if (!version) throw new ApiError("Content version not found", 404);
  return toContentVersionDto(version);
}

export async function create(ownerId: string, input: CreateContentVersionRequest) {
  return toContentVersionDto(await repository.createVersion(ownerId, input));
}

export async function update(ownerId: string, id: string, input: UpdateContentVersionRequest) {
  const current = await repository.findVersion(ownerId, id);
  if (!current) throw new ApiError("Content version not found", 404);
  if (current.status === "published") input = { ...input };
  const version = await repository.updateVersion(ownerId, id, input);
  if (!version) throw new ApiError("Content version not found", 404);
  return toContentVersionDto(version);
}

export async function publish(ownerId: string, id: string) {
  const version = await repository.findVersion(ownerId, id);
  if (!version) throw new ApiError("Content version not found", 404);

  await ContentVersionModel.updateMany(
    { ownerId, kind: version.kind, status: "published", _id: { $ne: version._id } },
    { $set: { status: "archived" } },
  );
  version.status = "published";
  version.publishedAt = new Date();
  await version.save();
  return toContentVersionDto(version);
}

export async function remove(ownerId: string, id: string) {
  const version = await repository.removeVersion(ownerId, id);
  if (!version) throw new ApiError("Published versions cannot be removed", 409);
}
