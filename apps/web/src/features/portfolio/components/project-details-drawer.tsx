"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ProjectCover } from "@/features/portfolio/components/project-cover";
import { ProjectLikeButton } from "@/features/portfolio/components/project-like-button";
import type { ReactNode } from "react";

type ProjectDetails = {
  coverPath?: string;
  demoUrl?: string;
  id?: string;
  likesCount?: number;
  repoUrl?: string;
  summary: string;
  technologies: string[];
  title: string;
};

type ProjectDetailsDrawerProps = {
  children: ReactNode;
  index: number;
  project: ProjectDetails;
  triggerClassName: string;
};

export function ProjectDetailsDrawer({ children, index, project, triggerClassName }: ProjectDetailsDrawerProps) {
  const hasActions = Boolean(project.demoUrl || project.repoUrl);

  return (
    <Drawer direction="bottom">
      <DrawerTrigger asChild>
        <button aria-label={`Ver detalhes de ${project.title}`} className={triggerClassName} type="button">
          {children}
        </button>
      </DrawerTrigger>
      <DrawerContent className="mx-auto overflow-hidden border-border bg-card/95 shadow-2xl backdrop-blur-xl data-[vaul-drawer-direction=bottom]:inset-x-3 data-[vaul-drawer-direction=bottom]:bottom-3 data-[vaul-drawer-direction=bottom]:max-h-[88dvh] data-[vaul-drawer-direction=bottom]:max-w-6xl data-[vaul-drawer-direction=bottom]:rounded-3xl data-[vaul-drawer-direction=bottom]:border">
        <div className="relative flex min-h-0 flex-1 flex-col">
          <div className="relative z-10 grid min-h-0 flex-1 gap-6 overflow-y-auto p-4 sm:p-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:gap-8 lg:p-7">
            <section className="relative">
              <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-black shadow-[0_18px_56px_rgba(0,0,0,0.18)]">
                <ProjectCover
                  coverPath={project.coverPath}
                  index={index}
                  technologies={project.technologies}
                  title={project.title}
                  variant="drawer"
                />
              </div>
            </section>

            <div className="flex min-h-0 flex-col justify-between">
              <DrawerHeader className="gap-5 p-0 !text-left group-data-[vaul-drawer-direction=bottom]/drawer-content:!text-left">
                <div className="flex items-start justify-between gap-5">
                  <div className="min-w-0">
                    <span className="rounded-full border border-primary-accent/25 bg-primary-accent/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-primary-accent">
                      Projeto 0{index + 1}
                    </span>
                    <DrawerTitle className="mt-5 max-w-md !text-left text-2xl font-semibold tracking-[-0.035em] sm:text-4xl">
                      {project.title}
                    </DrawerTitle>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {project.id ? <ProjectLikeButton compact initialLikesCount={project.likesCount ?? 0} projectId={project.id} /> : null}
                    <DrawerClose className="grid size-10 place-items-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                      <CloseIcon />
                    </DrawerClose>
                  </div>
                </div>
                <DrawerDescription className="max-w-2xl !text-left text-pretty text-sm leading-7 sm:text-base sm:leading-8">
                  {project.summary}
                </DrawerDescription>
              </DrawerHeader>

              <section className="mt-7">
                <h3 className="text-sm font-semibold tracking-[-0.02em]">Tecnologias</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.technologies.length ? (
                    project.technologies.map((technology) => (
                      <span className="rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs text-muted-foreground" key={technology}>
                        {technology}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">Stack nao informada.</span>
                  )}
                </div>
              </section>

              {hasActions ? (
                <DrawerFooter className={project.demoUrl && project.repoUrl ? "mt-8 grid gap-3 p-0 sm:grid-cols-2" : "mt-8 grid gap-3 p-0"}>
                  {project.demoUrl ? (
                    <a className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-foreground px-5 text-sm font-semibold text-background transition-opacity hover:opacity-85" href={project.demoUrl} rel="noreferrer" target="_blank">
                      Abrir deploy <ExternalArrowIcon />
                    </a>
                  ) : null}
                  {project.repoUrl ? (
                    <a className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-semibold transition-colors hover:bg-background" href={project.repoUrl} rel="noreferrer" target="_blank">
                      Ver repositorio <CodeSmallIcon />
                    </a>
                  ) : null}
                </DrawerFooter>
              ) : null}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

function ExternalArrowIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
      <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function CodeSmallIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
      <path d="m8 9-4 3 4 3m8-6 4 3-4 3m-2-9-4 12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}
