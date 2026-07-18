"use client";

import type { ProjectDto } from "@portfolio/contracts";
import { HeartIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { AsyncImageFrame } from "@/components/ds/async-image-frame";
import { Badge } from "@/components/ds/badge";
import { Button } from "@/components/ui/button";
import { Can } from "@/core/auth/components/can";
import { resolveFileUrl } from "@/core/files/file-url";
import { PROJECTS_PERMISSIONS } from "@/features/projects/permissions";

const statusLabel: Record<ProjectDto["status"], string> = {
  draft: "Rascunho",
  published: "Publicado",
  archived: "Arquivado",
};

const statusTone: Record<ProjectDto["status"], "muted" | "success" | "warning"> = {
  draft: "warning",
  published: "success",
  archived: "muted",
};

type ProjectCardProps = {
  onDelete: (project: ProjectDto) => void;
  onEdit: (project: ProjectDto) => void;
  project: ProjectDto;
};

export function ProjectCard({ onDelete, onEdit, project }: ProjectCardProps) {
  const coverUrl = resolveFileUrl(project.coverPath);

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
      <AsyncImageFrame
        alt={project.title}
        className="aspect-[16/10] bg-surface-muted"
        fallback={
          <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
            Sem capa
          </div>
        }
        overlay={
          <Badge className="absolute left-2 top-2" dot tone={statusTone[project.status]}>
            {statusLabel[project.status]}
          </Badge>
        }
        src={coverUrl}
      />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-sm font-semibold">{project.title}</h3>
          <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-muted-foreground">
            {project.summary || "Sem resumo cadastrado."}
          </p>
        </div>
        {project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((tech) => (
              <Badge key={tech} tone="muted">
                {tech}
              </Badge>
            ))}
          </div>
        )}
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3">
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <HeartIcon className="size-3" />
            <span className="font-mono">{project.likesCount ?? 0}</span>
          </span>
          <div className="flex items-center gap-1">
            <Can can={[PROJECTS_PERMISSIONS.update]}>
              <Button
                aria-label="Editar projeto"
                className="h-7 px-2"
                type="button"
                variant="ghost"
                onClick={() => onEdit(project)}
              >
                <PencilIcon className="size-3.5" />
              </Button>
            </Can>
            <Can can={[PROJECTS_PERMISSIONS.delete]}>
              <Button
                aria-label="Excluir projeto"
                className="h-7 px-2"
                type="button"
                variant="ghost"
                onClick={() => onDelete(project)}
              >
                <Trash2Icon className="size-3.5" />
              </Button>
            </Can>
          </div>
        </div>
      </div>
    </div>
  );
}
