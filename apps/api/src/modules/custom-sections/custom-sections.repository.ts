import type { CreateCustomSectionRequest, UpdateCustomSectionRequest } from "@portfolio/contracts";
import { CustomSectionModel } from "./custom-sections.model";
export const listSections = (ownerId: string) => CustomSectionModel.find({ ownerId }).sort({ order: 1, createdAt: -1 });
export const createSection = (ownerId: string, input: CreateCustomSectionRequest) => CustomSectionModel.create({ ...input, ownerId });
export const updateSection = (ownerId: string, id: string, input: UpdateCustomSectionRequest) => CustomSectionModel.findOneAndUpdate({ _id: id, ownerId }, { $set: input }, { new: true });
export const deleteSection = (ownerId: string, id: string) => CustomSectionModel.findOneAndDelete({ _id: id, ownerId });
