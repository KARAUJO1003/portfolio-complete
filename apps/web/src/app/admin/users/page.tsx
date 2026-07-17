"use client";

import { AdminShell } from "@/components/layout/admin-shell";
import { AuthGuard } from "@/core/auth/components/auth-guard";
import { UsersFeature } from "@/features/users/components/users-feature";
import { USERS_MODULE, USERS_PERMISSIONS } from "@/features/users/permissions";

export default function AdminUsersPage() {
  return (
    <AuthGuard groupSlug={USERS_MODULE.slug} can={[USERS_PERMISSIONS.view]}>
      <AdminShell>
        <UsersFeature />
      </AdminShell>
    </AuthGuard>
  );
}
