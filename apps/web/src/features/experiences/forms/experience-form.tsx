"use client";

import type { ExperienceDto } from "@portfolio/contracts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormError, FormField, FormLabel } from "@/components/ds/form-field";
import { typedZodResolver } from "@/core/forms/typed-zod-resolver";
import { createExperience, updateExperience } from "@/features/experiences/api/experiences-api";
import { experiencesKeys } from "@/features/experiences/api/experiences-queries";
import {
  experienceFormSchema,
  type ExperienceFormValues,
} from "@/features/experiences/schemas/experience-form-schema";

type ExperienceFormProps = {
  experience?: ExperienceDto | null;
  onDone?: () => void;
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

export function ExperienceForm({ experience, onDone }: ExperienceFormProps) {
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

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField>
          <FormLabel htmlFor="type">Tipo</FormLabel>
          <select id="type" className="h-10 rounded-md border border-border bg-background px-3 text-sm" {...form.register("type")}>
            <option value="work">Experiencia</option>
            <option value="education">Formacao</option>
            <option value="certification">Certificacao</option>
            <option value="link">Link</option>
          </select>
        </FormField>
        <TextField label="Titulo" name="title" form={form} />
        <TextField label="Organizacao" name="organization" form={form} />
        <TextField label="Localizacao" name="location" form={form} />
        <TextField label="Inicio" name="startDate" form={form} />
        <TextField label="Fim" name="endDate" form={form} />
        <TextField label="URL" name="url" form={form} />
        <TextField label="Ordem" name="order" form={form} type="number" />
      </div>

      <FormField>
        <FormLabel htmlFor="description">Descricao</FormLabel>
        <Textarea id="description" {...form.register("description")} />
      </FormField>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...form.register("current")} />
          Atual
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

      {mutation.isError && <FormError>Erro ao salvar item.</FormError>}

      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Salvando..." : experience ? "Salvar alteracoes" : "Criar item"}
      </Button>
    </form>
  );
}

type TextFieldProps = {
  label: string;
  name: keyof ExperienceFormValues;
  form: ReturnType<typeof useForm<ExperienceFormValues>>;
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
