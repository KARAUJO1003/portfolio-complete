"use client";

import { AuthGuard } from "@/core/auth/components/auth-guard";
import { AdminShell } from "@/components/layout/admin-shell";
import { DesignSystemFeature } from "@/features/design-system/components/design-system-feature";

export default function DesignSystemPage() {
  return (
    <AuthGuard groupSlug="admin" can={["access"]}>
      <AdminShell>
        <DesignSystemFeature />
      </AdminShell>
    </AuthGuard>
  );
}
