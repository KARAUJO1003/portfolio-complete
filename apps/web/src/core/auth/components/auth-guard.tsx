"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { can as canPermission, type Permission } from "@portfolio/permissions";
import { useAuth } from "@/core/auth/contexts/auth-context";
import { AuthGuardContext } from "@/core/auth/contexts/auth-guard-context";

type AuthGuardProps = {
  children: React.ReactNode;
  groupSlug: string;
  can: string[];
  mode?: "all" | "any";
  fallback?: React.ReactNode;
};

export function AuthGuard({
  children,
  groupSlug,
  can,
  mode = "all",
  fallback = null,
}: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user && fallback === null) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, user, fallback, pathname, router]);

  const normalize = (permission: string) =>
    (permission.includes(":") ? permission : `${groupSlug}:${permission}`) as Permission;

  const requiredPermissions = useMemo(() => can.map(normalize), [can, groupSlug]);

  if (isLoading) return null;
  if (!user) return <>{fallback}</>;

  const canOne = (permission: Permission | string) => canPermission(user, normalize(permission));
  const canAny = (permissions: Array<Permission | string>) => permissions.some(canOne);
  const canAll = (permissions: Array<Permission | string>) => permissions.every(canOne);
  const hasAccess = mode === "all" ? canAll(requiredPermissions) : canAny(requiredPermissions);

  if (!hasAccess) return <>{fallback}</>;

  return (
    <AuthGuardContext.Provider value={{ groupSlug, user, can: canOne, canAny, canAll }}>
      {children}
    </AuthGuardContext.Provider>
  );
}
