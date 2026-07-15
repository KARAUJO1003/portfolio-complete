"use client";

import type { ProjectDto } from "@portfolio/contracts";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageDescription, PageHeader, PageTitle } from "@/components/ds/page";
import { Section, SectionContent, SectionHeader, SectionTitle } from "@/components/ds/section";
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

      <Card>
        <CardHeader>
          <CardTitle>{editingProject ? "Editar projeto" : "Novo projeto"}</CardTitle>
          <CardDescription>
            Use paths relativos para imagens; o front concatena com `NEXT_PUBLIC_BASE_URL_FILES`.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectForm project={editingProject} onDone={() => setEditingProject(null)} />
        </CardContent>
      </Card>

      <Section>
        <SectionHeader>
          <SectionTitle>Projetos cadastrados</SectionTitle>
        </SectionHeader>
        <SectionContent>
          <ProjectsTable onEdit={setEditingProject} />
        </SectionContent>
      </Section>
    </>
  );
}
