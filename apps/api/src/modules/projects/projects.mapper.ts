import type { ProjectDto } from "@portfolio/contracts";
import type { ProjectDocument } from "./projects.model";

export function toProjectDto(project: ProjectDocument): ProjectDto {
  return {
    id: String(project._id),
    ownerId: project.ownerId,
    title: project.title,
    slug: project.slug,
    summary: project.summary,
    description: project.description,
    coverPath: project.coverPath,
    demoUrl: project.demoUrl,
    repoUrl: project.repoUrl,
    technologies: project.technologies ?? [],
    featured: Boolean(project.featured),
    order: project.order,
    status: project.status,
    visibility: project.visibility ?? { portfolio: true, resume: false },
    likesCount: project.likesCount ?? 0,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  };
}
