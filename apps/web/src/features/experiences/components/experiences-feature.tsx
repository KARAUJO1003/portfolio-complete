"use client";

import type { ExperienceDto } from "@portfolio/contracts";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DrawerFormShell } from "@/components/ds/drawer-form";
import { PageDescription, PageHeader, PageTitle } from "@/components/ds/page";
import { EXPERIENCE_FORM_ID, ExperienceForm } from "@/features/experiences/forms/experience-form";
import { ExperiencesTable } from "@/features/experiences/components/experiences-table";

export function ExperiencesFeature() {
  const [editingExperience, setEditingExperience] = useState<ExperienceDto | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setEditingExperience(null);
    setDrawerOpen(true);
  }

  function openEdit(experience: ExperienceDto) {
    setEditingExperience(experience);
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setEditingExperience(null);
  }

  return (
    <>
      <PageHeader className="flex-row flex-wrap items-center justify-between gap-3">
        <div>
          <PageTitle>Trajetoria</PageTitle>
          <PageDescription>
            Gerencie experiencias, formacao, certificacoes e links reutilizaveis no curriculo.
          </PageDescription>
        </div>
        <Button type="button" onClick={openCreate}>
          <PlusIcon className="size-4" />
          Novo item
        </Button>
      </PageHeader>

      <ExperiencesTable onEdit={openEdit} />

      <DrawerFormShell
        description="Use visibilidade para controlar se o item entra no portfolio, curriculo ou ambos."
        formId={EXPERIENCE_FORM_ID}
        open={drawerOpen}
        saveLabel={editingExperience ? "Salvar alteracoes" : "Criar item"}
        saving={saving}
        title={editingExperience ? "Editar item" : "Novo item"}
        onOpenChange={(open) => (open ? setDrawerOpen(true) : closeDrawer())}
      >
        <ExperienceForm experience={editingExperience} onDone={closeDrawer} onPendingChange={setSaving} />
      </DrawerFormShell>
    </>
  );
}
