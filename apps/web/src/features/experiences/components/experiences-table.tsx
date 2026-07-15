"use client";

import type { ExperienceDto } from "@portfolio/contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/datatable/data-table";
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

  const deleteMutation = useMutation({
    mutationFn: deleteExperience,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: experiencesKeys.list() }),
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
              <Button type="button" variant="ghost" onClick={() => deleteMutation.mutate(row.original.id)}>
                Excluir
              </Button>
            </Can>
          </div>
        ),
      },
    ],
    [deleteMutation, onEdit],
  );

  return (
    <DataTable
      data={experiencesQuery.data ?? []}
      columns={columns}
      emptyLabel={experiencesQuery.isLoading ? "Carregando itens..." : "Nenhum item cadastrado."}
    />
  );
}
