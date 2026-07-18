"use client";

import type { CustomPageDto } from "@portfolio/contracts";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DrawerFormShell } from "@/components/ds/drawer-form";
import { PageDescription, PageHeader, PageTitle } from "@/components/ds/page";
import { PAGE_FORM_ID, PageForm } from "@/features/pages/forms/page-form";
import { PagesTable } from "@/features/pages/components/pages-table";

export function PagesFeature() {
  const [editingPage, setEditingPage] = useState<CustomPageDto | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setEditingPage(null);
    setDrawerOpen(true);
  }

  function openEdit(page: CustomPageDto) {
    setEditingPage(page);
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setEditingPage(null);
  }

  return (
    <>
      <PageHeader className="flex-row flex-wrap items-center justify-between gap-3">
        <div>
          <PageTitle>Paginas</PageTitle>
          <PageDescription>
            Crie paginas publicas customizadas para cases, textos ou secoes extras.
          </PageDescription>
        </div>
        <Button type="button" onClick={openCreate}>
          <PlusIcon className="size-4" />
          Nova pagina
        </Button>
      </PageHeader>

      <PagesTable onEdit={openEdit} />

      <DrawerFormShell
        description="Conteudo livre nesta fase; suporte completo a Markdown/MDX pode entrar depois."
        formId={PAGE_FORM_ID}
        maxWidth="max-w-3xl"
        open={drawerOpen}
        saveLabel={editingPage ? "Salvar alteracoes" : "Criar pagina"}
        saving={saving}
        title={editingPage ? "Editar pagina" : "Nova pagina"}
        onOpenChange={(open) => (open ? setDrawerOpen(true) : closeDrawer())}
      >
        <PageForm page={editingPage} onDone={closeDrawer} onPendingChange={setSaving} />
      </DrawerFormShell>
    </>
  );
}
