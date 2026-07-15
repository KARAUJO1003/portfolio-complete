"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Page } from "@/components/ds/page";
import { cn } from "@/lib/utils";
import { useAuth } from "@/core/auth/contexts/auth-context";
import { env } from "@/core/config/env";
import { ThemeToggle } from "@/components/ds/theme-toggle";

const adminLinks = [
  { href: "/admin", label: "Inicio" },
  { href: "/admin/profile", label: "Perfil" },
  { href: "/admin/projects", label: "Projetos" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/experiences", label: "Experiencias" },
  { href: "/admin/pages", label: "Paginas" },
  { href: "/admin/custom-sections", label: "Secoes" },
  { href: "/admin/resume-builder", label: "Curriculo" },
  { href: "/admin/portfolio-builder", label: "Portfolio" },
  { href: "/admin/design-system", label: "Design" },
  // <generated-admin-links>
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const auth = useAuth();

  return (
    <div className="min-h-dvh bg-background-subtle text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link className="flex items-center gap-3 font-semibold" href="/admin">
              <span className="flex size-8 items-center justify-center rounded-lg border border-border bg-surface-raised text-xs">
                KA
              </span>
              <span>Portfolio Admin</span>
            </Link>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link className="text-sm text-muted-foreground hover:text-foreground" href="/">Ver site publico</Link>
              {env.authEnabled && <button className="text-sm text-muted-foreground hover:text-foreground" type="button" onClick={async () => { await auth.logout(); window.location.href = "/login"; }}>Sair</button>}
            </div>
          </div>
          <nav className="flex gap-2 overflow-x-auto pb-1">
            {adminLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  className={cn(
                    "whitespace-nowrap rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground",
                    isActive && "bg-surface-raised text-foreground shadow-sm",
                  )}
                  href={link.href}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <Page className="py-6">{children}</Page>
    </div>
  );
}
