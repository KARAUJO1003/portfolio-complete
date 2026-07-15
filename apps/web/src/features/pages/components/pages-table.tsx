"use client";

import type { CustomPageDto } from "@portfolio/contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/datatable/data-table";
import { Can } from "@/core/auth/components/can";
import { deletePage } from "@/features/pages/api/pages-api";
import { pagesKeys, pagesListQueryOptions } from "@/features/pages/api/pages-queries";
import { PAGES_PERMISSIONS } from "@/features/pages/permissions";

type PagesTableProps = {
  onEdit: (page: CustomPageDto) => void;
};

export function PagesTable({ onEdit }: PagesTableProps) {
  const queryClient = useQueryClient();
  const pagesQuery = useQuery(pagesListQueryOptions());

  const deleteMutation = useMutation({
    mutationFn: deletePage,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: pagesKeys.list() }),
  });

  const columns = useMemo<ColumnDef<CustomPageDto, unknown>[]>(
    () => [
      { accessorKey: "title", header: "Titulo" },
      { accessorKey: "slug", header: "Slug" },
      { accessorKey: "status", header: "Status" },
      {
        id: "publicUrl",
        header: "Publica",
        cell: ({ row }) =>
          row.original.status === "published" ? (
            <Link className="underline underline-offset-4" href={`/p/${row.original.slug}`}>
              abrir
            </Link>
          ) : (
            "-"
          ),
      },
      {
        id: "actions",
        header: "Acoes",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Can can={[PAGES_PERMISSIONS.update]}>
              <Button type="button" variant="ghost" onClick={() => onEdit(row.original)}>
                Editar
              </Button>
            </Can>
            <Can can={[PAGES_PERMISSIONS.delete]}>
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
      data={pagesQuery.data ?? []}
      columns={columns}
      emptyLabel={pagesQuery.isLoading ? "Carregando paginas..." : "Nenhuma pagina cadastrada."}
    />
  );
}
