"use client";

import type { SkillDto } from "@portfolio/contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { DsForm, FormSection } from "@/components/ds/form";
import { FormFields } from "@/components/ds/form-fields";
import { FormError } from "@/components/ds/form-field";
import { typedZodResolver } from "@/core/forms/typed-zod-resolver";
import { createSkill, updateSkill } from "@/features/skills/api/skills-api";
import { skillsKeys, skillsListQueryOptions } from "@/features/skills/api/skills-queries";
import { skillFormSchema, type SkillFormValues } from "@/features/skills/schemas/skill-form-schema";

export const SKILL_FORM_ID = "skill-form";

type SkillFormProps = {
  onDone?: () => void;
  onPendingChange?: (pending: boolean) => void;
  skill?: SkillDto | null;
};

const defaultValues: SkillFormValues = {
  title: "",
  category: "Geral",
  startedAt: "",
  description: "",
  icon: "",
  order: 0,
  showOnPortfolio: true,
  showOnResume: true,
};

export function SkillForm({ onDone, onPendingChange, skill }: SkillFormProps) {
  const queryClient = useQueryClient();
  const skillsQuery = useQuery(skillsListQueryOptions());
  const maxOrder = skillsQuery.data?.length ?? 0;
  const form = useForm<SkillFormValues>({
    resolver: typedZodResolver(skillFormSchema),
    mode: "onSubmit",
    defaultValues,
  });

  useEffect(() => {
    if (!skill) {
      form.reset(defaultValues);
      return;
    }

    form.reset({
      title: skill.title,
      category: skill.category,
      startedAt: skill.startedAt,
      description: skill.description,
      icon: skill.icon,
      order: skill.order,
      showOnPortfolio: skill.visibility.portfolio,
      showOnResume: skill.visibility.resume,
    });
  }, [skill, form]);

  const mutation = useMutation({
    mutationFn: async (values: SkillFormValues) => {
      const payload = {
        title: values.title,
        category: values.category,
        startedAt: values.startedAt,
        description: values.description,
        icon: values.icon,
        order: values.order,
        visibility: {
          portfolio: values.showOnPortfolio,
          resume: values.showOnResume,
        },
      };

      return skill ? updateSkill(skill.id, payload) : createSkill(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: skillsKeys.list() });
      form.reset(defaultValues);
      onDone?.();
    },
  });

  async function onSubmit(values: SkillFormValues) {
    await mutation.mutateAsync(values);
  }

  useEffect(() => {
    onPendingChange?.(mutation.isPending);
  }, [mutation.isPending, onPendingChange]);

  return (
    <DsForm id={SKILL_FORM_ID} onSubmit={form.handleSubmit(onSubmit)}>
      <FormSection title="Identidade" description="Nome, categoria e desde quando a habilidade é praticada.">
        <div className="grid gap-4 md:grid-cols-2">
          <FormFields.Text form={form} label="Título" name="title" />
          <FormFields.Text form={form} label="Categoria" name="category" />
          <FormFields.Text form={form} label="Data de início" name="startedAt" />
          <FormFields.Text form={form} label="Ícone" name="icon" />
        </div>
        <FormFields.HtmlEditor form={form} label="Descrição" name="description" />
      </FormSection>

      <FormSection title="Publicação e exibição" description="Controle onde esta habilidade aparece.">
        <div className="grid gap-4 md:grid-cols-2">
          <FormFields.NumberStepper form={form} label="Ordem" max={maxOrder} name="order" />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <FormFields.Switch form={form} label="Portfolio" name="showOnPortfolio" description="Disponível para versões de portfolio." />
          <FormFields.Switch form={form} label="Currículo" name="showOnResume" description="Disponível para versões de currículo." />
        </div>
      </FormSection>

      {mutation.isError && <FormError>Erro ao salvar habilidade.</FormError>}
    </DsForm>
  );
}
