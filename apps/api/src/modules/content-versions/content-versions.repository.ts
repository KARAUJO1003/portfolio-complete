import type { ContentVersionKind, CreateContentVersionRequest, UpdateContentVersionRequest } from "@portfolio/contracts";
import { ContentVersionModel } from "./content-versions.model";

export function listVersions(ownerId: string, kind?: ContentVersionKind) {
  return ContentVersionModel.find({ ownerId, ...(kind ? { kind } : {}) }).sort({ updatedAt: -1 });
}

export function findVersion(ownerId: string, id: string) {
  return ContentVersionModel.findOne({ _id: id, ownerId });
}

export function findPublishedVersion(ownerId: string, kind: ContentVersionKind) {
  return ContentVersionModel.findOne({ ownerId, kind, status: "published" }).sort({ publishedAt: -1 });
}

export function createVersion(ownerId: string, input: CreateContentVersionRequest) {
  return ContentVersionModel.create({ ...input, ownerId, status: "draft" });
}

export function updateVersion(ownerId: string, id: string, input: UpdateContentVersionRequest) {
  return ContentVersionModel.findOneAndUpdate({ _id: id, ownerId }, { $set: input }, { new: true });
}

export function removeVersion(ownerId: string, id: string) {
  return ContentVersionModel.findOneAndDelete({ _id: id, ownerId, status: { $ne: "published" } });
}
