"use client";

import type { CustomPageDto } from "@portfolio/contracts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormError, FormField, FormLabel } from "@/components/ds/form-field";
import { typedZodResolver } from "@/core/forms/typed-zod-resolver";
import { createPage, updatePage } from "@/features/pages/api/pages-api";
import { pagesKeys } from "@/features/pages/api/pages-queries";
import { pageFormSchema, type PageFormValues } from "@/features/pages/schemas/page-form-schema";

type PageFormProps = {
  page?: CustomPageDto | null;
  onDone?: () => void;
};

const defaultValues: PageFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  status: "draft",
  order: 0,
  showInNavigation: false,
};

export function PageForm({ page, onDone }: PageFormProps) {
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

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <TextField label="Titulo" name="title" form={form} />
        <TextField label="Slug" name="slug" form={form} />
        <TextField label="Resumo" name="excerpt" form={form} />
        <TextField label="Ordem" name="order" form={form} type="number" />
      </div>

      <FormField>
        <FormLabel htmlFor="content">Conteudo</FormLabel>
        <Textarea id="content" className="min-h-56" {...form.register("content")} />
      </FormField>

      <FormField>
        <FormLabel htmlFor="status">Status</FormLabel>
        <select id="status" className="h-10 rounded-md border border-border bg-background px-3 text-sm" {...form.register("status")}>
          <option value="draft">Rascunho</option>
          <option value="published">Publicado</option>
          <option value="archived">Arquivado</option>
        </select>
      </FormField>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...form.register("showInNavigation")} />
        Exibir na navegacao publica
      </label>

      {mutation.isError && <FormError>Erro ao salvar pagina.</FormError>}

      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Salvando..." : page ? "Salvar alteracoes" : "Criar pagina"}
      </Button>
    </form>
  );
}

type TextFieldProps = {
  label: string;
  name: keyof PageFormValues;
  form: ReturnType<typeof useForm<PageFormValues>>;
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
