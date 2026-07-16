"use client";

import type { ProjectDto } from "@portfolio/contracts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { AsyncImageFrame } from "@/components/ds/async-image-frame";
import { FormFields } from "@/components/ds/form-fields";
import { DsForm, FormActions, FormAside, FormPreviewFrame, FormSection, FormStep } from "@/components/ds/form";
import { Badge } from "@/components/ds/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormDescription, FormError, FormField, FormLabel } from "@/components/ds/form-field";
import { resolveFileUrl } from "@/core/files/file-url";
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

  const preview = form.watch();
  const coverUrl = resolveFileUrl(preview.coverPath);
  const technologies = (preview.technologiesText ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 5);

  return (
    <DsForm onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex flex-wrap gap-2">
        <FormStep active index={1} label="Conteudo" />
        <FormStep active={Boolean(preview.coverPath)} index={2} label="Midia" />
        <FormStep active={preview.status === "published"} index={3} label="Publicacao" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid gap-5">
          <FormSection
            title="Identidade do projeto"
            description="Defina o nome publico, URL e resumo que aparecem nos cards do portfolio."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormFields.Text form={form} label="Titulo" name="title" />
              <FormFields.Text form={form} label="Slug" name="slug" />
            </div>
            <FormFields.Textarea
              form={form}
              label="Resumo curto"
              name="summary"
              rows={3}
              description="Use uma frase objetiva. O card publico trunca o texto e o drawer mostra detalhes."
            />
            <FormFields.RichTextField
              form={form}
              label="Descricao longa"
              name="description"
              description="Texto completo para drawer, curriculo e futuras paginas detalhadas."
            />
          </FormSection>

          <FormSection
            title="Midia e links"
            description="A imagem usa path relativo salvo no banco. O front concatena com a base publica de arquivos."
          >
            <FormField>
              <FormLabel htmlFor="coverPath">Capa do projeto</FormLabel>
              <div className="flex gap-2">
                <Input className="flex-1" id="coverPath" {...form.register("coverPath")} />
                <FileUploadField
                  folder="projects"
                  onUploaded={(path) => form.setValue("coverPath", path, { shouldDirty: true })}
                />
              </div>
              <FormDescription>Prefira imagens largas em proporcao 16:10 ou 4:3.</FormDescription>
            </FormField>
            <div className="grid gap-4 md:grid-cols-2">
              <FormFields.Text form={form} label="Demo URL" name="demoUrl" />
              <FormFields.Text form={form} label="Repo URL" name="repoUrl" />
            </div>
            <FormFields.TagInput form={form} label="Tecnologias" name="technologiesText" />
          </FormSection>

          <FormSection
            title="Publicacao e exibicao"
            description="Controle onde este projeto aparece e como ele participa das versoes publicadas."
          >
            <div className="grid gap-3 md:grid-cols-3">
              <FormFields.Switch
                form={form}
                label="Destaque"
                name="featured"
                description="Aparece entre os primeiros cards da landing."
              />
              <FormFields.Switch
                form={form}
                label="Portfolio"
                name="showOnPortfolio"
                description="Disponivel para versoes de portfolio."
              />
              <FormFields.Switch
                form={form}
                label="Curriculo"
                name="showOnResume"
                description="Disponivel para versoes de curriculo."
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <FormFields.NumberStepper form={form} label="Ordem" name="order" />
              <FormFields.Select
                form={form}
                label="Status"
                name="status"
                options={[
                  { label: "Rascunho", value: "draft" },
                  { label: "Publicado", value: "published" },
                  { label: "Arquivado", value: "archived" },
                ]}
              />
            </div>
          </FormSection>
        </div>

        <FormAside className="h-fit xl:sticky xl:top-32">
          <p className="text-xs font-semibold uppercase text-primary-accent">Preview rapido</p>
          <FormPreviewFrame className="mt-3">
            <AsyncImageFrame
              alt={preview.title || "Preview do projeto"}
              className="aspect-[16/10] bg-surface-muted"
              fallback={
                <div className="flex size-full items-center justify-center bg-surface-muted text-xs text-muted-foreground">
                  Capa nao definida
                </div>
              }
              src={coverUrl}
            />
            <div className="grid gap-3 p-4">
              <div className="flex items-center justify-between gap-3">
                <Badge tone={preview.status === "published" ? "success" : "muted"}>{preview.status}</Badge>
                <span className="text-xs text-muted-foreground">#{preview.order || 0}</span>
              </div>
              <div>
                <h3 className="line-clamp-2 text-lg font-semibold">{preview.title || "Titulo do projeto"}</h3>
                <p className="mt-2 line-clamp-4 text-sm leading-6 text-muted-foreground">
                  {preview.summary || "Resumo curto do projeto para validar o card antes de salvar."}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {(technologies.length ? technologies : ["next.js", "typescript"]).map((item) => (
                  <Badge key={item} tone="muted">{item}</Badge>
                ))}
              </div>
            </div>
          </FormPreviewFrame>
        </FormAside>
      </div>

      {mutation.isError && <FormError>Erro ao salvar projeto.</FormError>}

      <FormActions>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Salvando..." : project ? "Salvar alteracoes" : "Criar projeto"}
        </Button>
        {project && (
          <Button type="button" variant="ghost" onClick={onDone}>
            Cancelar edicao
          </Button>
        )}
        {form.formState.isDirty && (
          <span className="text-xs text-muted-foreground">Existem alteracoes ainda nao salvas.</span>
        )}
      </FormActions>
    </DsForm>
  );
}
