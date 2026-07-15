import { PageHeader, PageTitle, PageDescription } from "@/components/ds/page";
import { PublicShell } from "@/components/layout/public-shell";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <PublicShell>
      <PageHeader>
        <PageTitle>Login</PageTitle>
        <PageDescription>
          Autenticacao por credenciais para acessar o admin.
        </PageDescription>
      </PageHeader>
      <LoginForm />
    </PublicShell>
  );
}
