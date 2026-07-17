"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageDescription, PageHeader, PageTitle } from "@/components/ds/page";
import { useAuth } from "@/core/auth/contexts/auth-context";
import { ChangePasswordForm } from "@/features/account/components/change-password-form";

export function AccountFeature() {
  const { user } = useAuth();

  return (
    <>
      <PageHeader>
        <PageTitle>Minha conta</PageTitle>
        <PageDescription>Dados de acesso da sua conta. Para editar o conteudo do portfolio, use a pagina Perfil.</PageDescription>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Dados de acesso</CardTitle>
          <CardDescription>Nome e email usados para autenticar no admin.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm">
          <div>
            <span className="block text-xs uppercase tracking-wide text-muted-foreground">Nome</span>
            <span>{user?.name}</span>
          </div>
          <div>
            <span className="block text-xs uppercase tracking-wide text-muted-foreground">Email</span>
            <span>{user?.email}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Senha</CardTitle>
          <CardDescription>Troque sua senha periodicamente.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </>
  );
}
