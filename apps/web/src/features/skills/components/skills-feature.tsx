"use client";

import type { SkillDto } from "@portfolio/contracts";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageDescription, PageHeader, PageTitle } from "@/components/ds/page";
import { Section, SectionContent, SectionHeader, SectionTitle } from "@/components/ds/section";
import { SkillForm } from "@/features/skills/forms/skill-form";
import { SkillsTable } from "@/features/skills/components/skills-table";

export function SkillsFeature() {
  const [editingSkill, setEditingSkill] = useState<SkillDto | null>(null);

  return (
    <>
      <PageHeader>
        <PageTitle>Habilidades</PageTitle>
        <PageDescription>
          Cadastre habilidades com data, descricao e controle de exibicao no portfolio/curriculo.
        </PageDescription>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>{editingSkill ? "Editar habilidade" : "Nova habilidade"}</CardTitle>
          <CardDescription>
            Estrutura inspirada nos cards de habilidades do portfolio atual.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SkillForm skill={editingSkill} onDone={() => setEditingSkill(null)} />
        </CardContent>
      </Card>

      <Section>
        <SectionHeader>
          <SectionTitle>Habilidades cadastradas</SectionTitle>
        </SectionHeader>
        <SectionContent>
          <SkillsTable onEdit={setEditingSkill} />
        </SectionContent>
      </Section>
    </>
  );
}
