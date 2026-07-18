"use client";

import type { CustomPageDto } from "@portfolio/contracts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { DsForm, FormSection } from "@/components/ds/form";
import { FormFields } from "@/components/ds/form-fields";
import { FormError } from "@/components/ds/form-field";
import { typedZodResolver } from "@/core/forms/typed-zod-resolver";
import { createPage, updatePage } from "@/features/pages/api/pages-api";
import { pagesKeys } from "@/features/pages/api/pages-queries";
import { pageFormSchema, type PageFormValues } from "@/features/pages/schemas/page-form-schema";

export const PAGE_FORM_ID = "page-form";

type PageFormProps = {
  onDone?: () => void;
  onPendingChange?: (pending: boolean) => void;
  page?: CustomPageDto | null;
};

const defaultValues: PageFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  contentFormat: "html",
  status: "draft",
  order: 0,
  showInNavigation: false,
};

export function PageForm({ onDone, onPendingChange, page }: PageFormProps) {
  const queryClient = useQueryClient();
  const form = useForm<PageFormValues>({
    resolver: typedZodResolver(pageFormSchema),
    mode: "onSubmit",
    defaultValues,
  });

  useEffect(() => {
    if (!page) {
      form.reset(defaultValues);
      return;
    }

    form.reset({
      title: page.title,
      slug: page.slug,
      excerpt: page.excerpt,
      content: page.content,
      contentFormat: page.contentFormat ?? "html",
      status: page.status,
      order: page.order,
      showInNavigation: page.showInNavigation,
    });
  }, [page, form]);

  const mutation = useMutation({
    mutationFn: (values: PageFormValues) =>
      page ? updatePage(page.id, values) : createPage(values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: pagesKeys.list() });
      form.reset(defaultValues);
      onDone?.();
    },
  });

  async function onSubmit(values: PageFormValues) {
    await mutation.mutateAsync(values);
  }

  useEffect(() => {
    onPendingChange?.(mutation.isPending);
  }, [mutation.isPending, onPendingChange]);

  return (
    <DsForm id={PAGE_FORM_ID} onSubmit={form.handleSubmit(onSubmit)}>
      <FormSection title="Identidade" description="Titulo, slug e resumo exibidos na navegacao e listagens.">
        <div className="grid gap-4 md:grid-cols-2">
          <FormFields.Text form={form} label="Titulo" name="title" />
          <FormFields.Text form={form} label="Slug" name="slug" />
          <FormFields.Text form={form} label="Resumo" name="excerpt" />
          <FormFields.NumberStepper form={form} label="Ordem" name="order" />
        </div>
      </FormSection>

      <FormSection title="Conteudo" description="Texto da pagina e formato de persistencia.">
        <FormFields.HtmlEditor form={form} label="Conteudo" name="content" />
        <FormFields.Select
          form={form}
          label="Formato do conteudo"
          name="contentFormat"
          options={[
            { label: "HTML string", value: "html" },
            { label: "Markdown importado", value: "markdown" },
          ]}
        />
      </FormSection>

      <FormSection title="Publicacao e exibicao" description="Status da pagina e presenca na navegacao publica.">
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
        <FormFields.Switch form={form} label="Navegacao publica" name="showInNavigation" description="Exibe esta pagina no menu publico." />
      </FormSection>

      {mutation.isError && <FormError>Erro ao salvar pagina.</FormError>}
    </DsForm>
  );
}
