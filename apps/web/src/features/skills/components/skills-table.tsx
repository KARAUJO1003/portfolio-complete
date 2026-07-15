"use client";

import type { SkillDto } from "@portfolio/contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/datatable/data-table";
import { Can } from "@/core/auth/components/can";
import { deleteSkill } from "@/features/skills/api/skills-api";
import { skillsKeys, skillsListQueryOptions } from "@/features/skills/api/skills-queries";
import { SKILLS_PERMISSIONS } from "@/features/skills/permissions";

type SkillsTableProps = {
  onEdit: (skill: SkillDto) => void;
};

export function SkillsTable({ onEdit }: SkillsTableProps) {
  const queryClient = useQueryClient();
  const skillsQuery = useQuery(skillsListQueryOptions());

  const deleteMutation = useMutation({
    mutationFn: deleteSkill,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: skillsKeys.list() }),
  });

  const columns = useMemo<ColumnDef<SkillDto, unknown>[]>(
    () => [
      { accessorKey: "title", header: "Titulo" },
      { accessorKey: "category", header: "Categoria" },
      { accessorKey: "startedAt", header: "Inicio" },
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
            <Can can={[SKILLS_PERMISSIONS.update]}>
              <Button type="button" variant="ghost" onClick={() => onEdit(row.original)}>
                Editar
              </Button>
            </Can>
            <Can can={[SKILLS_PERMISSIONS.delete]}>
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
      data={skillsQuery.data ?? []}
      columns={columns}
      emptyLabel={skillsQuery.isLoading ? "Carregando habilidades..." : "Nenhuma habilidade cadastrada."}
    />
  );
}
