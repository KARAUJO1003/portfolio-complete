"use client";

import type { CustomPageDto } from "@portfolio/contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ds/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/datatable/data-table";
import { ConfirmDialog } from "@/components/ds/confirm-dialog";
import { DataTableFrame } from "@/components/ds/data-table-frame";
import { ErrorState } from "@/components/ds/admin-primitives";
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Can } from "@/core/auth/components/can";
import { deletePage } from "@/features/pages/api/pages-api";
import { pagesKeys, pagesListQueryOptions } from "@/features/pages/api/pages-queries";
import { PAGES_PERMISSIONS } from "@/features/pages/permissions";

const statusLabel: Record<CustomPageDto["status"], string> = {
  draft: "Rascunho",
  published: "Publicado",
  archived: "Arquivado",
};

const statusTone: Record<CustomPageDto["status"], "muted" | "success" | "warning"> = {
  draft: "warning",
  published: "success",
  archived: "muted",
};

const statusFilterLabel: Record<"all" | CustomPageDto["status"], string> = {
  all: "Todos os status",
  ...statusLabel,
};

type PagesTableProps = {
  onEdit: (page: CustomPageDto) => void;
};

export function PagesTable({ onEdit }: PagesTableProps) {
  const queryClient = useQueryClient();
  const pagesQuery = useQuery(pagesListQueryOptions());
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | CustomPageDto["status"]>("all");
  const [pendingDelete, setPendingDelete] = useState<CustomPageDto | null>(null);

  const deleteMutation = useMutation({
    mutationFn: deletePage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pagesKeys.list() });
      setPendingDelete(null);
    },
  });

  const columns = useMemo<ColumnDef<CustomPageDto, unknown>[]>(
    () => [
      { accessorKey: "title", header: "Título" },
      { accessorKey: "slug", header: "Slug" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <Badge tone={statusTone[row.original.status]}>{statusLabel[row.original.status]}</Badge>,
      },
      {
        id: "publicUrl",
        header: "Pública",
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
        header: "Ações",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Can can={[PAGES_PERMISSIONS.update]}>
              <Button type="button" variant="ghost" onClick={() => onEdit(row.original)}>
                Editar
              </Button>
            </Can>
            <Can can={[PAGES_PERMISSIONS.delete]}>
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

  const filteredPages = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return (pagesQuery.data ?? []).filter((item) => {
      const matchesStatus = status === "all" || item.status === status;
      const matchesSearch =
        !normalizedSearch || [item.title, item.slug, item.excerpt].some((value) => value.toLowerCase().includes(normalizedSearch));

      return matchesStatus && matchesSearch;
    });
  }, [pagesQuery.data, search, status]);

  if (pagesQuery.isError) {
    return (
      <ErrorState
        title="Não foi possível carregar páginas"
        description="A listagem não respondeu. Verifique a API e tente novamente."
      />
    );
  }

  const isEmpty = !pagesQuery.isLoading && filteredPages.length === 0;

  return (
    <>
      <DataTableFrame
        title="Páginas cadastradas"
        description="Busque, filtre e ordene as páginas públicas customizadas."
        search={search}
        searchPlaceholder="Buscar por título, slug ou resumo..."
        onSearchChange={setSearch}
        empty={isEmpty}
        emptyTitle={search || status !== "all" ? "Nenhuma página encontrada" : "Nenhuma página cadastrada"}
        emptyDescription={
          search || status !== "all"
            ? "Ajuste os filtros para ampliar a busca."
            : "Crie a primeira página pelo botão \"Nova página\"."
        }
        filters={
          <Select value={status} onValueChange={(next) => setStatus(next as typeof status)}>
            <SelectTrigger className="w-auto min-w-40">
              <SelectValue>{() => statusFilterLabel[status]}</SelectValue>
            </SelectTrigger>
            <SelectPopup>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="draft">Rascunho</SelectItem>
              <SelectItem value="published">Publicado</SelectItem>
              <SelectItem value="archived">Arquivado</SelectItem>
            </SelectPopup>
          </Select>
        }
      >
        <DataTable
          data={filteredPages}
          columns={columns}
          emptyLabel="Nenhuma página cadastrada."
          isLoading={pagesQuery.isLoading}
        />
      </DataTableFrame>
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Excluir página"
        description={`Esta ação remove "${pendingDelete?.title}" definitivamente. Se estiver publicada, a rota pública deixa de existir.`}
        loading={deleteMutation.isPending}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      />
    </>
  );
}
