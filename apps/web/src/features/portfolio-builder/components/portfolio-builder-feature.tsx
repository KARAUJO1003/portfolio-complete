"use client";

import type { ContentVersionSection } from "@portfolio/contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  BuilderBrowserBar,
  BuilderEmptyState,
  BuilderLayout,
  BuilderPanel,
  BuilderPreview,
  BuilderSectionCard,
  BuilderSectionItemsPicker,
  BuilderSortableList,
  BuilderStatus,
  BuilderVersionSwitcher,
} from "@/components/ds/builder";
import { PageDescription, PageHeader, PageTitle } from "@/components/ds/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { env } from "@/core/config/env";
import { resolveFileUrl } from "@/core/files/file-url";
import {
  createContentVersion,
  publishContentVersion,
  updateContentVersion,
} from "@/features/content-versions/api/content-versions-api";
import {
  contentVersionKeys,
  contentVersionsQueryOptions,
} from "@/features/content-versions/api/content-versions-queries";
import { customSectionsListQueryOptions } from "@/features/custom-sections/api/custom-sections-queries";
import { experiencesListQueryOptions } from "@/features/experiences/api/experiences-queries";
import { pagesListQueryOptions } from "@/features/pages/api/pages-queries";
import { getPublicPortfolio } from "@/features/portfolio/api/public-portfolio-api";
import {
  AboutSection,
  ContactSection,
  CustomSectionsSection,
  GitHubSection,
  PagesSection,
  PortfolioBackground,
  ProjectsSection,
  SkillsSection,
  TimelineSection,
  type PortfolioProfile,
} from "@/features/portfolio/components/portfolio-home";
import { projectsListQueryOptions } from "@/features/projects/api/projects-queries";
import { skillsListQueryOptions } from "@/features/skills/api/skills-queries";

const defaultSections: ContentVersionSection[] = [
  section("hero", "Hero", 0),
  section("about", "Sobre", 1),
  section("skills", "Habilidades", 2),
  section("projects", "Projetos", 3),
  section("experiences", "Experiencias", 4),
  section("custom-sections", "Secoes customizadas", 5),
  section("pages", "Paginas", 6),
  section("github", "GitHub", 7),
  section("contact", "Contato", 8),
];

export function PortfolioBuilderFeature() {
  const queryClient = useQueryClient();
  const versionsQuery = useQuery(contentVersionsQueryOptions("portfolio"));
  const portfolioQuery = useQuery({ queryKey: ["public-portfolio", "portfolio-builder"], queryFn: getPublicPortfolio });
  const projectsQuery = useQuery(projectsListQueryOptions());
  const skillsQuery = useQuery(skillsListQueryOptions());
  const experiencesQuery = useQuery(experiencesListQueryOptions());
  const pagesQuery = useQuery(pagesListQueryOptions());
  const customSectionsQuery = useQuery(customSectionsListQueryOptions());
  const [versionId, setVersionId] = useState("");
  const [name, setName] = useState("Portfolio principal");
  const [sections, setSections] = useState(defaultSections);

  const hasAutoLoaded = useRef(false);
  useEffect(() => {
    // So roda uma vez, quando os dados chegam - nao pode reagir a versionId
    // (senao clicar em "Nova" limpa versionId, o que re-dispara este efeito e
    // desfaz o clique carregando a versao publicada de novo). Ver Fase 7 em
    // docs/admin-redesign-tasks.md.
    if (hasAutoLoaded.current || !versionsQuery.data?.length) return;
    hasAutoLoaded.current = true;
    const initial = versionsQuery.data.find((version) => version.status === "published") ?? versionsQuery.data[0];
    loadVersion(initial.id);
  }, [versionsQuery.data]);

  const items = useMemo<Record<string, { id: string; label: string }[]>>(
    () => ({
      projects: (projectsQuery.data ?? []).map((item) => ({ id: item.id, label: item.title })),
      skills: (skillsQuery.data ?? []).map((item) => ({ id: item.id, label: item.title })),
      experiences: (experiencesQuery.data ?? []).map((item) => ({ id: item.id, label: item.title })),
      pages: (pagesQuery.data ?? []).map((item) => ({ id: item.id, label: item.title })),
      "custom-sections": (customSectionsQuery.data ?? []).map((item) => ({ id: item.id, label: item.title })),
    }),
    [projectsQuery.data, skillsQuery.data, experiencesQuery.data, pagesQuery.data, customSectionsQuery.data],
  );

  async function persist() {
    const input = { name: name.trim() || "Portfolio", slug: slugify(name) || "portfolio", template: "default", sections };
    return versionId
      ? updateContentVersion(versionId, input)
      : createContentVersion({ ...input, kind: "portfolio" as const });
  }

  const saveMutation = useMutation({
    mutationFn: persist,
    onSuccess: async (version) => {
      setVersionId(version.id);
      await queryClient.invalidateQueries({ queryKey: contentVersionKeys.list("portfolio") });
      toast.success("Versão salva como rascunho.");
    },
    onError: () => toast.error("Não foi possível salvar a versão."),
  });

  const publishMutation = useMutation({
    mutationFn: async () => publishContentVersion((await persist()).id),
    onSuccess: async (version) => {
      setVersionId(version.id);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: contentVersionKeys.list("portfolio") }),
        queryClient.invalidateQueries({ queryKey: ["public-portfolio"] }),
      ]);
      toast.success("Portfolio publicado.");
    },
    onError: () => toast.error("Não foi possível publicar o portfolio."),
  });

  function loadVersion(id: string) {
    const version = versionsQuery.data?.find((item) => item.id === id);
    if (!version) return;
    setVersionId(version.id);
    setName(version.name);
    setSections(version.sections.length ? version.sections : defaultSections);
  }

  function newVersion() {
    setVersionId("");
    setName("Nova versão");
    setSections(defaultSections.map((item) => ({ ...item, itemIds: [] })));
  }

  function updateSection(id: string, patch: Partial<ContentVersionSection>) {
    setSections((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function reorderSections(reordered: ContentVersionSection[]) {
    setSections(reordered.map((item, order) => ({ ...item, order })));
  }

  function toggleItem(sectionId: string, itemId: string) {
    const current = sections.find((item) => item.id === sectionId);
    if (!current) return;
    const selected = new Set(current.itemIds);
    selected.has(itemId) ? selected.delete(itemId) : selected.add(itemId);
    updateSection(sectionId, { selectionMode: "selected", itemIds: [...selected] });
  }

  const busy = saveMutation.isPending || publishMutation.isPending;
  const currentVersion = versionsQuery.data?.find((item) => item.id === versionId);
  const liveVersion = versionsQuery.data?.find((item) => item.status === "published");

  return (
    <>
      <PageHeader>
        <PageTitle>Publicação de portfolio</PageTitle>
        <PageDescription>Crie versões, escolha seções e itens, ordene e publique a home imediatamente.</PageDescription>
      </PageHeader>

      <BuilderLayout>
        <BuilderPanel>
          <BuilderVersionSwitcher
            currentVersion={currentVersion}
            liveVersion={liveVersion}
            versions={versionsQuery.data ?? []}
            onNew={newVersion}
            onSelect={loadVersion}
          />
          <Input aria-label="Nome da versão" value={name} onChange={(event) => setName(event.target.value)} />

          <BuilderSortableList
            items={[...sections].sort((a, b) => a.order - b.order)}
            renderItem={(item) => (
              <BuilderSectionCard
                description={items[item.id]?.length ? `${items[item.id].length} itens disponíveis` : "Seção de perfil"}
                enabled={item.enabled}
                label={item.label}
                onToggleEnabled={() => updateSection(item.id, { enabled: !item.enabled })}
              >
                {items[item.id]?.length > 0 && (
                  <BuilderSectionItemsPicker
                    items={items[item.id]}
                    section={item}
                    onReorder={(orderedIds) => updateSection(item.id, { itemIds: orderedIds })}
                    onToggleAll={() =>
                      updateSection(item.id, { selectionMode: item.selectionMode === "all" ? "selected" : "all" })
                    }
                    onToggleItem={(optionId) => toggleItem(item.id, optionId)}
                  />
                )}
              </BuilderSectionCard>
            )}
            onReorder={reorderSections}
          />

          <div className="flex flex-wrap gap-3 pt-2">
            <Button disabled={busy} onClick={() => saveMutation.mutate()}>{saveMutation.isPending ? "Salvando..." : "Salvar"}</Button>
            <Button disabled={busy} variant="secondary" onClick={() => publishMutation.mutate()}>{publishMutation.isPending ? "Publicando..." : "Publicar"}</Button>
            <Button asChild variant="ghost"><Link href="/">Abrir portfolio</Link></Button>
          </div>
          <BuilderStatus>A versão publicada substitui a anterior e reflete imediatamente no site.</BuilderStatus>
        </BuilderPanel>

        <BuilderPreview className="overflow-hidden p-0">
          <BuilderBrowserBar url={displayUrl(env.appUrl)} />
          <div className="relative min-h-[620px] overflow-hidden bg-background">
            <PortfolioBackground variant="absolute" />
            <div className="relative z-10 flex flex-col gap-8 p-6">
              {[...sections].filter((item) => item.enabled).sort((a, b) => a.order - b.order).map((item) => (
                <PortfolioPreviewSection key={item.id} id={item.id} portfolio={portfolioQuery.data} />
              ))}
            </div>
          </div>
        </BuilderPreview>
      </BuilderLayout>
    </>
  );
}

type PortfolioData = Awaited<ReturnType<typeof getPublicPortfolio>>;

/**
 * Preview reaproveita os componentes reais de secao do site publico
 * (`features/portfolio/components/portfolio-home.tsx`, exportados so pra
 * isso) em vez de uma renderizacao simplificada propria - fica fiel de
 * verdade ao que sera publicado. Ver Fase 8 em docs/admin-redesign-tasks.md.
 * "hero" nao tem componente proprio no site real (o conteudo vive na sidebar/
 * MobileIntro, que dependem de layout de pagina inteira) - mantido como bloco
 * simples aqui.
 */
function toPortfolioProfile(portfolio: PortfolioData | undefined): PortfolioProfile {
  const profile = portfolio?.profile;
  return {
    name: profile?.name || "",
    headline: profile?.headline || "",
    summary: profile?.summary || "",
    about: profile?.objective || profile?.summary || "",
    github: profile?.github || "",
    linkedin: profile?.linkedin || "",
    instagram: "",
    avatarUrl: resolveFileUrl(profile?.avatarPath) || "",
  };
}

const portfolioPreviewRegistry: Record<string, (portfolio: PortfolioData | undefined) => React.ReactNode> = {
  hero: (portfolio) => {
    const profile = toPortfolioProfile(portfolio);
    return (
      <section className="flex min-h-48 flex-col justify-center gap-3">
        <p className="text-sm text-muted-foreground">{profile.name || "Seu nome"}</p>
        <h2 className="text-4xl font-semibold">{profile.headline || "Seu título aqui"}</h2>
      </section>
    );
  },
  about: (portfolio) => <AboutSection profile={toPortfolioProfile(portfolio)} />,
  skills: (portfolio) =>
    portfolio?.skills.length ? (
      <SkillsSection skills={portfolio.skills} />
    ) : (
      <BuilderEmptyState description="Cadastre habilidades e marque-as como visíveis no portfolio para aparecerem aqui." title="Nenhuma habilidade" />
    ),
  projects: (portfolio) =>
    portfolio?.projects.length ? (
      <ProjectsSection projects={portfolio.projects} />
    ) : (
      <BuilderEmptyState description="Cadastre projetos e marque-os como visíveis no portfolio para aparecerem aqui." title="Nenhum projeto" />
    ),
  experiences: (portfolio) =>
    portfolio?.experiences.length ? (
      <TimelineSection experiences={portfolio.experiences} />
    ) : (
      <BuilderEmptyState description="Cadastre experiências e marque-as como visíveis no portfolio para aparecerem aqui." title="Nenhuma experiência" />
    ),
  pages: (portfolio) =>
    portfolio?.navigationPages.length ? (
      <PagesSection pages={portfolio.navigationPages} />
    ) : (
      <BuilderEmptyState description="Publique páginas com 'Exibir na navegação' ativado para aparecerem aqui." title="Nenhuma página" />
    ),
  "custom-sections": (portfolio) =>
    portfolio?.customSections.length ? (
      <CustomSectionsSection sections={portfolio.customSections} />
    ) : (
      <BuilderEmptyState description="Publique seções customizadas e marque-as como visíveis no portfolio para aparecerem aqui." title="Nenhuma seção" />
    ),
  github: (portfolio) =>
    portfolio?.github ? (
      <GitHubSection github={portfolio.github} />
    ) : (
      <BuilderEmptyState description="Informe seu usuário do GitHub no Perfil para exibir estatísticas aqui." title="GitHub não conectado" />
    ),
  contact: (portfolio) => <ContactSection profile={toPortfolioProfile(portfolio)} />,
};

function PortfolioPreviewSection({ id, portfolio }: { id: string; portfolio: PortfolioData | undefined }) {
  return portfolioPreviewRegistry[id]?.(portfolio) ?? null;
}

function section(id: string, label: string, order: number): ContentVersionSection {
  return { id, label, order, enabled: true, selectionMode: "all", itemIds: [] };
}

function displayUrl(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
