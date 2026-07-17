"use client";

import type { ExperienceDto } from "@portfolio/contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/datatable/data-table";
import { ErrorState } from "@/components/ds/admin-primitives";
import { ConfirmDialog } from "@/components/ds/confirm-dialog";
import { Can } from "@/core/auth/components/can";
import { deleteExperience } from "@/features/experiences/api/experiences-api";
import {
  experiencesKeys,
  experiencesListQueryOptions,
} from "@/features/experiences/api/experiences-queries";
import { EXPERIENCES_PERMISSIONS } from "@/features/experiences/permissions";

type ExperiencesTableProps = {
  onEdit: (experience: ExperienceDto) => void;
};

export function ExperiencesTable({ onEdit }: ExperiencesTableProps) {
  const queryClient = useQueryClient();
  const experiencesQuery = useQuery(experiencesListQueryOptions());
  const [pendingDelete, setPendingDelete] = useState<ExperienceDto | null>(null);

  const deleteMutation = useMutation({
    mutationFn: deleteExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: experiencesKeys.list() });
      setPendingDelete(null);
    },
  });

  const columns = useMemo<ColumnDef<ExperienceDto, unknown>[]>(
    () => [
      { accessorKey: "type", header: "Tipo" },
      { accessorKey: "title", header: "Titulo" },
      { accessorKey: "organization", header: "Organizacao" },
      { accessorKey: "startDate", header: "Inicio" },
      {
        id: "visibility",
        header: "Visibilidade",
        cell: ({ row }) =>
          [
            row.original.visibility.portfolio ? "portfolio" : null,
            row.original.visibility.resume ? "curriculo" : null,
          ]
            .filter(Boolean)
            .join(", "),
      },
      {
        id: "actions",
        header: "Acoes",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Can can={[EXPERIENCES_PERMISSIONS.update]}>
              <Button type="button" variant="ghost" onClick={() => onEdit(row.original)}>
                Editar
              </Button>
            </Can>
            <Can can={[EXPERIENCES_PERMISSIONS.delete]}>
              <Button type="button" variant="ghost" onClick={() => setPendingDelete(row.original)}>
                Excluir
              </Button>
            </Can>
          </div>
        ),
      },
    ],
    [onEdit],
  );

  if (experiencesQuery.isError) {
    return (
      <ErrorState
        title="Nao foi possivel carregar a trajetoria"
        description="A listagem nao respondeu. Verifique a API e tente novamente."
      />
    );
  }

  return (
    <>
      <DataTable
        data={experiencesQuery.data ?? []}
        columns={columns}
        emptyLabel="Nenhum item cadastrado."
        isLoading={experiencesQuery.isLoading}
      />
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Excluir item"
        description={`Esta acao remove "${pendingDelete?.title}" definitivamente.`}
        loading={deleteMutation.isPending}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      />
    </>
  );
}
