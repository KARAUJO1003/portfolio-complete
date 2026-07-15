import { queryOptions } from "@tanstack/react-query";
import { listPages } from "./pages-api";

export const pagesKeys = {
  all: ["pages"] as const,
  list: () => [...pagesKeys.all, "list"] as const,
};

export function pagesListQueryOptions() {
  return queryOptions({
    queryKey: pagesKeys.list(),
    queryFn: listPages,
  });
}
