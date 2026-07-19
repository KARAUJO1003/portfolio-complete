"use client";

import type { ExperienceDto } from "@portfolio/contracts";
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
import { deleteExperience } from "@/features/experiences/api/experiences-api";
import {
  experiencesKeys,
  experiencesListQueryOptions,
} from "@/features/experiences/api/experiences-queries";
import { EXPERIENCES_PERMISSIONS } from "@/features/experiences/permissions";

const typeLabel: Record<ExperienceDto["type"], string> = {
  work: "Experiência",
  education: "Formação",
  certification: "Certificação",
  link: "Link",
};

const typeFilterLabel: Record<"all" | ExperienceDto["type"], string> = {
  all: "Todos os tipos",
  ...typeLabel,
};

type ExperiencesTableProps = {
  onEdit: (experience: ExperienceDto) => void;
};

export function ExperiencesTable({ onEdit }: ExperiencesTableProps) {
  const queryClient = useQueryClient();
  const experiencesQuery = useQuery(experiencesListQueryOptions());
  const [search, setSearch] = useState("");
  const [type, setType] = useState<"all" | ExperienceDto["type"]>("all");
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
      {
        accessorKey: "type",
        header: "Tipo",
        cell: ({ row }) => <Badge tone="muted">{typeLabel[row.original.type]}</Badge>,
      },
      { accessorKey: "title", header: "Título" },
      { accessorKey: "organization", header: "Organização" },
      { accessorKey: "startDate", header: "Início" },
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

  const filteredExperiences = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return (experiencesQuery.data ?? []).filter((item) => {
      const matchesType = type === "all" || item.type === type;
      const matchesSearch =
        !normalizedSearch ||
        [item.title, item.organization, item.description].some((value) =>
          value.toLowerCase().includes(normalizedSearch),
        );

      return matchesType && matchesSearch;
    });
  }, [experiencesQuery.data, search, type]);

  if (experiencesQuery.isError) {
    return (
      <ErrorState
        title="Não foi possível carregar a trajetória"
        description="A listagem não respondeu. Verifique a API e tente novamente."
      />
    );
  }

  const isEmpty = !experiencesQuery.isLoading && filteredExperiences.length === 0;

  return (
    <>
      <DataTableFrame
        title="Itens cadastrados"
        description="Busque, filtre e ordene experiências, formação, certificações e links."
        search={search}
        searchPlaceholder="Buscar por título, organização ou descrição..."
        onSearchChange={setSearch}
        empty={isEmpty}
        emptyTitle={search || type !== "all" ? "Nenhum item encontrado" : "Nenhum item cadastrado"}
        emptyDescription={
          search || type !== "all"
            ? "Ajuste os filtros para ampliar a busca."
            : "Crie o primeiro item pelo botão \"Novo item\"."
        }
        filters={
          <Select value={type} onValueChange={(next) => setType(next as typeof type)}>
            <SelectTrigger className="w-auto min-w-40">
              <SelectValue>{() => typeFilterLabel[type]}</SelectValue>
            </SelectTrigger>
            <SelectPopup>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="work">Experiência</SelectItem>
              <SelectItem value="education">Formação</SelectItem>
              <SelectItem value="certification">Certificação</SelectItem>
              <SelectItem value="link">Link</SelectItem>
            </SelectPopup>
          </Select>
        }
      >
        <DataTable
          data={filteredExperiences}
          columns={columns}
          emptyLabel="Nenhum item cadastrado."
          isLoading={experiencesQuery.isLoading}
        />
      </DataTableFrame>
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Excluir item"
        description={`Esta ação remove "${pendingDelete?.title}" definitivamente.`}
        loading={deleteMutation.isPending}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      />
    </>
  );
}
