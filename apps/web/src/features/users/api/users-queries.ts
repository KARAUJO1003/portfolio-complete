import { queryOptions } from "@tanstack/react-query";
import { listUsers } from "./users-api";

export const usersKeys = {
  all: ["users"] as const,
  list: () => [...usersKeys.all, "list"] as const,
};

export function usersListQueryOptions() {
  return queryOptions({
    queryKey: usersKeys.list(),
    queryFn: listUsers,
  });
}
