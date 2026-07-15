"use client";

import type { CustomPageDto } from "@portfolio/contracts";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageDescription, PageHeader, PageTitle } from "@/components/ds/page";
import { Section, SectionContent, SectionHeader, SectionTitle } from "@/components/ds/section";
import { PageForm } from "@/features/pages/forms/page-form";
import { PagesTable } from "@/features/pages/components/pages-table";

export function PagesFeature() {
  const [editingPage, setEditingPage] = useState<CustomPageDto | null>(null);

  return (
    <>
      <PageHeader>
        <PageTitle>Paginas</PageTitle>
        <PageDescription>
          Crie paginas publicas customizadas para cases, textos ou secoes extras.
        </PageDescription>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>{editingPage ? "Editar pagina" : "Nova pagina"}</CardTitle>
          <CardDescription>
            Conteudo livre nesta fase; suporte completo a Markdown/MDX pode entrar depois.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PageForm page={editingPage} onDone={() => setEditingPage(null)} />
        </CardContent>
      </Card>

      <Section>
        <SectionHeader>
          <SectionTitle>Paginas cadastradas</SectionTitle>
        </SectionHeader>
        <SectionContent>
          <PagesTable onEdit={setEditingPage} />
        </SectionContent>
      </Section>
    </>
  );
}
