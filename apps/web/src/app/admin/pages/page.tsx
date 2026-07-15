"use client";

import { AdminShell } from "@/components/layout/admin-shell";
import { AuthGuard } from "@/core/auth/components/auth-guard";
import { PagesFeature } from "@/features/pages/components/pages-feature";
import { PAGES_MODULE, PAGES_PERMISSIONS } from "@/features/pages/permissions";

export default function AdminPagesPage() {
  return (
    <AuthGuard groupSlug={PAGES_MODULE.slug} can={[PAGES_PERMISSIONS.view]}>
      <AdminShell>
        <PagesFeature />
      </AdminShell>
    </AuthGuard>
  );
}
