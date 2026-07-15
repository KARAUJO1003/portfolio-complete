export type Permission = `${string}:${string}`;

export type PermissionUser = {
  id: string;
  roles?: string[];
  permissions?: string[];
  isAdmin?: boolean;
};

export function can(user: PermissionUser | null | undefined, permission: Permission): boolean {
  if (!user) return false;
  if (user.isAdmin) return true;
  if (user.permissions?.includes("*:*")) return true;
  return Boolean(user.permissions?.includes(permission));
}
