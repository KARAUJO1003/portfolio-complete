"use client";
import { AdminShell } from "@/components/layout/admin-shell";
import { AuthGuard } from "@/core/auth/components/auth-guard";
import { {{PASCAL}}Feature } from "@/features/{{FEATURE}}/components/{{FEATURE}}-feature";
import { {{PASCAL}}Module,{{PASCAL}}Permissions } from "@/features/{{FEATURE}}/permissions";
export default function Page(){return <AuthGuard groupSlug={{{PASCAL}}Module.slug} can={[{{PASCAL}}Permissions.view]}><AdminShell><{{PASCAL}}Feature /></AdminShell></AuthGuard>;}
