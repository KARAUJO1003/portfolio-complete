"use client";

import { AdminShell } from "@/components/layout/admin-shell";
import { AuthGuard } from "@/core/auth/components/auth-guard";
import { ProfileFeature } from "@/features/profile/components/profile-feature";
import {
  PROFILE_MODULE,
  PROFILE_PERMISSIONS,
} from "@/features/profile/permissions";

export default function AdminProfilePage() {
  return (
    <AuthGuard groupSlug={PROFILE_MODULE.slug} can={[PROFILE_PERMISSIONS.view]}>
      <AdminShell>
        <ProfileFeature />
      </AdminShell>
    </AuthGuard>
  );
}
