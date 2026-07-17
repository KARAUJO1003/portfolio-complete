import { queryOptions } from "@tanstack/react-query";
import { listCustomSections } from "./custom-sections-api";

export const customSectionsKeys = {
  all: ["custom-sections"] as const,
  list: () => [...customSectionsKeys.all, "list"] as const,
};

export function customSectionsListQueryOptions() {
  return queryOptions({
    queryKey: customSectionsKeys.list(),
    queryFn: listCustomSections,
  });
}
