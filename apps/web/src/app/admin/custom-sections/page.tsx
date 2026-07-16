"use client";
import { AdminShell } from "@/components/layout/admin-shell";
import { AuthGuard } from "@/core/auth/components/auth-guard";
import { CustomSectionsFeature } from "@/features/custom-sections/components/custom-sections-feature";
import {
  CUSTOM_SECTIONS_MODULE,
  CUSTOM_SECTIONS_PERMISSIONS,
} from "@/features/custom-sections/permissions";
export default function AdminCustomSectionsPage() {
  return (
    <AuthGuard
      groupSlug={CUSTOM_SECTIONS_MODULE.slug}
      can={[CUSTOM_SECTIONS_PERMISSIONS.view]}
    >
      <AdminShell>
        <CustomSectionsFeature />
      </AdminShell>
    </AuthGuard>
  );
}
