"use client";

import type { ProjectDto } from "@portfolio/contracts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormError, FormField, FormLabel } from "@/components/ds/form-field";
import { typedZodResolver } from "@/core/forms/typed-zod-resolver";
import { createProject, updateProject } from "@/features/projects/api/projects-api";
import { projectsKeys } from "@/features/projects/api/projects-queries";
import { projectFormSchema, type ProjectFormValues } from "@/features/projects/schemas/project-form-schema";
import { FileUploadField } from "@/features/uploads/components/file-upload-field";

type ProjectFormProps = {
  project?: ProjectDto | null;
  onDone?: () => void;
};

const defaultValues: ProjectFormValues = {
  title: "",
  slug: "",
  summary: "",
  description: "",
  coverPath: "",
  demoUrl: "",
  repoUrl: "",
  technologiesText: "",
  featured: false,
  order: 0,
  status: "draft",
  showOnPortfolio: true,
  showOnResume: false,
};

export function ProjectForm({ project, onDone }: ProjectFormProps) {
  const queryClient = useQueryClient();
  const form = useForm<ProjectFormValues>({
    resolver: typedZodResolver(projectFormSchema),
    mode: "onSubmit",
    defaultValues,
  });

  useEffect(() => {
    if (!project) {
      form.reset(defaultValues);
      return;
    }

    form.reset({
      title: project.title,
      slug: project.slug,
      summary: project.summary,
      description: project.description,
      coverPath: project.coverPath,
      demoUrl: project.demoUrl,
      repoUrl: project.repoUrl,
      technologiesText: project.technologies.join(", "),
      featured: project.featured,
      order: project.order,
      status: project.status,
      showOnPortfolio: project.visibility.portfolio,
      showOnResume: project.visibility.resume,
    });
  }, [project, form]);

  const mutation = useMutation({
    mutationFn: async (values: ProjectFormValues) => {
      const payload = {
        title: values.title,
        slug: values.slug,
        summary: values.summary,
        description: values.description,
        coverPath: values.coverPath,
        demoUrl: values.demoUrl,
        repoUrl: values.repoUrl,
        technologies: values.technologiesText
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        featured: values.featured,
        order: values.order,
        status: values.status,
        visibility: {
          portfolio: values.showOnPortfolio,
          resume: values.showOnResume,
        },
      };

      return project ? updateProject(project.id, payload) : createProject(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: projectsKeys.list() });
      form.reset(defaultValues);
      onDone?.();
    },
  });

  async function onSubmit(values: ProjectFormValues) {
    await mutation.mutateAsync(values);
  }

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <TextField label="Titulo" name="title" form={form} />
        <TextField label="Slug" name="slug" form={form} />
        <FormField>
          <FormLabel htmlFor="coverPath">Capa path</FormLabel>
          <div className="flex gap-2">
            <Input className="flex-1" id="coverPath" {...form.register("coverPath")} />
            <FileUploadField folder="projects" onUploaded={(path) => form.setValue("coverPath", path, { shouldDirty: true })} />
          </div>
        </FormField>
        <TextField label="Demo URL" name="demoUrl" form={form} />
        <TextField label="Repo URL" name="repoUrl" form={form} />
        <TextField label="Tecnologias" name="technologiesText" form={form} />
        <TextField label="Ordem" name="order" form={form} type="number" />
      </div>

      <FormField>
        <FormLabel htmlFor="summary">Resumo curto</FormLabel>
        <Textarea id="summary" {...form.register("summary")} />
      </FormField>

      <FormField>
        <FormLabel htmlFor="description">Descricao longa</FormLabel>
        <Textarea id="description" {...form.register("description")} />
      </FormField>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...form.register("featured")} />
          Destaque
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...form.register("showOnPortfolio")} />
          Exibir no portfolio
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...form.register("showOnResume")} />
          Exibir no curriculo
        </label>
      </div>

      <FormField>
        <FormLabel htmlFor="status">Status</FormLabel>
        <select id="status" className="h-10 rounded-md border border-border bg-background px-3 text-sm" {...form.register("status")}>
          <option value="draft">Rascunho</option>
          <option value="published">Publicado</option>
          <option value="archived">Arquivado</option>
        </select>
      </FormField>

      {mutation.isError && <FormError>Erro ao salvar projeto.</FormError>}

      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Salvando..." : project ? "Salvar alteracoes" : "Criar projeto"}
      </Button>
    </form>
  );
}

type TextFieldProps = {
  label: string;
  name: keyof ProjectFormValues;
  form: ReturnType<typeof useForm<ProjectFormValues>>;
  type?: string;
};

function TextField({ label, name, form, type = "text" }: TextFieldProps) {
  const error = form.formState.errors[name]?.message;

  return (
    <FormField>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Input id={name} type={type} {...form.register(name)} />
      {error && <FormError>{String(error)}</FormError>}
    </FormField>
  );
}
