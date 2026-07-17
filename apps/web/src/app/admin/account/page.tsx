"use client";

import { AdminShell } from "@/components/layout/admin-shell";
import { AuthGuard } from "@/core/auth/components/auth-guard";
import { AccountFeature } from "@/features/account/components/account-feature";

export default function AdminAccountPage() {
  return (
    <AuthGuard groupSlug="account" can={[]}>
      <AdminShell>
        <AccountFeature />
      </AdminShell>
    </AuthGuard>
  );
}
