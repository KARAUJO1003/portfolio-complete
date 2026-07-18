"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageDescription, PageHeader, PageTitle } from "@/components/ds/page";
import { Section, SectionContent, SectionHeader, SectionTitle } from "@/components/ds/section";
import { Stat, StatGrid } from "@/components/ds/stat-grid";
import { useAuth } from "@/core/auth/contexts/auth-context";
import { env } from "@/core/config/env";
import { useQuery } from "@tanstack/react-query";
import { listProjects } from "@/features/projects/api/projects-api";
import { listSkills } from "@/features/skills/api/skills-api";
import { listExperiences } from "@/features/experiences/api/experiences-api";
import { contentVersionsQueryOptions } from "@/features/content-versions/api/content-versions-queries";

const primaryActions = [
  {
    label: "Editar perfil",
    href: "/admin/profile",
    description: "Nome, resumo, contatos, links sociais e avatar.",
    status: "Base do portfolio",
  },
  {
    label: "Projetos",
    href: "/admin/projects",
    description: "Cards publicos, repos, imagens, tags e visibilidade no curriculo.",
    status: "CRUD ativo",
  },
  {
    label: "Builder de curriculo",
    href: "/admin/resume-builder",
    description: "Preview ATS e selecao visual de secoes publicadas.",
    status: "Versoes e PDF ativos",
  },
  {
    label: "Publicar portfolio",
    href: "/admin/portfolio-builder",
    description: "Controle de secoes, itens, ordem e versao publicada.",
    status: "Publicacao ativa",
  },
  {
    label: "Design system",
    href: "/admin/design-system",
    description: "Tokens, componentes, motion patterns e futura vitrine visual do projeto.",
    status: "Base visual",
  },
];

const contentActions = [
  { label: "Habilidades", href: "/admin/skills", description: "Stack, datas e descricoes." },
  { label: "Experiencias", href: "/admin/experiences", description: "Experiencia, formacao e certificacoes." },
  { label: "Paginas", href: "/admin/pages", description: "Paginas publicas por slug." },
  { label: "Secoes", href: "/admin/custom-sections", description: "Blocos livres para portfolio e curriculo." },
];

const workflowSteps = [
  "Preencher perfil e contatos",
  "Cadastrar skills, experiencias e projetos",
  "Marcar o que aparece no portfolio ou curriculo",
  "Revisar previews dos builders",
  "Gerar PDF e publicar versoes",
];

export function AdminDashboard() {
  const auth = useAuth();
  const projects = useQuery({ queryKey: ["projects", "dashboard"], queryFn: listProjects });
  const skills = useQuery({ queryKey: ["skills", "dashboard"], queryFn: listSkills });
  const experiences = useQuery({ queryKey: ["experiences", "dashboard"], queryFn: listExperiences });
  const portfolioVersions = useQuery(contentVersionsQueryOptions("portfolio"));

  return (
    <>
      <PageHeader className="rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">Portfolio OS</p>
            <PageTitle className="mt-3 max-w-2xl text-3xl">
              Painel para montar portfolio, curriculo e publicacoes.
            </PageTitle>
            <PageDescription className="mt-4">
              Gerencie o conteudo uma vez e use os builders para decidir onde cada informacao aparece.
            </PageDescription>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/admin/portfolio-builder">Montar portfolio</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/">Ver publico</Link>
            </Button>
          </div>
        </div>
      </PageHeader>

      <StatGrid className="sm:grid-cols-4">
        <Stat label="Sessao" value={auth.user?.name || "Dev Admin"} delta={auth.user?.email || "auth bypass"} />
        <Stat
          label="Autenticacao"
          value={env.authEnabled ? "Ativa" : "Desligada"}
          delta={env.authEnabled ? "Login real habilitado" : "Modo visual de desenvolvimento"}
        />
        <Stat label="Conteudo" value={`${projects.data?.length ?? 0} projetos`} delta={`${skills.data?.length ?? 0} skills e ${experiences.data?.length ?? 0} registros de trajetoria`} />
        <Stat label="Publicacao" value={portfolioVersions.data?.find((item) => item.status === "published")?.name ?? "Sem versao"} delta="Versao ativa do portfolio" />
      </StatGrid>

      <Section>
        <SectionHeader>
          <SectionTitle>Acoes principais</SectionTitle>
        </SectionHeader>
        <div className="grid gap-4 md:grid-cols-2">
          {primaryActions.map((action) => (
            <ActionCard key={action.href} {...action} />
          ))}
        </div>
      </Section>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Section>
          <SectionHeader>
            <SectionTitle>Conteudo administravel</SectionTitle>
          </SectionHeader>
          <div className="grid gap-3">
            {contentActions.map((action) => (
              <Link
                key={action.href}
                className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-surface-raised"
                href={action.href}
              >
                <span>
                  <span className="block font-medium">{action.label}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{action.description}</span>
                </span>
                <span className="text-sm text-muted-foreground">Abrir</span>
              </Link>
            ))}
          </div>
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>Fluxo sugerido</SectionTitle>
          </SectionHeader>
          <SectionContent>
            <ol className="grid gap-3">
              {workflowSteps.map((step, index) => (
                <li key={step} className="flex gap-3 rounded-xl border border-border bg-card p-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs text-foreground">
                    {index + 1}
                  </span>
                  <span className="text-sm text-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </SectionContent>
        </Section>
      </div>
    </>
  );
}

function ActionCard({
  description,
  href,
  label,
  status,
}: {
  description: string;
  href: string;
  label: string;
  status: string;
}) {
  return (
    <Link className="group" href={href}>
      <Card className="h-full transition-colors group-hover:bg-surface-raised">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardDescription>{status}</CardDescription>
              <CardTitle>{label}</CardTitle>
            </div>
            <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">Abrir</span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
