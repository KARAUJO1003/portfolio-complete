"use client";

import type { CustomSectionDto } from "@portfolio/contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ds/badge";
import { EmptyState, ErrorState } from "@/components/ds/admin-primitives";
import { ConfirmDialog } from "@/components/ds/confirm-dialog";
import { PageDescription, PageHeader, PageTitle } from "@/components/ds/page";
import { Section, SectionHeader, SectionTitle } from "@/components/ds/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteCustomSection } from "@/features/custom-sections/api/custom-sections-api";
import {
  customSectionsKeys,
  customSectionsListQueryOptions,
} from "@/features/custom-sections/api/custom-sections-queries";
import { CustomSectionForm } from "@/features/custom-sections/forms/custom-section-form";

export function CustomSectionsFeature() {
  const queryClient = useQueryClient();
  const query = useQuery(customSectionsListQueryOptions());
  const [editing, setEditing] = useState<CustomSectionDto | null>(null);
  const [pendingDelete, setPendingDelete] = useState<CustomSectionDto | null>(
    null,
  );

  const remove = useMutation({
    mutationFn: deleteCustomSection,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: customSectionsKeys.list(),
      });
      toast.success("Secao removida.");
      setPendingDelete(null);
    },
    onError: () => toast.error("Nao foi possivel remover a secao."),
  });

  return (
    <>
      <PageHeader>
        <PageTitle>Secoes customizadas</PageTitle>
        <PageDescription>
          Crie blocos livres reutilizaveis no portfolio e em versoes do
          curriculo.
        </PageDescription>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>{editing ? "Editar secao" : "Nova secao"}</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomSectionForm
            section={editing}
            onDone={() => setEditing(null)}
          />
        </CardContent>
      </Card>
      <Section>
        <SectionHeader>
          <SectionTitle>Secoes cadastradas</SectionTitle>
        </SectionHeader>
        {query.isError ? (
          <ErrorState
            title="Nao foi possivel carregar as secoes"
            description="A listagem nao respondeu. Verifique a API e tente novamente."
          />
        ) : !query.isLoading && !query.data?.length ? (
          <EmptyState
            title="Nenhuma secao cadastrada"
            description="Crie a primeira secao no formulario acima."
          />
        ) : (
          <div className="gap-3 grid">
            {query.data?.map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap justify-between items-center gap-3 bg-card p-4 border border-border rounded-md"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <strong>{item.title}</strong>
                    <Badge
                      tone={item.status === "published" ? "success" : "muted"}
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-muted-foreground text-xs">
                    {item.key} · portfolio{" "}
                    {item.visibility.portfolio ? "sim" : "nao"} · curriculo{" "}
                    {item.visibility.resume ? "sim" : "nao"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setEditing(item)}>
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setPendingDelete(item)}
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Excluir secao"
        description={`Esta acao remove "${pendingDelete?.title}" definitivamente.`}
        loading={remove.isPending}
        onConfirm={() => pendingDelete && remove.mutate(pendingDelete.id)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      />
    </>
  );
}
