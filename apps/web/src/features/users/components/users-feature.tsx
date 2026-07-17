"use client";

import type { UserDto } from "@portfolio/contracts";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageDescription, PageHeader, PageTitle } from "@/components/ds/page";
import { Section, SectionContent, SectionHeader, SectionTitle } from "@/components/ds/section";
import { Can } from "@/core/auth/components/can";
import { UserForm } from "@/features/users/forms/user-form";
import { UsersTable } from "@/features/users/components/users-table";
import { USERS_PERMISSIONS } from "@/features/users/permissions";

export function UsersFeature() {
  const [editingUser, setEditingUser] = useState<UserDto | null>(null);

  return (
    <>
      <PageHeader>
        <PageTitle>Usuarios</PageTitle>
        <PageDescription>Convide colaboradores e controle o que cada papel pode acessar no admin.</PageDescription>
      </PageHeader>

      <Can can={[USERS_PERMISSIONS.create]}>
        <Card>
          <CardHeader>
            <CardTitle>{editingUser ? "Editar usuario" : "Novo usuario"}</CardTitle>
            <CardDescription>
              Papeis definem o conjunto de permissoes automaticamente: owner, admin, editor ou visualizador.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserForm user={editingUser} onDone={() => setEditingUser(null)} />
          </CardContent>
        </Card>
      </Can>

      <Section>
        <SectionHeader>
          <SectionTitle>Usuarios cadastrados</SectionTitle>
        </SectionHeader>
        <SectionContent>
          <UsersTable onEdit={setEditingUser} />
        </SectionContent>
      </Section>
    </>
  );
}
