import type { CreateCustomPageRequest, UpdateCustomPageRequest } from "@portfolio/contracts";
import { CustomPageModel } from "./pages.model";

export async function listPages(ownerId: string) {
  return CustomPageModel.find({ ownerId }).sort({ order: 1, createdAt: -1 });
}

export async function findPublishedPageBySlug(slug: string) {
  return CustomPageModel.findOne({ slug, status: "published" });
}

export async function createPage(ownerId: string, data: CreateCustomPageRequest) {
  return CustomPageModel.create({ ...data, ownerId });
}

export async function updatePage(ownerId: string, id: string, data: UpdateCustomPageRequest) {
  return CustomPageModel.findOneAndUpdate(
    { _id: id, ownerId },
    { $set: data },
    { new: true },
  );
}

export async function deletePage(ownerId: string, id: string) {
  return CustomPageModel.findOneAndDelete({ _id: id, ownerId });
}
