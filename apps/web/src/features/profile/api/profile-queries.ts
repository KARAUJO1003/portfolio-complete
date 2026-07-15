import { queryOptions } from "@tanstack/react-query";
import { getMyProfile } from "./profile-api";

export const profileKeys = {
  all: ["profile"] as const,
  mine: () => [...profileKeys.all, "mine"] as const,
};

export function myProfileQueryOptions() {
  return queryOptions({
    queryKey: profileKeys.mine(),
    queryFn: getMyProfile,
  });
}
