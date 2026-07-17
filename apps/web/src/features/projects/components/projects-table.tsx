"use client";

import type { ProjectDto } from "@portfolio/contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/datatable/data-table";
import { Badge } from "@/components/ds/badge";
import { ConfirmDialog } from "@/components/ds/confirm-dialog";
import { DataTableFrame } from "@/components/ds/data-table-frame";
import { ErrorState } from "@/components/ds/admin-primitives";
import { Can } from "@/core/auth/components/can";
import { resolveFileUrl } from "@/core/files/file-url";
import { deleteProject } from "@/features/projects/api/projects-api";
import { projectsKeys, projectsListQueryOptions } from "@/features/projects/api/projects-queries";
import { PROJECTS_PERMISSIONS } from "@/features/projects/permissions";
import Image from "next/image";

type ProjectsTableProps = {
  onEdit: (project: ProjectDto) => void;
};

export function ProjectsTable({ onEdit }: ProjectsTableProps) {
  const queryClient = useQueryClient();
  const projectsQuery = useQuery(projectsListQueryOptions());
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | ProjectDto["status"]>("all");
  const [pendingDelete, setPendingDelete] = useState<ProjectDto | null>(null);

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectsKeys.list() });
      setPendingDelete(null);
    },
  });

  const columns = useMemo<ColumnDef<ProjectDto, unknown>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Projeto",
        cell: ({ row }) => {
          const project = row.original;
          const coverUrl = resolveFileUrl(project.coverPath);

          return (
            <div className="flex min-w-64 items-center gap-3">
              <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
                {coverUrl ? (
                  <Image alt="" className="size-full object-cover" height={56} src={coverUrl} unoptimized width={56} />
                ) : (
                  <span className="text-xs text-muted-foreground">IMG</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-medium">{project.title}</p>
                <p className="mt-1 line-clamp-2 max-w-md text-xs leading-5 text-muted-foreground">
                  {project.summary || "Sem resumo cadastrado."}
                </p>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          const labelByStatus = {
            draft: "Rascunho",
            published: "Publicado",
            archived: "Arquivado",
          };

          return (
            <Badge tone={status === "published" ? "success" : "muted"}>
              {labelByStatus[status]}
            </Badge>
          );
        },
      },
      {
        id: "visibility",
        header: "Visibilidade",
        cell: ({ row }) => {
          const visibility = row.original.visibility;
          return (
            <div className="flex flex-wrap gap-2">
              {visibility.portfolio && <Badge>Portfolio</Badge>}
              {visibility.resume && <Badge>Curriculo</Badge>}
              {!visibility.portfolio && !visibility.resume && <Badge tone="muted">Oculto</Badge>}
            </div>
          );
        },
      },
      {
        accessorKey: "likesCount",
        header: "Curtidas",
        cell: ({ row }) => <Badge tone="muted">{row.original.likesCount ?? 0}</Badge>,
      },
      {
        id: "actions",
        header: "Acoes",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Can can={[PROJECTS_PERMISSIONS.update]}>
              <Button type="button" variant="ghost" onClick={() => onEdit(row.original)}>
                Editar
              </Button>
            </Can>
            <Can can={[PROJECTS_PERMISSIONS.delete]}>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setPendingDelete(row.original)}
              >
                Excluir
              </Button>
            </Can>
          </div>
        ),
      },
    ],
    [onEdit],
  );

  const filteredProjects = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return (projectsQuery.data ?? []).filter((project) => {
      const matchesStatus = status === "all" || project.status === status;
      const matchesSearch = !normalizedSearch || [
        project.title,
        project.summary,
        project.slug,
        project.technologies.join(" "),
      ].some((value) => value.toLowerCase().includes(normalizedSearch));

      return matchesStatus && matchesSearch;
    });
  }, [projectsQuery.data, search, status]);

  if (projectsQuery.isError) {
    return (
      <ErrorState
        title="Nao foi possivel carregar projetos"
        description="A listagem nao respondeu. Verifique a API e tente novamente."
      />
    );
  }

  return (
    <>
    <DataTableFrame
      title="Projetos cadastrados"
      description="Busque, filtre e ordene os projetos que alimentam o portfolio e o curriculo."
      search={search}
      searchPlaceholder="Buscar por titulo, slug ou tecnologia..."
      onSearchChange={setSearch}
      empty={!projectsQuery.isLoading && filteredProjects.length === 0}
      emptyTitle={search || status !== "all" ? "Nenhum projeto encontrado" : "Nenhum projeto cadastrado"}
      emptyDescription={
        search || status !== "all"
          ? "Ajuste os filtros para ampliar a busca."
          : "Crie o primeiro projeto no formulario acima."
      }
      filters={
        <select
          className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          value={status}
          onChange={(event) => setStatus(event.target.value as typeof status)}
        >
          <option value="all">Todos os status</option>
          <option value="draft">Rascunho</option>
          <option value="published">Publicado</option>
          <option value="archived">Arquivado</option>
        </select>
      }
    >
      <DataTable
        data={filteredProjects}
        columns={columns}
        emptyLabel="Nenhum projeto cadastrado."
        isLoading={projectsQuery.isLoading}
      />
    </DataTableFrame>
    <ConfirmDialog
      open={Boolean(pendingDelete)}
      title="Excluir projeto"
      description={`Esta acao remove "${pendingDelete?.title}" definitivamente. Ele deixa de aparecer no portfolio e no curriculo.`}
      loading={deleteMutation.isPending}
      onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
      onOpenChange={(open) => !open && setPendingDelete(null)}
    />
    </>
  );
}
