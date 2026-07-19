"use client";

import type { ProjectDto } from "@portfolio/contracts";
import { LayoutGridIcon, ListIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageDescription, PageHeader, PageTitle } from "@/components/ds/page";
import { DrawerFormShell } from "@/components/ds/drawer-form";
import { ViewToggle } from "@/components/ds/view-toggle";
import { PROJECT_FORM_ID, ProjectForm } from "@/features/projects/forms/project-form";
import { ProjectsTable } from "@/features/projects/components/projects-table";

const viewOptions = [
  { icon: LayoutGridIcon, label: "Grade", value: "grid" as const },
  { icon: ListIcon, label: "Tabela", value: "table" as const },
];

export function ProjectsFeature() {
  const [editingProject, setEditingProject] = useState<ProjectDto | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<"grid" | "table">("grid");

  function openCreate() {
    setEditingProject(null);
    setDrawerOpen(true);
  }

  function openEdit(project: ProjectDto) {
    setEditingProject(project);
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setEditingProject(null);
  }

  return (
    <>
      <PageHeader className="flex-row flex-wrap items-center justify-between gap-3">
        <div>
          <PageTitle>Projetos</PageTitle>
          <PageDescription>
            Cadastre projetos e escolha se aparecem no portfolio, no currículo ou em ambos.
          </PageDescription>
        </div>
        <div className="flex items-center gap-2">
          <ViewToggle onChange={setView} options={viewOptions} value={view} />
          <Button type="button" onClick={openCreate}>
            <PlusIcon className="size-4" />
            Novo projeto
          </Button>
        </div>
      </PageHeader>

      <ProjectsTable view={view} onEdit={openEdit} />

      <DrawerFormShell
        description="Organize conteúdo, imagem, links e publicação com preview antes de salvar."
        formId={PROJECT_FORM_ID}
        maxWidth="max-w-5xl"
        open={drawerOpen}
        saveLabel={editingProject ? "Salvar alterações" : "Criar projeto"}
        saving={saving}
        title={editingProject ? "Editar projeto" : "Novo projeto"}
        onOpenChange={(open) => (open ? setDrawerOpen(true) : closeDrawer())}
      >
        <ProjectForm project={editingProject} onDone={closeDrawer} onPendingChange={setSaving} />
      </DrawerFormShell>
    </>
  );
}
