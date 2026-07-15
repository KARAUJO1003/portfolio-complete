import { queryOptions } from "@tanstack/react-query";
import { listExperiences } from "./experiences-api";

export const experiencesKeys = {
  all: ["experiences"] as const,
  list: () => [...experiencesKeys.all, "list"] as const,
};

export function experiencesListQueryOptions() {
  return queryOptions({
    queryKey: experiencesKeys.list(),
    queryFn: listExperiences,
  });
}
