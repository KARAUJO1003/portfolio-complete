import { queryOptions } from "@tanstack/react-query";
import { listProjects } from "./projects-api";

export const projectsKeys = {
  all: ["projects"] as const,
  list: () => [...projectsKeys.all, "list"] as const,
};

export function projectsListQueryOptions() {
  return queryOptions({
    queryKey: projectsKeys.list(),
    queryFn: listProjects,
  });
}
