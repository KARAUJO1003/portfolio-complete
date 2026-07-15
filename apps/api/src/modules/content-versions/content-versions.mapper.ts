import type { ContentVersionDto } from "@portfolio/contracts";
import type { ContentVersionDocument } from "./content-versions.model";

export function toContentVersionDto(version: ContentVersionDocument): ContentVersionDto {
  return {
    id: String(version._id),
    ownerId: version.ownerId,
    kind: version.kind,
    name: version.name,
    slug: version.slug,
    template: version.template,
    status: version.status,
    sections: [...(version.sections ?? [])].sort((a, b) => a.order - b.order).map((section) => ({
      id: section.id,
      label: section.label,
      enabled: section.enabled,
      order: section.order,
      selectionMode: section.selectionMode,
      itemIds: section.itemIds ?? [],
    })),
    publishedAt: version.publishedAt?.toISOString() ?? null,
    createdAt: version.createdAt.toISOString(),
    updatedAt: version.updatedAt.toISOString(),
  };
}
