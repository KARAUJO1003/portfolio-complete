"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BriefcaseIcon,
  ChevronDownIcon,
  FileTextIcon,
  FolderKanbanIcon,
  GlobeIcon,
  KeyRoundIcon,
  LayoutDashboardIcon,
  LayoutTemplateIcon,
  type LucideIcon,
  PaletteIcon,
  ScrollTextIcon,
  SparklesIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import { Page } from "@/components/ds/page";
import { cn } from "@/lib/utils";
import { UserMenu } from "@/components/layout/user-menu";
import { Menu, MenuLinkItem, MenuPopup, MenuTrigger } from "@/components/ui/menu";
import { useAdminThemeScope } from "@/hooks/use-admin-theme-scope";

type AdminLink = {
  description?: string;
  href: string;
  icon?: LucideIcon;
  label: string;
};

const adminGroups: { label: string; links: AdminLink[] }[] = [
  {
    label: "Base",
    links: [
      { href: "/admin", label: "Inicio", description: "Visao geral do painel", icon: LayoutDashboardIcon },
      { href: "/admin/profile", label: "Perfil", description: "Dados pessoais e contatos", icon: UserIcon },
      { href: "/admin/account", label: "Minha conta", description: "Senha e preferencias da conta", icon: KeyRoundIcon },
    ],
  },
  {
    label: "Conteudo",
    links: [
      { href: "/admin/projects", label: "Projetos", description: "Cards, repos, tags e visibilidade", icon: FolderKanbanIcon },
      { href: "/admin/skills", label: "Habilidades", description: "Categoria, nivel e data", icon: SparklesIcon },
      { href: "/admin/experiences", label: "Trajetoria", description: "Experiencia, formacao e certificacoes", icon: BriefcaseIcon },
      { href: "/admin/pages", label: "Paginas", description: "Paginas publicas customizadas", icon: FileTextIcon },
      { href: "/admin/custom-sections", label: "Secoes", description: "Blocos de conteudo livre", icon: LayoutTemplateIcon },
    ],
  },
  {
    label: "Publicacao",
    links: [
      { href: "/admin/resume-builder", label: "Curriculo", description: "Builder e PDF do curriculo", icon: ScrollTextIcon },
      { href: "/admin/portfolio-builder", label: "Portfolio", description: "Builder do site publico", icon: GlobeIcon },
    ],
  },
  {
    label: "Sistema",
    links: [
      { href: "/admin/users", label: "Usuarios", description: "Contas e permissoes do admin", icon: UsersIcon },
      { href: "/admin/design-system", label: "Design system", description: "Tokens, componentes e motion", icon: PaletteIcon },
      // <generated-admin-links>
    ],
  },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  useAdminThemeScope();

  function isLinkActive(href: string) {
    return pathname === href || (href !== "/admin" && pathname.startsWith(href));
  }

  return (
    <div className="admin-shell min-h-dvh bg-background-subtle text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/88 shadow-sm shadow-black/5 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex flex-wrap items-center gap-6">
            <Link className="flex items-center gap-3" href="/admin">
              <span className="flex size-9 items-center justify-center rounded-xl border border-border bg-surface-raised text-xs font-semibold shadow-sm">
                KA
              </span>
              <span>
                <span className="block text-sm font-semibold leading-5">Portfolio Admin</span>
                <span className="block text-xs text-muted-foreground">Conteudo, curriculo e publicacao</span>
              </span>
            </Link>
            <nav className="flex items-center gap-1">
              {adminGroups.map((group) => {
                const isGroupActive = group.links.some((link) => isLinkActive(link.href));

                return (
                  <Menu key={group.label}>
                    <MenuTrigger
                      className={cn(
                        "flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                        isGroupActive ? "bg-surface-raised text-foreground" : "text-muted-foreground hover:bg-surface-raised hover:text-foreground",
                      )}
                      delay={150}
                      openOnHover
                    >
                      {group.label}
                      <ChevronDownIcon className="size-3.5" />
                    </MenuTrigger>
                    <MenuPopup align="start" className="min-w-72 p-1.5">
                      {group.links.map((link) => {
                        const Icon = link.icon ?? FileTextIcon;
                        const isActive = isLinkActive(link.href);

                        return (
                          <MenuLinkItem
                            key={link.href}
                            className={cn("h-auto items-start gap-3 rounded-md p-2", isActive && "bg-muted")}
                            render={<Link href={link.href} />}
                          >
                            <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-surface-raised">
                              <Icon className="size-4" />
                            </span>
                            <span className="flex flex-col gap-0.5">
                              <span className="text-sm font-medium text-foreground">{link.label}</span>
                              {link.description && (
                                <span className="text-xs text-muted-foreground">{link.description}</span>
                              )}
                            </span>
                          </MenuLinkItem>
                        );
                      })}
                    </MenuPopup>
                  </Menu>
                );
              })}
            </nav>
          </div>
          <UserMenu />
        </div>
      </header>
      <Page className="py-6">{children}</Page>
    </div>
  );
}
