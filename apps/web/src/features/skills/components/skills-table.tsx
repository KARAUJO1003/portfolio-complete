"use client";

import type { SkillDto } from "@portfolio/contracts";
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
import { deleteSkill } from "@/features/skills/api/skills-api";
import { skillsKeys, skillsListQueryOptions } from "@/features/skills/api/skills-queries";
import { SKILLS_PERMISSIONS } from "@/features/skills/permissions";

type SkillsTableProps = {
  onEdit: (skill: SkillDto) => void;
};

export function SkillsTable({ onEdit }: SkillsTableProps) {
  const queryClient = useQueryClient();
  const skillsQuery = useQuery(skillsListQueryOptions());
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [pendingDelete, setPendingDelete] = useState<SkillDto | null>(null);

  const deleteMutation = useMutation({
    mutationFn: deleteSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skillsKeys.list() });
      setPendingDelete(null);
    },
  });

  const categories = useMemo(() => {
    const unique = new Set((skillsQuery.data ?? []).map((skill) => skill.category));
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [skillsQuery.data]);

  const columns = useMemo<ColumnDef<SkillDto, unknown>[]>(
    () => [
      { accessorKey: "title", header: "Título" },
      {
        accessorKey: "category",
        header: "Categoria",
        cell: ({ row }) => <Badge tone="muted">{row.original.category}</Badge>,
      },
      { accessorKey: "startedAt", header: "Início" },
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

  const filteredSkills = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return (skillsQuery.data ?? []).filter((skill) => {
      const matchesCategory = category === "all" || skill.category === category;
      const matchesSearch =
        !normalizedSearch ||
        [skill.title, skill.category, skill.description].some((value) =>
          value.toLowerCase().includes(normalizedSearch),
        );

      return matchesCategory && matchesSearch;
    });
  }, [skillsQuery.data, search, category]);

  if (skillsQuery.isError) {
    return (
      <ErrorState
        title="Não foi possível carregar habilidades"
        description="A listagem não respondeu. Verifique a API e tente novamente."
      />
    );
  }

  const isEmpty = !skillsQuery.isLoading && filteredSkills.length === 0;

  return (
    <>
      <DataTableFrame
        title="Habilidades cadastradas"
        description="Busque, filtre e ordene as habilidades que alimentam o portfolio e o currículo."
        search={search}
        searchPlaceholder="Buscar por título, categoria ou descrição..."
        onSearchChange={setSearch}
        empty={isEmpty}
        emptyTitle={search || category !== "all" ? "Nenhuma habilidade encontrada" : "Nenhuma habilidade cadastrada"}
        emptyDescription={
          search || category !== "all"
            ? "Ajuste os filtros para ampliar a busca."
            : "Crie a primeira habilidade pelo botão \"Nova habilidade\"."
        }
        filters={
          <Select value={category} onValueChange={(next) => setCategory(next ?? "all")}>
            <SelectTrigger className="w-auto min-w-40">
              <SelectValue>{() => (category === "all" ? "Todas as categorias" : category)}</SelectValue>
            </SelectTrigger>
            <SelectPopup>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectPopup>
          </Select>
        }
      >
        <DataTable
          data={filteredSkills}
          columns={columns}
          emptyLabel="Nenhuma habilidade cadastrada."
          isLoading={skillsQuery.isLoading}
        />
      </DataTableFrame>
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Excluir habilidade"
        description={`Esta ação remove "${pendingDelete?.title}" definitivamente.`}
        loading={deleteMutation.isPending}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      />
    </>
  );
}
