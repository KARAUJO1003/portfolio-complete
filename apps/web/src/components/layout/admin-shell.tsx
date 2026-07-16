"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Page } from "@/components/ds/page";
import { cn } from "@/lib/utils";
import { useAuth } from "@/core/auth/contexts/auth-context";
import { env } from "@/core/config/env";
import { ThemeToggle } from "@/components/ds/theme-toggle";

const adminGroups = [
  {
    label: "Base",
    links: [
      { href: "/admin", label: "Inicio" },
      { href: "/admin/profile", label: "Perfil" },
    ],
  },
  {
    label: "Conteudo",
    links: [
      { href: "/admin/projects", label: "Projetos" },
      { href: "/admin/skills", label: "Habilidades" },
      { href: "/admin/experiences", label: "Trajetoria" },
      { href: "/admin/pages", label: "Paginas" },
      { href: "/admin/custom-sections", label: "Secoes" },
    ],
  },
  {
    label: "Publicacao",
    links: [
      { href: "/admin/resume-builder", label: "Curriculo" },
      { href: "/admin/portfolio-builder", label: "Portfolio" },
    ],
  },
  {
    label: "Sistema",
    links: [
      { href: "/admin/design-system", label: "Design system" },
      // <generated-admin-links>
    ],
  },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const auth = useAuth();

  return (
    <div className="min-h-dvh bg-background-subtle text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/88 shadow-sm shadow-black/5 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link className="flex items-center gap-3" href="/admin">
              <span className="flex size-9 items-center justify-center rounded-xl border border-border bg-surface-raised text-xs font-semibold shadow-sm">
                KA
              </span>
              <span>
                <span className="block text-sm font-semibold leading-5">Portfolio Admin</span>
                <span className="block text-xs text-muted-foreground">Conteudo, curriculo e publicacao</span>
              </span>
            </Link>
            <div className="flex items-center gap-2 rounded-full border border-border bg-surface-muted/70 p-1">
              <ThemeToggle />
              <Link className="rounded-full px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-surface-raised hover:text-foreground" href="/">Site publico</Link>
              {env.authEnabled && <button className="rounded-full px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-surface-raised hover:text-foreground" type="button" onClick={async () => { await auth.logout(); window.location.href = "/login"; }}>Sair</button>}
            </div>
          </div>
          <nav className="flex gap-4 overflow-x-auto pb-1">
            {adminGroups.map((group) => (
              <div key={group.label} className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-surface-muted/55 p-1">
                <span className="px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {group.label}
                </span>
                {group.links.map((link) => {
                  const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));

                  return (
                    <Link
                      key={link.href}
                      className={cn(
                        "whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface-raised hover:text-foreground",
                        isActive && "bg-surface-raised text-foreground shadow-sm",
                      )}
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>
      </header>
      <Page className="py-6">{children}</Page>
    </div>
  );
}
