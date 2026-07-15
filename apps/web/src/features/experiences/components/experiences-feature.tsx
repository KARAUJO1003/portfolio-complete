"use client";

import type { ExperienceDto } from "@portfolio/contracts";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageDescription, PageHeader, PageTitle } from "@/components/ds/page";
import { Section, SectionContent, SectionHeader, SectionTitle } from "@/components/ds/section";
import { ExperienceForm } from "@/features/experiences/forms/experience-form";
import { ExperiencesTable } from "@/features/experiences/components/experiences-table";

export function ExperiencesFeature() {
  const [editingExperience, setEditingExperience] = useState<ExperienceDto | null>(null);

  return (
    <>
      <PageHeader>
        <PageTitle>Experiencias</PageTitle>
        <PageDescription>
          Gerencie experiencias, formacao, certificacoes e links reutilizaveis no curriculo.
        </PageDescription>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>{editingExperience ? "Editar item" : "Novo item"}</CardTitle>
          <CardDescription>
            Use visibilidade para controlar se o item entra no portfolio, curriculo ou ambos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExperienceForm
            experience={editingExperience}
            onDone={() => setEditingExperience(null)}
          />
        </CardContent>
      </Card>

      <Section>
        <SectionHeader>
          <SectionTitle>Itens cadastrados</SectionTitle>
        </SectionHeader>
        <SectionContent>
          <ExperiencesTable onEdit={setEditingExperience} />
        </SectionContent>
      </Section>
    </>
  );
}
