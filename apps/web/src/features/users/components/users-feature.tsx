"use client";

import type { UserDto } from "@portfolio/contracts";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DrawerFormShell } from "@/components/ds/drawer-form";
import { PageDescription, PageHeader, PageTitle } from "@/components/ds/page";
import { Can } from "@/core/auth/components/can";
import { USER_FORM_ID, UserForm } from "@/features/users/forms/user-form";
import { UsersTable } from "@/features/users/components/users-table";
import { USERS_PERMISSIONS } from "@/features/users/permissions";

export function UsersFeature() {
  const [editingUser, setEditingUser] = useState<UserDto | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setEditingUser(null);
    setDrawerOpen(true);
  }

  function openEdit(user: UserDto) {
    setEditingUser(user);
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setEditingUser(null);
  }

  return (
    <>
      <PageHeader className="flex-row flex-wrap items-center justify-between gap-3">
        <div>
          <PageTitle>Usuarios</PageTitle>
          <PageDescription>Convide colaboradores e controle o que cada papel pode acessar no admin.</PageDescription>
        </div>
        <Can can={[USERS_PERMISSIONS.create]}>
          <Button type="button" onClick={openCreate}>
            <PlusIcon className="size-4" />
            Novo usuario
          </Button>
        </Can>
      </PageHeader>

      <UsersTable onEdit={openEdit} />

      <DrawerFormShell
        description="Papeis definem o conjunto de permissoes automaticamente: owner, admin, editor ou visualizador."
        formId={USER_FORM_ID}
        open={drawerOpen}
        saveLabel={editingUser ? "Salvar alteracoes" : "Criar usuario"}
        saving={saving}
        title={editingUser ? "Editar usuario" : "Novo usuario"}
        onOpenChange={(open) => (open ? setDrawerOpen(true) : closeDrawer())}
      >
        <UserForm user={editingUser} onDone={closeDrawer} onPendingChange={setSaving} />
      </DrawerFormShell>
    </>
  );
}
