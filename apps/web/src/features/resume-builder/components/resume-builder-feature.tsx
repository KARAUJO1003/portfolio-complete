"use client";

import type { ContentVersionSection, CustomSectionDto, ExperienceDto, ProfileDto, ProjectDto, SkillDto } from "@portfolio/contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Fragment, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ds/badge";
import {
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
import { RichText } from "@/components/ds/rich-text";
import { SectionHeader, SectionTitle } from "@/components/ds/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createContentVersion,
  publishContentVersion,
  updateContentVersion,
} from "@/features/content-versions/api/content-versions-api";
import { contentVersionKeys, contentVersionsQueryOptions } from "@/features/content-versions/api/content-versions-queries";
import { customSectionsListQueryOptions } from "@/features/custom-sections/api/custom-sections-queries";
import { experiencesListQueryOptions } from "@/features/experiences/api/experiences-queries";
import { myProfileQueryOptions } from "@/features/profile/api/profile-queries";
import { projectsListQueryOptions } from "@/features/projects/api/projects-queries";
import { generateResumePdf } from "@/features/resume-builder/api/resume-pdf-api";
import { skillsListQueryOptions } from "@/features/skills/api/skills-queries";

const defaultSections: ContentVersionSection[] = [
  section("profile", "Dados pessoais", 0),
  section("summary", "Resumo profissional", 1),
  section("work", "Historico profissional", 2),
  section("skills", "Competencias", 3),
  section("achievements", "Conquistas e distincoes", 4),
  section("certifications", "Certificacoes", 5),
  section("education", "Formacao academica", 6),
  section("projects", "Projetos", 7, false),
  section("custom-sections", "Secoes customizadas", 8, false),
  section("objective", "Objetivo", 9),
];

export function ResumeBuilderFeature() {
  const queryClient = useQueryClient();
  const versionsQuery = useQuery(contentVersionsQueryOptions("resume"));
  const profileQuery = useQuery(myProfileQueryOptions());
  const skillsQuery = useQuery(skillsListQueryOptions());
  const projectsQuery = useQuery(projectsListQueryOptions());
  const experiencesQuery = useQuery(experiencesListQueryOptions());
  const customSectionsQuery = useQuery(customSectionsListQueryOptions());
  const [versionId, setVersionId] = useState("");
  const [name, setName] = useState("Curriculo principal");
  const [sections, setSections] = useState(defaultSections);
  const [template, setTemplate] = useState<"classic-ats" | "compact-ats">("classic-ats");

  useEffect(() => {
    if (versionId || !versionsQuery.data?.length) return;
    const initial = versionsQuery.data.find((version) => version.status === "published") ?? versionsQuery.data[0];
    loadVersion(initial.id);
  }, [versionsQuery.data, versionId]);

  const experiences = experiencesQuery.data ?? [];
  const items = useMemo<Record<string, { id: string; label: string }[]>>(() => ({
    skills: (skillsQuery.data ?? []).map((item) => ({ id: item.id, label: item.title })),
    projects: (projectsQuery.data ?? []).map((item) => ({ id: item.id, label: item.title })),
    work: experiences.filter((item) => item.type === "work").map(toOption),
    achievements: experiences.filter((item) => item.type === "link" && /conquista|distinc/i.test(item.organization)).map(toOption),
    certifications: experiences.filter((item) => item.type === "certification").map(toOption),
    education: experiences.filter((item) => item.type === "education").map(toOption),
    "custom-sections": (customSectionsQuery.data ?? []).map((item) => ({ id: item.id, label: item.title })),
  }), [skillsQuery.data, projectsQuery.data, experiences, customSectionsQuery.data]);

  async function persist() {
    const input = { name: name.trim() || "Curriculo", slug: slugify(name) || "curriculo", template, sections };
    return versionId
      ? updateContentVersion(versionId, input)
      : createContentVersion({ ...input, kind: "resume" as const });
  }

  const saveMutation = useMutation({
    mutationFn: persist,
    onSuccess: async (version) => {
      setVersionId(version.id);
      await queryClient.invalidateQueries({ queryKey: contentVersionKeys.list("resume") });
      toast.success("Versao do curriculo salva.");
    },
    onError: () => toast.error("Nao foi possivel salvar o curriculo."),
  });

  const publishMutation = useMutation({
    mutationFn: async () => publishContentVersion((await persist()).id),
    onSuccess: async (version) => {
      setVersionId(version.id);
      await queryClient.invalidateQueries({ queryKey: contentVersionKeys.list("resume") });
      toast.success("Versao padrao do curriculo publicada.");
    },
    onError: () => toast.error("Nao foi possivel publicar o curriculo."),
  });

  const pdfMutation = useMutation({
    mutationFn: async () => generateResumePdf(template, { versionId: (await persist()).id }),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${slugify(name) || "curriculo"}-${template}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
      toast.success("PDF gerado.");
    },
    onError: () => toast.error("Nao foi possivel gerar o PDF."),
  });

  function loadVersion(id: string) {
    const version = versionsQuery.data?.find((item) => item.id === id);
    if (!version) return;
    setVersionId(version.id);
    setName(version.name);
    setSections(version.sections.length ? version.sections : defaultSections);
    setTemplate(version.template === "compact-ats" ? "compact-ats" : "classic-ats");
  }

  function newVersion() {
    setVersionId("");
    setName("Nova versao");
    setSections(defaultSections.map((item) => ({ ...item, itemIds: [] })));
    setTemplate("classic-ats");
  }

  function updateSection(id: string, patch: Partial<ContentVersionSection>) {
    setSections((current) => current.map((item) => item.id === id ? { ...item, ...patch } : item));
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

  const busy = saveMutation.isPending || publishMutation.isPending || pdfMutation.isPending;
  const currentVersion = versionsQuery.data?.find((item) => item.id === versionId);

  return (
    <>
      <PageHeader>
        <PageTitle>Builder de curriculo</PageTitle>
        <PageDescription>Monte versoes independentes, selecione itens e gere um PDF textual compativel com ATS.</PageDescription>
      </PageHeader>
      <BuilderLayout>
        <BuilderPanel>
          <SectionHeader>
            <SectionTitle>Versao</SectionTitle>
            {currentVersion && <Badge tone={currentVersion.status === "published" ? "success" : "muted"}>{currentVersion.status}</Badge>}
          </SectionHeader>
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <select className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background" value={versionId} onChange={(event) => loadVersion(event.target.value)}>
              <option value="">Nova versao</option>
              {versionsQuery.data?.map((version) => <option key={version.id} value={version.id}>{version.name} ({version.status})</option>)}
            </select>
            <Button type="button" variant="ghost" onClick={newVersion}>Nova</Button>
          </div>
          <Input aria-label="Nome da versao" value={name} onChange={(event) => setName(event.target.value)} />
          <select className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background" value={template} onChange={(event) => setTemplate(event.target.value as "classic-ats" | "compact-ats")}><option value="classic-ats">Classic ATS</option><option value="compact-ats">Compact ATS</option></select>

          <BuilderSortableList
            items={[...sections].sort((a, b) => a.order - b.order)}
            renderItem={(item) => (
              <div className="rounded-md border border-border bg-background p-3">
                <BuilderItem className="border-0 bg-transparent p-0">
                  <input checked={item.enabled} className="mt-1 size-4" type="checkbox" onChange={() => updateSection(item.id, { enabled: !item.enabled })} />
                  <BuilderItemContent>
                    <BuilderItemTitle>{item.label}</BuilderItemTitle>
                    <BuilderItemDescription>{items[item.id]?.length ? `${items[item.id].length} itens` : "Conteudo do perfil"}</BuilderItemDescription>
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
            <Button disabled={busy} variant="outline" onClick={() => pdfMutation.mutate()}>{pdfMutation.isPending ? "Gerando..." : "Baixar PDF"}</Button>
          </div>
          <BuilderStatus>Resumo, objetivo e descricoes aceitam **negrito**. O download salva a versao antes de gerar.</BuilderStatus>
        </BuilderPanel>

        <BuilderPreview className="overflow-auto bg-neutral-200 p-6">
          <ResumePreview profile={profileQuery.data} skills={skillsQuery.data ?? []} projects={projectsQuery.data ?? []} experiences={experiences} customSections={customSectionsQuery.data ?? []} sections={sections} />
        </BuilderPreview>
      </BuilderLayout>
    </>
  );
}

type ResumeRenderCtx = {
  profile: ProfileDto | null | undefined;
  skills: SkillDto[];
  projects: ProjectDto[];
  experiences: ExperienceDto[];
  customSections: CustomSectionDto[];
  selected: (id: string, itemId: string) => boolean;
};

const resumeSectionRegistry: Record<string, (config: ContentVersionSection, ctx: ResumeRenderCtx) => React.ReactNode> = {
  profile: (_config, { profile }) => (
    <header className="mb-6">
      <h2 className="text-xl font-bold uppercase text-sky-700">{profile?.name || "Nome"}</h2>
      <p>{[profile?.address || profile?.location, profile?.website, profile?.phone, profile?.email].filter(Boolean).join(" | ")}</p>
      <p>{[profile?.birthDate, profile?.driverLicense, profile?.headline].filter(Boolean).join(" | ")}</p>
    </header>
  ),
  summary: (_config, { profile }) =>
    profile?.summary ? <ResumeBlock title="Resumo profissional"><RichText value={profile.summary} /></ResumeBlock> : null,
  objective: (_config, { profile }) =>
    profile?.objective ? <ResumeBlock title="Objetivo"><RichText value={profile.objective} /></ResumeBlock> : null,
  skills: (config, { skills, selected }) => (
    <ResumeBlock title="Competencias">
      <strong className="block text-sky-700">TECNICAS:</strong>
      <p className="font-semibold">{skills.filter((item) => !/pessoal|soft/i.test(item.category) && selected(config.id, item.id)).map((item) => item.title).join(", ")}</p>
      <strong className="mt-2 block text-sky-700">PESSOAIS:</strong>
      {skills.filter((item) => /pessoal|soft/i.test(item.category) && selected(config.id, item.id)).map((item) => <p key={item.id}>• {item.description || item.title}</p>)}
    </ResumeBlock>
  ),
  work: (config, { experiences, selected }) => renderTypedBlock(config, experiences.filter((item) => item.type === "work"), selected),
  achievements: (config, { experiences, selected }) =>
    renderTypedBlock(config, experiences.filter((item) => item.type === "link" && /conquista|distinc/i.test(item.organization)), selected, true),
  certifications: (config, { experiences, selected }) =>
    renderTypedBlock(config, experiences.filter((item) => item.type === "certification"), selected),
  education: (config, { experiences, selected }) =>
    renderTypedBlock(config, experiences.filter((item) => item.type === "education"), selected),
  projects: (config, { projects, selected }) => (
    <ResumeBlock title="Projetos">
      {projects.filter((item) => selected(config.id, item.id)).map((item) => <p key={item.id}>• <strong>{item.title}</strong> - {item.summary}</p>)}
    </ResumeBlock>
  ),
  "custom-sections": (config, { customSections, selected }) => (
    <div>
      {customSections.filter((item) => selected(config.id, item.id)).map((item) => <ResumeBlock key={item.id} title={item.title}><RichText value={item.content} /></ResumeBlock>)}
    </div>
  ),
};

function renderTypedBlock(config: ContentVersionSection, typed: ExperienceDto[], selected: ResumeRenderCtx["selected"], numbered = false) {
  if (!typed.length) return null;
  return (
    <ResumeBlock title={config.label}>
      {typed.filter((item) => selected(config.id, item.id)).map((item, index) => (
        <p key={item.id} className="mb-1">
          {numbered ? `${index + 1}. ` : "• "}
          <strong>{item.title}</strong>{item.organization ? ` - ${item.organization}` : ""}
          {item.description ? <><br /><RichText value={item.description} /></> : null}
        </p>
      ))}
    </ResumeBlock>
  );
}

function ResumePreview({ profile, skills, projects, experiences, customSections, sections }: { profile: ProfileDto | null | undefined; skills: SkillDto[]; projects: ProjectDto[]; experiences: ExperienceDto[]; customSections: CustomSectionDto[]; sections: ContentVersionSection[] }) {
  const selected = (id: string, itemId: string) => {
    const config = sections.find((item) => item.id === id);
    return config?.selectionMode !== "selected" || config.itemIds.includes(itemId);
  };
  const visible = [...sections].filter((item) => item.enabled).sort((a, b) => a.order - b.order);
  const ctx: ResumeRenderCtx = { profile, skills, projects, experiences, customSections, selected };

  return (
    <article className="mx-auto min-h-[842px] w-full max-w-[595px] bg-white px-12 py-10 text-[12px] leading-[1.45] text-neutral-900 shadow-sm">
      {visible.map((config) => (
        <Fragment key={config.id}>{resumeSectionRegistry[config.id]?.(config, ctx) ?? null}</Fragment>
      ))}
    </article>
  );
}

function ResumeBlock({ children, title }: { children: React.ReactNode; title: string }) {
  return <section className="mb-5"><h3 className="mb-1 text-sm font-bold uppercase text-sky-700">{title}</h3>{children}</section>;
}

function section(id: string, label: string, order: number, enabled = true): ContentVersionSection {
  return { id, label, order, enabled, selectionMode: "all", itemIds: [] };
}

function toOption(item: ExperienceDto) { return { id: item.id, label: item.title }; }
function slugify(value: string) { return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
