"use client";

import type { CustomSectionDto } from "@portfolio/contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { DsForm, FormSection } from "@/components/ds/form";
import { FormFields } from "@/components/ds/form-fields";
import { FormError } from "@/components/ds/form-field";
import { typedZodResolver } from "@/core/forms/typed-zod-resolver";
import { createCustomSection, updateCustomSection } from "@/features/custom-sections/api/custom-sections-api";
import { customSectionsKeys, customSectionsListQueryOptions } from "@/features/custom-sections/api/custom-sections-queries";
import {
  customSectionFormSchema,
  type CustomSectionFormValues,
} from "@/features/custom-sections/schemas/custom-section-form-schema";

export const CUSTOM_SECTION_FORM_ID = "custom-section-form";

type CustomSectionFormProps = {
  onDone?: () => void;
  onPendingChange?: (pending: boolean) => void;
  section?: CustomSectionDto | null;
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

export function CustomSectionForm({ onDone, onPendingChange, section }: CustomSectionFormProps) {
  const customSectionsQuery = useQuery(customSectionsListQueryOptions());
  const maxOrder = customSectionsQuery.data?.length ?? 0;
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

  useEffect(() => {
    onPendingChange?.(mutation.isPending);
  }, [mutation.isPending, onPendingChange]);

  return (
    <DsForm id={CUSTOM_SECTION_FORM_ID} onSubmit={form.handleSubmit(onSubmit)}>
      <FormSection title="Identidade" description="Título, chave única e ordem de exibição.">
        <div className="grid gap-4 md:grid-cols-3">
          <FormFields.Text form={form} label="Título" name="title" />
          <FormFields.Text form={form} label="Chave" name="key" />
          <FormFields.NumberStepper form={form} label="Ordem" max={maxOrder} name="order" />
        </div>
      </FormSection>

      <FormSection title="Conteúdo" description="Editor rico: o conteúdo é salvo como HTML.">
        <FormFields.HtmlEditor form={form} label="Conteúdo" name="content" />
        <FormFields.Select
          form={form}
          label="Formato do conteúdo"
          name="contentFormat"
          options={[
            { label: "HTML string", value: "html" },
            { label: "Markdown", value: "markdown" },
          ]}
        />
      </FormSection>

      <FormSection title="Publicação e exibição" description="Status e onde esta seção aparece.">
        <FormFields.StatusToggle form={form} label="Status" name="status" />
        <div className="grid gap-3 md:grid-cols-2">
          <FormFields.Switch form={form} label="Portfolio" name="showOnPortfolio" description="Disponível para versões de portfolio." />
          <FormFields.Switch form={form} label="Currículo" name="showOnResume" description="Disponível para versões de currículo." />
        </div>
      </FormSection>

      {mutation.isError && <FormError>Erro ao salvar seção.</FormError>}
    </DsForm>
  );
}
