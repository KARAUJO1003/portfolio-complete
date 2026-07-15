"use client";

import { AuthGuard } from "@/core/auth/components/auth-guard";
import { AdminShell } from "@/components/layout/admin-shell";
import { AdminDashboard } from "@/features/admin/components/admin-dashboard";

export default function AdminPage() {
  return (
    <AuthGuard groupSlug="admin" can={["access"]}>
      <AdminShell>
        <AdminDashboard />
      </AdminShell>
    </AuthGuard>
  );
}
