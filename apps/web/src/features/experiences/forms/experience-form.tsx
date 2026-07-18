"use client";

import type { ExperienceDto } from "@portfolio/contracts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { DsForm, FormSection } from "@/components/ds/form";
import { FormFields } from "@/components/ds/form-fields";
import { FormError } from "@/components/ds/form-field";
import { typedZodResolver } from "@/core/forms/typed-zod-resolver";
import { createExperience, updateExperience } from "@/features/experiences/api/experiences-api";
import { experiencesKeys } from "@/features/experiences/api/experiences-queries";
import {
  experienceFormSchema,
  type ExperienceFormValues,
} from "@/features/experiences/schemas/experience-form-schema";

export const EXPERIENCE_FORM_ID = "experience-form";

type ExperienceFormProps = {
  experience?: ExperienceDto | null;
  onDone?: () => void;
  onPendingChange?: (pending: boolean) => void;
};

const defaultValues: ExperienceFormValues = {
  type: "work",
  title: "",
  organization: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
  url: "",
  order: 0,
  showOnPortfolio: false,
  showOnResume: true,
};

export function ExperienceForm({ experience, onDone, onPendingChange }: ExperienceFormProps) {
  const queryClient = useQueryClient();
  const form = useForm<ExperienceFormValues>({
    resolver: typedZodResolver(experienceFormSchema),
    mode: "onSubmit",
    defaultValues,
  });

  useEffect(() => {
    if (!experience) {
      form.reset(defaultValues);
      return;
    }

    form.reset({
      type: experience.type,
      title: experience.title,
      organization: experience.organization,
      location: experience.location,
      startDate: experience.startDate,
      endDate: experience.endDate,
      current: experience.current,
      description: experience.description,
      url: experience.url,
      order: experience.order,
      showOnPortfolio: experience.visibility.portfolio,
      showOnResume: experience.visibility.resume,
    });
  }, [experience, form]);

  const mutation = useMutation({
    mutationFn: async (values: ExperienceFormValues) => {
      const payload = {
        type: values.type,
        title: values.title,
        organization: values.organization,
        location: values.location,
        startDate: values.startDate,
        endDate: values.endDate,
        current: values.current,
        description: values.description,
        url: values.url,
        order: values.order,
        visibility: {
          portfolio: values.showOnPortfolio,
          resume: values.showOnResume,
        },
      };

      return experience
        ? updateExperience(experience.id, payload)
        : createExperience(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: experiencesKeys.list() });
      form.reset(defaultValues);
      onDone?.();
    },
  });

  async function onSubmit(values: ExperienceFormValues) {
    await mutation.mutateAsync(values);
  }

  useEffect(() => {
    onPendingChange?.(mutation.isPending);
  }, [mutation.isPending, onPendingChange]);

  return (
    <DsForm id={EXPERIENCE_FORM_ID} onSubmit={form.handleSubmit(onSubmit)}>
      <FormSection title="Identidade" description="Tipo de item, titulo, organizacao e periodo.">
        <div className="grid gap-4 md:grid-cols-2">
          <FormFields.Select
            form={form}
            label="Tipo"
            name="type"
            options={[
              { label: "Experiencia", value: "work" },
              { label: "Formacao", value: "education" },
              { label: "Certificacao", value: "certification" },
              { label: "Link", value: "link" },
            ]}
          />
          <FormFields.Text form={form} label="Titulo" name="title" />
          <FormFields.Text form={form} label="Organizacao" name="organization" />
          <FormFields.Text form={form} label="Localizacao" name="location" />
          <FormFields.Text form={form} label="Inicio" name="startDate" />
          <FormFields.Text form={form} label="Fim" name="endDate" />
          <FormFields.Text form={form} label="URL" name="url" />
          <FormFields.NumberStepper form={form} label="Ordem" name="order" />
        </div>
        <FormFields.Textarea form={form} label="Descricao" name="description" rows={4} />
      </FormSection>

      <FormSection title="Publicacao e exibicao" description="Controle status atual e onde este item aparece.">
        <div className="grid gap-3 md:grid-cols-3">
          <FormFields.Switch form={form} label="Atual" name="current" />
          <FormFields.Switch form={form} label="Portfolio" name="showOnPortfolio" description="Disponivel para versoes de portfolio." />
          <FormFields.Switch form={form} label="Curriculo" name="showOnResume" description="Disponivel para versoes de curriculo." />
        </div>
      </FormSection>

      {mutation.isError && <FormError>Erro ao salvar item.</FormError>}
    </DsForm>
  );
}
