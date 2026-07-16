"use client";

import { AdminShell } from "@/components/layout/admin-shell";
import { AuthGuard } from "@/core/auth/components/auth-guard";
import { ProjectsFeature } from "@/features/projects/components/projects-feature";
import {
  PROJECTS_MODULE,
  PROJECTS_PERMISSIONS,
} from "@/features/projects/permissions";

export default function AdminProjectsPage() {
  return (
    <AuthGuard
      groupSlug={PROJECTS_MODULE.slug}
      can={[PROJECTS_PERMISSIONS.view]}
    >
      <AdminShell>
        <ProjectsFeature />
      </AdminShell>
    </AuthGuard>
  );
}
