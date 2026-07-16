"use client";

import type { ProjectDto } from "@portfolio/contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/datatable/data-table";
import { Badge } from "@/components/ds/badge";
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

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectsKeys.list() }),
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
                onClick={() => deleteMutation.mutate(row.original.id)}
              >
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
      data={projectsQuery.data ?? []}
      columns={columns}
      emptyLabel={projectsQuery.isLoading ? "Carregando projetos..." : "Nenhum projeto cadastrado."}
    />
  );
}
