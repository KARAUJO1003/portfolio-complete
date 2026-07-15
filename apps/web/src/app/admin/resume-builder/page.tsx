"use client";

import { AuthGuard } from "@/core/auth/components/auth-guard";
import { AdminShell } from "@/components/layout/admin-shell";
import { ResumeBuilderFeature } from "@/features/resume-builder/components/resume-builder-feature";

export default function ResumeBuilderPage() {
  return (
    <AuthGuard groupSlug="admin" can={["access"]}>
      <AdminShell>
        <ResumeBuilderFeature />
      </AdminShell>
    </AuthGuard>
  );
}
