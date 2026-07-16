import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <main className="relative grid min-h-dvh overflow-hidden bg-background-subtle text-foreground lg:grid-cols-[minmax(0,1fr)_480px]">
      <section className="relative hidden flex-col justify-between border-r border-border bg-background p-10 lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,hsl(var(--primary)/0.18),transparent_34%),radial-gradient(circle_at_80%_65%,hsl(var(--primary-accent)/0.12),transparent_30%)]" />
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl border border-border bg-surface-raised text-sm font-semibold">
              KA
            </span>
            <span>
              <span className="block text-sm font-semibold">Portfolio Platform</span>
              <span className="block text-xs text-muted-foreground">Admin privado</span>
            </span>
          </div>
          <div className="mt-20 max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-accent">Admin Platform</p>
            <h1 className="mt-5 text-5xl font-semibold tracking-normal">
              Controle seu portfolio, curriculo e publicacao em um unico fluxo.
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground">
              Edite conteudo uma vez, escolha onde aparece, revise versoes e publique com seguranca.
            </p>
          </div>
        </div>
        <div className="relative z-10 grid grid-cols-3 gap-3 text-xs text-muted-foreground">
          {["Portfolio dinamico", "PDF ATS", "Versoes publicaveis"].map((item) => (
            <div key={item} className="rounded-xl border border-border bg-surface-muted/70 p-3">
              {item}
            </div>
          ))}
        </div>
      </section>
      <section className="flex min-h-dvh items-center justify-center px-4 py-10">
        <LoginForm />
      </section>
    </main>
  );
}
