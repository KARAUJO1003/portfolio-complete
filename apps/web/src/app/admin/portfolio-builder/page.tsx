"use client";

import { AuthGuard } from "@/core/auth/components/auth-guard";
import { AdminShell } from "@/components/layout/admin-shell";
import { PortfolioBuilderFeature } from "@/features/portfolio-builder/components/portfolio-builder-feature";

export default function PortfolioBuilderPage() {
  return (
    <AuthGuard groupSlug="admin" can={["access"]}>
      <AdminShell>
        <PortfolioBuilderFeature />
      </AdminShell>
    </AuthGuard>
  );
}
