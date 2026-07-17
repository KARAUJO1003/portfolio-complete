"use client";

import type { SkillDto } from "@portfolio/contracts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { DsForm, FormActions, FormSection } from "@/components/ds/form";
import { FormFields } from "@/components/ds/form-fields";
import { FormError } from "@/components/ds/form-field";
import { typedZodResolver } from "@/core/forms/typed-zod-resolver";
import { createSkill, updateSkill } from "@/features/skills/api/skills-api";
import { skillsKeys } from "@/features/skills/api/skills-queries";
import { skillFormSchema, type SkillFormValues } from "@/features/skills/schemas/skill-form-schema";

type SkillFormProps = {
  skill?: SkillDto | null;
  onDone?: () => void;
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

export function SkillForm({ skill, onDone }: SkillFormProps) {
  const queryClient = useQueryClient();
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

  return (
    <DsForm onSubmit={form.handleSubmit(onSubmit)}>
      <FormSection title="Identidade" description="Nome, categoria e desde quando a habilidade e praticada.">
        <div className="grid gap-4 md:grid-cols-2">
          <FormFields.Text form={form} label="Titulo" name="title" />
          <FormFields.Text form={form} label="Categoria" name="category" />
          <FormFields.Text form={form} label="Data de inicio" name="startedAt" />
          <FormFields.Text form={form} label="Icone" name="icon" />
        </div>
        <FormFields.Textarea form={form} label="Descricao" name="description" rows={4} />
      </FormSection>

      <FormSection title="Publicacao e exibicao" description="Controle onde esta habilidade aparece.">
        <div className="grid gap-4 md:grid-cols-2">
          <FormFields.NumberStepper form={form} label="Ordem" name="order" />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <FormFields.Switch form={form} label="Portfolio" name="showOnPortfolio" description="Disponivel para versoes de portfolio." />
          <FormFields.Switch form={form} label="Curriculo" name="showOnResume" description="Disponivel para versoes de curriculo." />
        </div>
      </FormSection>

      {mutation.isError && <FormError>Erro ao salvar habilidade.</FormError>}

      <FormActions>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Salvando..." : skill ? "Salvar alteracoes" : "Criar habilidade"}
        </Button>
        {skill && (
          <Button type="button" variant="ghost" onClick={onDone}>
            Cancelar edicao
          </Button>
        )}
      </FormActions>
    </DsForm>
  );
}
