"use client";

import type { ProjectDto } from "@portfolio/contracts";
import { useState } from "react";
import {
  PageFrame,
  PageFrameContent,
  PageFrameDescription,
  PageFrameHeader,
  PageFrameTitle,
} from "@/components/ds/admin-primitives";
import { PageDescription, PageHeader, PageTitle } from "@/components/ds/page";
import { ProjectForm } from "@/features/projects/forms/project-form";
import { ProjectsTable } from "@/features/projects/components/projects-table";

export function ProjectsFeature() {
  const [editingProject, setEditingProject] = useState<ProjectDto | null>(null);

  return (
    <>
      <PageHeader>
        <PageTitle>Projetos</PageTitle>
        <PageDescription>
          Cadastre projetos e escolha se aparecem no portfolio, no curriculo ou em ambos.
        </PageDescription>
      </PageHeader>

      <PageFrame>
        <PageFrameHeader>
          <div>
            <PageFrameTitle>{editingProject ? "Editar projeto" : "Novo projeto"}</PageFrameTitle>
            <PageFrameDescription>
              Organize conteudo, imagem, links e publicacao com preview antes de salvar.
            </PageFrameDescription>
          </div>
        </PageFrameHeader>
        <PageFrameContent>
          <ProjectForm project={editingProject} onDone={() => setEditingProject(null)} />
        </PageFrameContent>
      </PageFrame>

      <ProjectsTable onEdit={setEditingProject} />
    </>
  );
}
