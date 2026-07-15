import { queryOptions } from "@tanstack/react-query";
import { listSkills } from "./skills-api";

export const skillsKeys = {
  all: ["skills"] as const,
  list: () => [...skillsKeys.all, "list"] as const,
};

export function skillsListQueryOptions() {
  return queryOptions({
    queryKey: skillsKeys.list(),
    queryFn: listSkills,
  });
}
