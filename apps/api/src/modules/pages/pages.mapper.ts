import type { CustomPageDto } from "@portfolio/contracts";
import type { CustomPageDocument } from "./pages.model";

export function toCustomPageDto(page: CustomPageDocument): CustomPageDto {
  return {
    id: String(page._id),
    ownerId: page.ownerId,
    title: page.title,
    slug: page.slug,
    excerpt: page.excerpt,
    content: page.content,
    contentFormat: page.contentFormat ?? "html",
    status: page.status,
    order: page.order,
    showInNavigation: page.showInNavigation,
    createdAt: page.createdAt.toISOString(),
    updatedAt: page.updatedAt.toISOString(),
  };
}
