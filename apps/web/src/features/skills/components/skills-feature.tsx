"use client";

import type { SkillDto } from "@portfolio/contracts";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DrawerFormShell } from "@/components/ds/drawer-form";
import { PageDescription, PageHeader, PageTitle } from "@/components/ds/page";
import { SKILL_FORM_ID, SkillForm } from "@/features/skills/forms/skill-form";
import { SkillsTable } from "@/features/skills/components/skills-table";

export function SkillsFeature() {
  const [editingSkill, setEditingSkill] = useState<SkillDto | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setEditingSkill(null);
    setDrawerOpen(true);
  }

  function openEdit(skill: SkillDto) {
    setEditingSkill(skill);
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setEditingSkill(null);
  }

  return (
    <>
      <PageHeader className="flex-row flex-wrap items-center justify-between gap-3">
        <div>
          <PageTitle>Habilidades</PageTitle>
          <PageDescription>
            Cadastre habilidades com data, descricao e controle de exibicao no portfolio/curriculo.
          </PageDescription>
        </div>
        <Button type="button" onClick={openCreate}>
          <PlusIcon className="size-4" />
          Nova habilidade
        </Button>
      </PageHeader>

      <SkillsTable onEdit={openEdit} />

      <DrawerFormShell
        description="Nome, categoria, data de inicio e controle de exibicao no portfolio/curriculo."
        formId={SKILL_FORM_ID}
        open={drawerOpen}
        saveLabel={editingSkill ? "Salvar alteracoes" : "Criar habilidade"}
        saving={saving}
        title={editingSkill ? "Editar habilidade" : "Nova habilidade"}
        onOpenChange={(open) => (open ? setDrawerOpen(true) : closeDrawer())}
      >
        <SkillForm skill={editingSkill} onDone={closeDrawer} onPendingChange={setSaving} />
      </DrawerFormShell>
    </>
  );
}
