"use client";

import type { CustomSectionDto } from "@portfolio/contracts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { DsForm, FormActions, FormSection } from "@/components/ds/form";
import { FormFields } from "@/components/ds/form-fields";
import { FormError } from "@/components/ds/form-field";
import { typedZodResolver } from "@/core/forms/typed-zod-resolver";
import { createCustomSection, updateCustomSection } from "@/features/custom-sections/api/custom-sections-api";
import { customSectionsKeys } from "@/features/custom-sections/api/custom-sections-queries";
import {
  customSectionFormSchema,
  type CustomSectionFormValues,
} from "@/features/custom-sections/schemas/custom-section-form-schema";

type CustomSectionFormProps = {
  section?: CustomSectionDto | null;
  onDone?: () => void;
};

const defaultValues: CustomSectionFormValues = {
  title: "",
  key: "",
  content: "",
  contentFormat: "html",
  order: 0,
  status: "draft",
  showOnPortfolio: true,
  showOnResume: false,
};

export function CustomSectionForm({ section, onDone }: CustomSectionFormProps) {
  const queryClient = useQueryClient();
  const form = useForm<CustomSectionFormValues>({
    resolver: typedZodResolver(customSectionFormSchema),
    mode: "onSubmit",
    defaultValues,
  });

  useEffect(() => {
    if (!section) {
      form.reset(defaultValues);
      return;
    }

    form.reset({
      title: section.title,
      key: section.key,
      content: section.content,
      contentFormat: section.contentFormat ?? "html",
      order: section.order,
      status: section.status,
      showOnPortfolio: section.visibility.portfolio,
      showOnResume: section.visibility.resume,
    });
  }, [section, form]);

  const mutation = useMutation({
    mutationFn: async (values: CustomSectionFormValues) => {
      const payload = {
        title: values.title,
        key: values.key,
        content: values.content,
        contentFormat: values.contentFormat,
        order: values.order,
        status: values.status,
        visibility: { portfolio: values.showOnPortfolio, resume: values.showOnResume },
      };

      return section ? updateCustomSection(section.id, payload) : createCustomSection(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: customSectionsKeys.list() });
      form.reset(defaultValues);
      onDone?.();
    },
  });

  async function onSubmit(values: CustomSectionFormValues) {
    await mutation.mutateAsync(values);
  }

  return (
    <DsForm onSubmit={form.handleSubmit(onSubmit)}>
      <FormSection title="Identidade" description="Titulo, chave unica e ordem de exibicao.">
        <div className="grid gap-4 md:grid-cols-3">
          <FormFields.Text form={form} label="Titulo" name="title" />
          <FormFields.Text form={form} label="Chave" name="key" />
          <FormFields.NumberStepper form={form} label="Ordem" name="order" />
        </div>
      </FormSection>

      <FormSection title="Conteudo" description="Editor rico: o conteudo e salvo como HTML.">
        <FormFields.HtmlEditor form={form} label="Conteudo" name="content" />
        <FormFields.Select
          form={form}
          label="Formato do conteudo"
          name="contentFormat"
          options={[
            { label: "HTML string", value: "html" },
            { label: "Markdown", value: "markdown" },
          ]}
        />
      </FormSection>

      <FormSection title="Publicacao e exibicao" description="Status e onde esta secao aparece.">
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
        <div className="grid gap-3 md:grid-cols-2">
          <FormFields.Switch form={form} label="Portfolio" name="showOnPortfolio" description="Disponivel para versoes de portfolio." />
          <FormFields.Switch form={form} label="Curriculo" name="showOnResume" description="Disponivel para versoes de curriculo." />
        </div>
      </FormSection>

      {mutation.isError && <FormError>Erro ao salvar secao.</FormError>}

      <FormActions>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Salvando..." : section ? "Salvar alteracoes" : "Criar secao"}
        </Button>
        {section && (
          <Button type="button" variant="ghost" onClick={onDone}>
            Cancelar edicao
          </Button>
        )}
      </FormActions>
    </DsForm>
  );
}
