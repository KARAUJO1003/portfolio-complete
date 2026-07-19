"use client";

import type { CustomSectionDto } from "@portfolio/contracts";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DrawerFormShell } from "@/components/ds/drawer-form";
import { PageDescription, PageHeader, PageTitle } from "@/components/ds/page";
import { CUSTOM_SECTION_FORM_ID, CustomSectionForm } from "@/features/custom-sections/forms/custom-section-form";
import { CustomSectionsTable } from "@/features/custom-sections/components/custom-sections-table";

export function CustomSectionsFeature() {
  const [editing, setEditing] = useState<CustomSectionDto | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setEditing(null);
    setDrawerOpen(true);
  }

  function openEdit(section: CustomSectionDto) {
    setEditing(section);
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setEditing(null);
  }

  return (
    <>
      <PageHeader className="flex-row flex-wrap items-center justify-between gap-3">
        <div>
          <PageTitle>Seções customizadas</PageTitle>
          <PageDescription>
            Crie blocos livres reutilizáveis no portfolio e em versões do currículo.
          </PageDescription>
        </div>
        <Button type="button" onClick={openCreate}>
          <PlusIcon className="size-4" />
          Nova seção
        </Button>
      </PageHeader>

      <CustomSectionsTable onEdit={openEdit} />

      <DrawerFormShell
        description="Título, chave única, conteúdo rico e controle de exibição."
        formId={CUSTOM_SECTION_FORM_ID}
        maxWidth="max-w-3xl"
        open={drawerOpen}
        saveLabel={editing ? "Salvar alterações" : "Criar seção"}
        saving={saving}
        title={editing ? "Editar seção" : "Nova seção"}
        onOpenChange={(open) => (open ? setDrawerOpen(true) : closeDrawer())}
      >
        <CustomSectionForm section={editing} onDone={closeDrawer} onPendingChange={setSaving} />
      </DrawerFormShell>
    </>
  );
}
