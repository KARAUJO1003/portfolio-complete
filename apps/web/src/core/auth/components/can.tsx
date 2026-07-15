"use client";

import { can as canPermission, type Permission } from "@portfolio/permissions";
import { useAuthGuardContext } from "@/core/auth/hooks/use-auth-guard-context";

type CanProps = {
  children: React.ReactNode;
  can: string[];
  mode?: "all" | "any";
  fallback?: React.ReactNode;
  abilities?: string[];
  isAdmin?: boolean;
};

export function Can({
  children,
  can,
  mode = "all",
  fallback = null,
  abilities,
  isAdmin,
}: CanProps) {
  const context = useAuthGuardContext();

  const hasAccess = (() => {
    if (context) {
      return mode === "all" ? context.canAll(can) : context.canAny(can);
    }

    if (!abilities) return false;

    const user = {
      id: "standalone",
      permissions: abilities,
      isAdmin,
    };

    const permissions = can as Permission[];
    return mode === "all"
      ? permissions.every((permission) => canPermission(user, permission))
      : permissions.some((permission) => canPermission(user, permission));
  })();

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}
