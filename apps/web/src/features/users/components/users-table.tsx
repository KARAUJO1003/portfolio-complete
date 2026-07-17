"use client";

import type { UserDto } from "@portfolio/contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ds/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/datatable/data-table";
import { ErrorState } from "@/components/ds/admin-primitives";
import { ConfirmDialog } from "@/components/ds/confirm-dialog";
import { Can } from "@/core/auth/components/can";
import { useAuth } from "@/core/auth/contexts/auth-context";
import { deleteUser } from "@/features/users/api/users-api";
import { usersKeys, usersListQueryOptions } from "@/features/users/api/users-queries";
import { USERS_PERMISSIONS } from "@/features/users/permissions";

type UsersTableProps = {
  onEdit: (user: UserDto) => void;
};

export function UsersTable({ onEdit }: UsersTableProps) {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();
  const usersQuery = useQuery(usersListQueryOptions());
  const [pendingDelete, setPendingDelete] = useState<UserDto | null>(null);

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.list() });
      setPendingDelete(null);
    },
  });

  const columns = useMemo<ColumnDef<UserDto, unknown>[]>(
    () => [
      { accessorKey: "name", header: "Nome" },
      { accessorKey: "email", header: "Email" },
      {
        id: "role",
        header: "Papel",
        cell: ({ row }) => <Badge tone={row.original.role === "owner" ? "success" : "muted"}>{row.original.role}</Badge>,
      },
      {
        id: "actions",
        header: "Acoes",
        cell: ({ row }) => {
          const isSelf = row.original.id === currentUser?.id;

          return (
            <div className="flex gap-2">
              <Can can={[USERS_PERMISSIONS.update]}>
                <Button type="button" variant="ghost" onClick={() => onEdit(row.original)}>
                  Editar
                </Button>
              </Can>
              <Can can={[USERS_PERMISSIONS.delete]}>
                <Button
                  disabled={isSelf}
                  title={isSelf ? "Voce nao pode excluir a propria conta" : undefined}
                  type="button"
                  variant="ghost"
                  onClick={() => setPendingDelete(row.original)}
                >
                  Excluir
                </Button>
              </Can>
            </div>
          );
        },
      },
    ],
    [currentUser?.id, onEdit],
  );

  if (usersQuery.isError) {
    return (
      <ErrorState
        title="Nao foi possivel carregar usuarios"
        description="A listagem nao respondeu. Verifique a API e tente novamente."
      />
    );
  }

  return (
    <>
      <DataTable
        data={usersQuery.data ?? []}
        columns={columns}
        emptyLabel="Nenhum usuario cadastrado."
        isLoading={usersQuery.isLoading}
      />
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Excluir usuario"
        description={`Esta acao remove o acesso de "${pendingDelete?.name}" imediatamente.`}
        loading={deleteMutation.isPending}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      />
    </>
  );
}
