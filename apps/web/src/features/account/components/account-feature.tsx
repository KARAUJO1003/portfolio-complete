"use client";

import { useQuery } from "@tanstack/react-query";
import { GithubIcon } from "@/components/ds/brand-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageDescription, PageHeader, PageTitle } from "@/components/ds/page";
import { resolveFileUrl } from "@/core/files/file-url";
import { useAuth } from "@/core/auth/contexts/auth-context";
import { ChangePasswordForm } from "@/features/account/components/change-password-form";
import { myProfileQueryOptions } from "@/features/profile/api/profile-queries";

/** `https://github.com/<usuario>.png` e um endpoint publico real de avatar do GitHub, sem precisar de token. */
function getGithubAvatarUrl(githubUrl?: string) {
  if (!githubUrl) return "";
  const username = githubUrl.replace(/^https?:\/\/(www\.)?github\.com\//, "").replace(/\/+$/, "");
  return username ? `https://github.com/${username}.png` : "";
}

function getInitials(name?: string | null) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const initials = parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : parts[0].slice(0, 2);
  return initials.toUpperCase();
}

export function AccountFeature() {
  const { user } = useAuth();
  const profileQuery = useQuery(myProfileQueryOptions());
  const profile = profileQuery.data;

  const githubAvatarUrl = getGithubAvatarUrl(profile?.github);
  const avatarUrl = githubAvatarUrl || resolveFileUrl(profile?.avatarPath) || "";

  return (
    <>
      <PageHeader>
        <PageTitle>Minha conta</PageTitle>
        <PageDescription>Dados de acesso da sua conta. Para editar o conteúdo do portfolio, use a página Perfil.</PageDescription>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Conta</CardTitle>
          <CardDescription>Identidade, dados de acesso e senha.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <section className="flex items-center gap-4">
            <Avatar className="size-14">
              <AvatarFallback className="text-sm">{getInitials(user?.name)}</AvatarFallback>
              <AvatarImage alt={user?.name ?? ""} src={avatarUrl} />
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">{user?.name}</p>
              <p className="truncate text-sm text-muted-foreground">{user?.email}</p>
              {profile?.github ? (
                <a
                  className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  href={profile.github}
                  rel="noreferrer"
                  target="_blank"
                >
                  <GithubIcon className="size-3.5" />
                  Perfil do GitHub
                </a>
              ) : null}
            </div>
          </section>

          <section className="grid gap-4 border-t border-border pt-6">
            <div>
              <h3 className="text-sm font-semibold">Trocar senha</h3>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">Troque sua senha periodicamente.</p>
            </div>
            <ChangePasswordForm />
          </section>
        </CardContent>
      </Card>
    </>
  );
}
