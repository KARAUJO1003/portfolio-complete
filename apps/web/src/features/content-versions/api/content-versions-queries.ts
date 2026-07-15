import type { ContentVersionKind } from "@portfolio/contracts";
import { queryOptions } from "@tanstack/react-query";
import { listContentVersions } from "./content-versions-api";

export const contentVersionKeys = {
  all: ["content-versions"] as const,
  list: (kind: ContentVersionKind) => [...contentVersionKeys.all, kind] as const,
};

export function contentVersionsQueryOptions(kind: ContentVersionKind) {
  return queryOptions({ queryKey: contentVersionKeys.list(kind), queryFn: () => listContentVersions(kind) });
}
