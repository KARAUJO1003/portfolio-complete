"use client";

import Link from "next/link";
import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, BreakdownBars, ChartPanel, ChartPanelHeader, TrendIndicator, type BreakdownItem } from "@/components/ds/chart";
import { PageDescription, PageHeader, PageTitle } from "@/components/ds/page";
import { Section, SectionContent, SectionHeader, SectionTitle } from "@/components/ds/section";
import { Stat, StatGrid } from "@/components/ds/stat-grid";
import { useAuth } from "@/core/auth/contexts/auth-context";
import { env } from "@/core/config/env";
import { useQuery } from "@tanstack/react-query";
import { getLikesTrend, listProjects } from "@/features/projects/api/projects-api";
import { listSkills } from "@/features/skills/api/skills-api";
import { listExperiences } from "@/features/experiences/api/experiences-api";
import { contentVersionsQueryOptions } from "@/features/content-versions/api/content-versions-queries";
import { getAnalyticsOverview } from "@/features/admin/api/analytics-api";

const statusLabels: Record<string, string> = {
  archived: "Arquivado",
  draft: "Rascunho",
  published: "Publicado",
};

const statusTones: Record<string, BreakdownItem["tone"]> = {
  archived: "foreground",
  draft: "warning",
  published: "success",
};

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
    description: "Cards públicos, repos, imagens, tags e visibilidade no currículo.",
    status: "CRUD ativo",
  },
  {
    label: "Builder de currículo",
    href: "/admin/resume-builder",
    description: "Preview ATS e seleção visual de seções publicadas.",
    status: "Versões e PDF ativos",
  },
  {
    label: "Publicar portfolio",
    href: "/admin/portfolio-builder",
    description: "Controle de seções, itens, ordem e versão publicada.",
    status: "Publicação ativa",
  },
  {
    label: "Design system",
    href: "/admin/design-system",
    description: "Tokens, componentes, motion patterns e futura vitrine visual do projeto.",
    status: "Base visual",
  },
];

const contentActions = [
  { label: "Habilidades", href: "/admin/skills", description: "Stack, datas e descrições." },
  { label: "Experiências", href: "/admin/experiences", description: "Experiência, formação e certificações." },
  { label: "Páginas", href: "/admin/pages", description: "Páginas públicas por slug." },
  { label: "Seções", href: "/admin/custom-sections", description: "Blocos livres para portfolio e currículo." },
];

const workflowSteps = [
  "Preencher perfil e contatos",
  "Cadastrar skills, experiências e projetos",
  "Marcar o que aparece no portfolio ou currículo",
  "Revisar previews dos builders",
  "Gerar PDF e publicar versões",
];

export function AdminDashboard() {
  const auth = useAuth();
  const projects = useQuery({ queryKey: ["projects", "dashboard"], queryFn: listProjects });
  const skills = useQuery({ queryKey: ["skills", "dashboard"], queryFn: listSkills });
  const experiences = useQuery({ queryKey: ["experiences", "dashboard"], queryFn: listExperiences });
  const portfolioVersions = useQuery(contentVersionsQueryOptions("portfolio"));
  const likesTrend = useQuery({ queryKey: ["projects", "likes-trend"], queryFn: getLikesTrend });
  const analytics = useQuery({
    queryKey: ["analytics", "overview"],
    queryFn: getAnalyticsOverview,
    refetchInterval: 30_000,
  });

  const projectsByStatus = useMemo<BreakdownItem[]>(() => {
    const counts = new Map<string, number>();
    for (const project of projects.data ?? []) {
      counts.set(project.status, (counts.get(project.status) ?? 0) + 1);
    }
    return ["published", "draft", "archived"]
      .filter((status) => counts.has(status))
      .map((status) => ({ label: statusLabels[status], tone: statusTones[status], value: counts.get(status) ?? 0 }));
  }, [projects.data]);

  const skillsByCategory = useMemo<BreakdownItem[]>(() => {
    const counts = new Map<string, number>();
    for (const skill of skills.data ?? []) {
      counts.set(skill.category, (counts.get(skill.category) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([label, value]) => ({ label, value }));
  }, [skills.data]);

  const mostLikedProjects = useMemo<BreakdownItem[]>(() => {
    return [...(projects.data ?? [])]
      .filter((project) => (project.likesCount ?? 0) > 0)
      .sort((a, b) => (b.likesCount ?? 0) - (a.likesCount ?? 0))
      .slice(0, 6)
      .map((project) => ({ label: project.title, value: project.likesCount ?? 0 }));
  }, [projects.data]);

  const dailyVisitsSeries = useMemo(() => {
    return (analytics.data?.dailyVisits ?? []).map((point) => ({
      label: new Date(`${point.date}T00:00:00Z`).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      value: point.value,
    }));
  }, [analytics.data?.dailyVisits]);

  return (
    <>
      <PageHeader className="rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">Portfolio OS</p>
            <PageTitle className="mt-3 max-w-2xl text-3xl">
              Painel para montar portfolio, currículo e publicações.
            </PageTitle>
            <PageDescription className="mt-4">
              Gerencie o conteúdo uma vez e use os builders para decidir onde cada informação aparece.
            </PageDescription>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/admin/portfolio-builder">Montar portfolio</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/">Ver público</Link>
            </Button>
          </div>
        </div>
      </PageHeader>

      <StatGrid className="sm:grid-cols-4">
        <Stat label="Sessão" value={auth.user?.name || "Dev Admin"} delta={auth.user?.email || "auth bypass"} />
        <Stat
          label="Autenticação"
          value={env.authEnabled ? "Ativa" : "Desligada"}
          delta={env.authEnabled ? "Login real habilitado" : "Modo visual de desenvolvimento"}
        />
        <Stat label="Conteúdo" value={`${projects.data?.length ?? 0} projetos`} delta={`${skills.data?.length ?? 0} skills e ${experiences.data?.length ?? 0} registros de trajetória`} />
        <Stat label="Publicação" value={portfolioVersions.data?.find((item) => item.status === "published")?.name ?? "Sem versão"} delta="Versão ativa do portfolio" />
      </StatGrid>

      <Section>
        <SectionHeader>
          <SectionTitle>Composição do conteúdo</SectionTitle>
        </SectionHeader>
        <div className="grid gap-4 md:grid-cols-2">
          <ChartPanel>
            <ChartPanelHeader description="Quantos projetos estão em cada status." title="Projetos por status" />
            <BreakdownBars items={projectsByStatus} />
          </ChartPanel>
          <ChartPanel>
            <ChartPanelHeader description="Distribuição das skills cadastradas por categoria." title="Skills por categoria" />
            <BreakdownBars items={skillsByCategory} />
          </ChartPanel>
          <ChartPanel className="md:col-span-2">
            <ChartPanelHeader
              description="Ranking dos projetos com mais curtidas do site público."
              title="Projetos mais curtidos"
              trailing={
                likesTrend.data ? (
                  <TrendIndicator changePct={likesTrend.data.changePct} trend={likesTrend.data.trend} />
                ) : null
              }
            />
            <BreakdownBars items={mostLikedProjects} />
          </ChartPanel>
        </div>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Visitantes do portfolio</SectionTitle>
        </SectionHeader>
        <div className="grid gap-4 lg:grid-cols-[200px_1fr]">
          <div className="rounded-xl border border-border bg-card">
            <Stat label="Ativos agora" value={String(analytics.data?.activeNow ?? 0)} delta="Últimos 5 minutos" />
          </div>
          <ChartPanel>
            <ChartPanelHeader
              description="Contagem de visitas por dia, dado real de acesso ao portfolio."
              title="Visitas nos últimos 14 dias"
            />
            <AreaChart data={dailyVisitsSeries} />
          </ChartPanel>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <ChartPanel>
            <ChartPanelHeader description="De onde os visitantes acessam, últimos 30 dias." title="Dispositivos" />
            <BreakdownBars items={analytics.data?.deviceBreakdown ?? []} />
          </ChartPanel>
          <ChartPanel>
            <ChartPanelHeader description="Origem do tráfego, últimos 30 dias." title="De onde vieram" />
            <BreakdownBars items={analytics.data?.referrerBreakdown ?? []} />
          </ChartPanel>
        </div>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Ações principais</SectionTitle>
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
            <SectionTitle>Conteúdo administrável</SectionTitle>
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
  const reduceMotion = useReducedMotion();

  return (
    <Link className="group block h-full" href={href}>
      <motion.div
        className="h-full"
        transition={{ duration: 0.18, ease: "easeOut" }}
        whileHover={reduceMotion ? undefined : { y: -2 }}
      >
        <Card className="h-full transition-colors group-hover:border-foreground/25 group-hover:bg-surface-raised">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardDescription>{status}</CardDescription>
                <CardTitle>{label}</CardTitle>
              </div>
              <span className="flex shrink-0 items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                Abrir
                <ArrowUpRightIcon className="size-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-muted-foreground">{description}</p>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
