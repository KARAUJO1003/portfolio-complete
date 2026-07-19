"use client";

import type { ProjectDto } from "@portfolio/contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { DataTable } from "@/components/datatable/data-table";
import { Badge } from "@/components/ds/badge";
import { MiniBar } from "@/components/ds/chart";
import { ConfirmDialog } from "@/components/ds/confirm-dialog";
import { DataTableFrame } from "@/components/ds/data-table-frame";
import { EmptyState, ErrorState, Toolbar } from "@/components/ds/admin-primitives";
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Can } from "@/core/auth/components/can";
import { resolveFileUrl } from "@/core/files/file-url";
import { deleteProject } from "@/features/projects/api/projects-api";
import { projectsKeys, projectsListQueryOptions } from "@/features/projects/api/projects-queries";
import { PROJECTS_PERMISSIONS } from "@/features/projects/permissions";
import { ProjectCard } from "@/features/projects/components/project-card";
import Image from "next/image";

type ProjectsTableProps = {
  onEdit: (project: ProjectDto) => void;
  view: "grid" | "table";
};

export function ProjectsTable({ onEdit, view }: ProjectsTableProps) {
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

  const maxLikes = useMemo(
    () => Math.max(0, ...(projectsQuery.data ?? []).map((project) => project.likesCount ?? 0)),
    [projectsQuery.data],
  );

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
              {visibility.resume && <Badge>Currículo</Badge>}
              {!visibility.portfolio && !visibility.resume && <Badge tone="muted">Oculto</Badge>}
            </div>
          );
        },
      },
      {
        accessorKey: "likesCount",
        header: "Curtidas",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Badge tone="muted">{row.original.likesCount ?? 0}</Badge>
            {maxLikes > 0 ? <MiniBar max={maxLikes} value={row.original.likesCount ?? 0} /> : null}
          </div>
        ),
      },
      {
        id: "actions",
        header: "Ações",
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
    [onEdit, maxLikes],
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
        title="Não foi possível carregar projetos"
        description="A listagem não respondeu. Verifique a API e tente novamente."
      />
    );
  }

  const isEmpty = !projectsQuery.isLoading && filteredProjects.length === 0;
  const emptyTitle = search || status !== "all" ? "Nenhum projeto encontrado" : "Nenhum projeto cadastrado";
  const emptyDescription =
    search || status !== "all"
      ? "Ajuste os filtros para ampliar a busca."
      : "Crie o primeiro projeto pelo botão \"Novo projeto\".";

  const statusFilterLabel: Record<typeof status, string> = {
    all: "Todos os status",
    draft: "Rascunho",
    published: "Publicado",
    archived: "Arquivado",
  };

  const statusFilter = (
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
  );

  return (
    <>
    {view === "grid" ? (
      <div className="grid gap-4">
        <Toolbar>
          <InputGroup className="min-w-64 max-w-sm">
            <InputGroupAddon>
              <SearchIcon className="size-3.5" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Buscar por título, slug ou tecnologia..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </InputGroup>
          {statusFilter}
        </Toolbar>
        {isEmpty ? (
          <EmptyState description={emptyDescription} title={emptyTitle} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                maxLikes={maxLikes}
                project={project}
                onDelete={setPendingDelete}
                onEdit={onEdit}
              />
            ))}
          </div>
        )}
      </div>
    ) : (
      <DataTableFrame
        title="Projetos cadastrados"
        description="Busque, filtre e ordene os projetos que alimentam o portfolio e o currículo."
        search={search}
        searchPlaceholder="Buscar por título, slug ou tecnologia..."
        onSearchChange={setSearch}
        empty={isEmpty}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
        filters={statusFilter}
      >
        <DataTable
          data={filteredProjects}
          columns={columns}
          emptyLabel="Nenhum projeto cadastrado."
          isLoading={projectsQuery.isLoading}
        />
      </DataTableFrame>
    )}
    <ConfirmDialog
      open={Boolean(pendingDelete)}
      title="Excluir projeto"
      description={`Esta ação remove "${pendingDelete?.title}" definitivamente. Ele deixa de aparecer no portfolio e no currículo.`}
      loading={deleteMutation.isPending}
      onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
      onOpenChange={(open) => !open && setPendingDelete(null)}
    />
    </>
  );
}
