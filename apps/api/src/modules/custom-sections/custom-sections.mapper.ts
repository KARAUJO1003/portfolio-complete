import type { CustomSectionDto } from "@portfolio/contracts";
import type { CustomSectionDocument } from "./custom-sections.model";

export function toCustomSectionDto(item: CustomSectionDocument): CustomSectionDto {
  return { id: String(item._id), ownerId: item.ownerId, title: item.title, key: item.key, content: item.content,
    order: item.order, status: item.status, visibility: item.visibility ?? { portfolio: true, resume: false },
    createdAt: item.createdAt.toISOString(), updatedAt: item.updatedAt.toISOString() };
}
