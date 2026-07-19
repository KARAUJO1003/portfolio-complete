"use client";

import type { CustomSectionDto } from "@portfolio/contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ds/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/datatable/data-table";
import { ConfirmDialog } from "@/components/ds/confirm-dialog";
import { DataTableFrame } from "@/components/ds/data-table-frame";
import { ErrorState } from "@/components/ds/admin-primitives";
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Can } from "@/core/auth/components/can";
import { deleteCustomSection } from "@/features/custom-sections/api/custom-sections-api";
import {
  customSectionsKeys,
  customSectionsListQueryOptions,
} from "@/features/custom-sections/api/custom-sections-queries";
import { CUSTOM_SECTIONS_PERMISSIONS } from "@/features/custom-sections/permissions";

const statusLabel: Record<CustomSectionDto["status"], string> = {
  draft: "Rascunho",
  published: "Publicado",
  archived: "Arquivado",
};

const statusTone: Record<CustomSectionDto["status"], "muted" | "success" | "warning"> = {
  draft: "warning",
  published: "success",
  archived: "muted",
};

const statusFilterLabel: Record<"all" | CustomSectionDto["status"], string> = {
  all: "Todos os status",
  ...statusLabel,
};

type CustomSectionsTableProps = {
  onEdit: (section: CustomSectionDto) => void;
};

export function CustomSectionsTable({ onEdit }: CustomSectionsTableProps) {
  const queryClient = useQueryClient();
  const query = useQuery(customSectionsListQueryOptions());
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | CustomSectionDto["status"]>("all");
  const [pendingDelete, setPendingDelete] = useState<CustomSectionDto | null>(null);

  const deleteMutation = useMutation({
    mutationFn: deleteCustomSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customSectionsKeys.list() });
      setPendingDelete(null);
    },
  });

  const columns = useMemo<ColumnDef<CustomSectionDto, unknown>[]>(
    () => [
      { accessorKey: "title", header: "Título" },
      { accessorKey: "key", header: "Chave" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <Badge tone={statusTone[row.original.status]}>{statusLabel[row.original.status]}</Badge>,
      },
      {
        id: "visibility",
        header: "Visibilidade",
        cell: ({ row }) => {
          const visibility = row.original.visibility;
          return (
            <div className="flex flex-wrap gap-2">
              {visibility.portfolio && <Badge>Portfolio</Badge>}
              {visibility.resume && <Badge>Currículo</Badge>}
              {!visibility.portfolio && !visibility.resume && <Badge tone="muted">Oculto</Badge>}
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Ações",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Can can={[CUSTOM_SECTIONS_PERMISSIONS.update]}>
              <Button type="button" variant="ghost" onClick={() => onEdit(row.original)}>
                Editar
              </Button>
            </Can>
            <Can can={[CUSTOM_SECTIONS_PERMISSIONS.delete]}>
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

  const filteredSections = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return (query.data ?? []).filter((item) => {
      const matchesStatus = status === "all" || item.status === status;
      const matchesSearch = !normalizedSearch || [item.title, item.key].some((value) => value.toLowerCase().includes(normalizedSearch));

      return matchesStatus && matchesSearch;
    });
  }, [query.data, search, status]);

  if (query.isError) {
    return (
      <ErrorState
        title="Não foi possível carregar as seções"
        description="A listagem não respondeu. Verifique a API e tente novamente."
      />
    );
  }

  const isEmpty = !query.isLoading && filteredSections.length === 0;

  return (
    <>
      <DataTableFrame
        title="Seções cadastradas"
        description="Busque, filtre e ordene os blocos livres do portfolio e do currículo."
        search={search}
        searchPlaceholder="Buscar por título ou chave..."
        onSearchChange={setSearch}
        empty={isEmpty}
        emptyTitle={search || status !== "all" ? "Nenhuma seção encontrada" : "Nenhuma seção cadastrada"}
        emptyDescription={
          search || status !== "all"
            ? "Ajuste os filtros para ampliar a busca."
            : "Crie a primeira seção pelo botão \"Nova seção\"."
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
          data={filteredSections}
          columns={columns}
          emptyLabel="Nenhuma seção cadastrada."
          isLoading={query.isLoading}
        />
      </DataTableFrame>
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Excluir seção"
        description={`Esta ação remove "${pendingDelete?.title}" definitivamente.`}
        loading={deleteMutation.isPending}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      />
    </>
  );
}
