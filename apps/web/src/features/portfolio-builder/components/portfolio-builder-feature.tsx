"use client";

import type { ContentVersionSection } from "@portfolio/contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ds/badge";
import {
  BuilderBrowserBar,
  BuilderItem,
  BuilderItemContent,
  BuilderItemDescription,
  BuilderItemTitle,
  BuilderLayout,
  BuilderPanel,
  BuilderPreview,
  BuilderSectionItemsPicker,
  BuilderSortableList,
  BuilderStatus,
} from "@/components/ds/builder";
import { PageDescription, PageHeader, PageTitle } from "@/components/ds/page";
import { Section, SectionContent, SectionHeader, SectionTitle } from "@/components/ds/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "@/components/ui/select";
import { env } from "@/core/config/env";
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

  useEffect(() => {
    if (versionId || !versionsQuery.data?.length) return;
    const initial = versionsQuery.data.find((version) => version.status === "published") ?? versionsQuery.data[0];
    loadVersion(initial.id);
  }, [versionsQuery.data, versionId]);

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
      toast.success("Versao salva como rascunho.");
    },
    onError: () => toast.error("Nao foi possivel salvar a versao."),
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
    onError: () => toast.error("Nao foi possivel publicar o portfolio."),
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
    setName("Nova versao");
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

  return (
    <>
      <PageHeader>
        <PageTitle>Publicacao de portfolio</PageTitle>
        <PageDescription>Crie versoes, escolha secoes e itens, ordene e publique a home imediatamente.</PageDescription>
      </PageHeader>

      <BuilderLayout>
        <BuilderPanel>
          <SectionHeader>
            <SectionTitle>Versao</SectionTitle>
            {currentVersion && <Badge tone={currentVersion.status === "published" ? "success" : "muted"}>{currentVersion.status}</Badge>}
          </SectionHeader>
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <Select value={versionId} onValueChange={(next) => loadVersion(next ?? "")}>
              <SelectTrigger>
                <SelectValue>
                  {() => (currentVersion ? `${currentVersion.name} (${currentVersion.status})` : "Nova versao")}
                </SelectValue>
              </SelectTrigger>
              <SelectPopup>
                <SelectItem value="">Nova versao</SelectItem>
                {versionsQuery.data?.map((version) => (
                  <SelectItem key={version.id} value={version.id}>
                    {version.name} ({version.status})
                  </SelectItem>
                ))}
              </SelectPopup>
            </Select>
            <Button type="button" variant="ghost" onClick={newVersion}>Nova</Button>
          </div>
          <Input aria-label="Nome da versao" value={name} onChange={(event) => setName(event.target.value)} />

          <BuilderSortableList
            items={[...sections].sort((a, b) => a.order - b.order)}
            renderItem={(item) => (
              <div className="rounded-md border border-border bg-background p-3">
                <BuilderItem className="border-0 bg-transparent p-0">
                  <input checked={item.enabled} className="mt-1 size-4" type="checkbox" onChange={() => updateSection(item.id, { enabled: !item.enabled })} />
                  <BuilderItemContent>
                    <BuilderItemTitle>{item.label}</BuilderItemTitle>
                    <BuilderItemDescription>{items[item.id]?.length ? `${items[item.id].length} itens disponiveis` : "Secao de perfil"}</BuilderItemDescription>
                  </BuilderItemContent>
                </BuilderItem>
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
              </div>
            )}
            onReorder={reorderSections}
          />

          <div className="flex flex-wrap gap-3 pt-2">
            <Button disabled={busy} onClick={() => saveMutation.mutate()}>{saveMutation.isPending ? "Salvando..." : "Salvar"}</Button>
            <Button disabled={busy} variant="secondary" onClick={() => publishMutation.mutate()}>{publishMutation.isPending ? "Publicando..." : "Publicar"}</Button>
            <Button asChild variant="ghost"><Link href="/">Abrir portfolio</Link></Button>
          </div>
          <BuilderStatus>A versao publicada substitui a anterior e reflete imediatamente no site.</BuilderStatus>
        </BuilderPanel>

        <BuilderPreview className="overflow-hidden p-0">
          <BuilderBrowserBar url={displayUrl(env.appUrl)} />
          <div className="flex min-h-[620px] flex-col gap-8 bg-background p-6">
            {[...sections].filter((item) => item.enabled).sort((a, b) => a.order - b.order).map((item) => (
              <PortfolioPreviewSection key={item.id} id={item.id} portfolio={portfolioQuery.data} />
            ))}
          </div>
        </BuilderPreview>
      </BuilderLayout>
    </>
  );
}

type PortfolioData = Awaited<ReturnType<typeof getPublicPortfolio>>;

const portfolioPreviewRegistry: Record<string, (portfolio: PortfolioData | undefined) => React.ReactNode> = {
  hero: (portfolio) => (
    <section className="flex min-h-48 flex-col justify-center gap-3">
      <p className="text-sm text-muted-foreground">software</p>
      <h2 className="text-4xl font-semibold">{portfolio?.profile?.headline || "developer"}</h2>
    </section>
  ),
  about: (portfolio) => <PreviewSection title="Sobre">{portfolio?.profile?.summary || "Resumo do perfil."}</PreviewSection>,
  skills: (portfolio) => <PreviewGrid items={portfolio?.skills.map((item) => item.title) ?? []} title="Habilidades" />,
  projects: (portfolio) => <PreviewGrid items={portfolio?.projects.map((item) => item.title) ?? []} title="Projetos" />,
  experiences: (portfolio) => <PreviewGrid items={portfolio?.experiences.map((item) => item.title) ?? []} title="Experiencias" />,
  pages: (portfolio) => <PreviewGrid items={portfolio?.navigationPages.map((item) => item.title) ?? []} title="Paginas" />,
  "custom-sections": (portfolio) => <PreviewGrid items={portfolio?.customSections.map((item) => item.title) ?? []} title="Secoes" />,
  github: (portfolio) => <PreviewGrid items={portfolio?.github?.repositories.map((item) => item.name) ?? []} title="GitHub" />,
};

function PortfolioPreviewSection({ id, portfolio }: { id: string; portfolio: PortfolioData | undefined }) {
  return portfolioPreviewRegistry[id]?.(portfolio) ?? null;
}

function PreviewSection({ children, title }: { children: React.ReactNode; title: string }) {
  return <Section><SectionTitle>{title}</SectionTitle><SectionContent>{children}</SectionContent></Section>;
}

function PreviewGrid({ items, title }: { items: string[]; title: string }) {
  return <Section><SectionTitle>{title}</SectionTitle><div className="grid gap-3 md:grid-cols-2">{(items.length ? items : ["Sem itens."]).map((item) => <div key={item} className="rounded-md border border-border bg-card p-3 text-sm">{item}</div>)}</div></Section>;
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
