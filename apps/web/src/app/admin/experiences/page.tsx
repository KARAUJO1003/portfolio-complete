"use client";

import { AdminShell } from "@/components/layout/admin-shell";
import { AuthGuard } from "@/core/auth/components/auth-guard";
import { ExperiencesFeature } from "@/features/experiences/components/experiences-feature";
import {
  EXPERIENCES_MODULE,
  EXPERIENCES_PERMISSIONS,
} from "@/features/experiences/permissions";

export default function AdminExperiencesPage() {
  return (
    <AuthGuard
      groupSlug={EXPERIENCES_MODULE.slug}
      can={[EXPERIENCES_PERMISSIONS.view]}
    >
      <AdminShell>
        <ExperiencesFeature />
      </AdminShell>
    </AuthGuard>
  );
}
