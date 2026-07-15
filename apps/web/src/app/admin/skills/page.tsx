"use client";

import { AdminShell } from "@/components/layout/admin-shell";
import { AuthGuard } from "@/core/auth/components/auth-guard";
import { SkillsFeature } from "@/features/skills/components/skills-feature";
import { SKILLS_MODULE, SKILLS_PERMISSIONS } from "@/features/skills/permissions";

export default function AdminSkillsPage() {
  return (
    <AuthGuard groupSlug={SKILLS_MODULE.slug} can={[SKILLS_PERMISSIONS.view]}>
      <AdminShell>
        <SkillsFeature />
      </AdminShell>
    </AuthGuard>
  );
}
