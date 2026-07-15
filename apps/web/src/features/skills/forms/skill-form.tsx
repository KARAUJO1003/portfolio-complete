"use client";

import type { SkillDto } from "@portfolio/contracts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormError, FormField, FormLabel } from "@/components/ds/form-field";
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
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <TextField label="Titulo" name="title" form={form} />
        <TextField label="Categoria" name="category" form={form} />
        <TextField label="Data de inicio" name="startedAt" form={form} />
        <TextField label="Icone" name="icon" form={form} />
        <TextField label="Ordem" name="order" form={form} type="number" />
      </div>

      <FormField>
        <FormLabel htmlFor="description">Descricao</FormLabel>
        <Textarea id="description" {...form.register("description")} />
      </FormField>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...form.register("showOnPortfolio")} />
          Exibir no portfolio
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...form.register("showOnResume")} />
          Exibir no curriculo
        </label>
      </div>

      {mutation.isError && <FormError>Erro ao salvar habilidade.</FormError>}

      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Salvando..." : skill ? "Salvar alteracoes" : "Criar habilidade"}
      </Button>
    </form>
  );
}

type TextFieldProps = {
  label: string;
  name: keyof SkillFormValues;
  form: ReturnType<typeof useForm<SkillFormValues>>;
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
