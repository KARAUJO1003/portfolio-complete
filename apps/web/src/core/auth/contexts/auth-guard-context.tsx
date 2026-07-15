"use client";

import { createContext } from "react";
import type { Permission, PermissionUser } from "@portfolio/permissions";

export type AuthGuardContextValue = {
  groupSlug: string;
  user: PermissionUser;
  can: (permission: Permission | string) => boolean;
  canAny: (permissions: Array<Permission | string>) => boolean;
  canAll: (permissions: Array<Permission | string>) => boolean;
};

export const AuthGuardContext = createContext<AuthGuardContextValue | null>(null);
