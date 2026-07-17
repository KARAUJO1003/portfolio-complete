"use client";

import type { SkillDto } from "@portfolio/contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/datatable/data-table";
import { ErrorState } from "@/components/ds/admin-primitives";
import { ConfirmDialog } from "@/components/ds/confirm-dialog";
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
  const [pendingDelete, setPendingDelete] = useState<SkillDto | null>(null);

  const deleteMutation = useMutation({
    mutationFn: deleteSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skillsKeys.list() });
      setPendingDelete(null);
    },
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

  if (skillsQuery.isError) {
    return (
      <ErrorState
        title="Nao foi possivel carregar habilidades"
        description="A listagem nao respondeu. Verifique a API e tente novamente."
      />
    );
  }

  return (
    <>
      <DataTable
        data={skillsQuery.data ?? []}
        columns={columns}
        emptyLabel="Nenhuma habilidade cadastrada."
        isLoading={skillsQuery.isLoading}
      />
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Excluir habilidade"
        description={`Esta acao remove "${pendingDelete?.title}" definitivamente.`}
        loading={deleteMutation.isPending}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      />
    </>
  );
}
