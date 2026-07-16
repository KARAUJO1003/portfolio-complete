"use client";

import type { CustomSectionDto } from "@portfolio/contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ds/badge";
import { FormDescription, FormField, FormLabel } from "@/components/ds/form-field";
import { PageDescription, PageHeader, PageTitle } from "@/components/ds/page";
import { Section, SectionHeader, SectionTitle } from "@/components/ds/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createCustomSection, deleteCustomSection, listCustomSections, updateCustomSection } from "@/features/custom-sections/api/custom-sections-api";

type CustomSectionFormState = {
  title: string;
  key: string;
  content: string;
  contentFormat: CustomSectionDto["contentFormat"];
  order: number;
  status: CustomSectionDto["status"];
  portfolio: boolean;
  resume: boolean;
};

const empty: CustomSectionFormState = {
  title: "",
  key: "",
  content: "",
  contentFormat: "html",
  order: 0,
  status: "draft",
  portfolio: true,
  resume: false,
};

export function CustomSectionsFeature() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["custom-sections"], queryFn: listCustomSections });
  const [editing, setEditing] = useState<CustomSectionDto | null>(null);
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (!editing) { setForm(empty); return; }
    setForm({ title: editing.title, key: editing.key, content: editing.content, contentFormat: editing.contentFormat ?? "html", order: editing.order, status: editing.status, portfolio: editing.visibility.portfolio, resume: editing.visibility.resume });
  }, [editing]);

  const save = useMutation({
    mutationFn: () => {
      const input = { title: form.title, key: form.key, content: form.content, contentFormat: form.contentFormat, order: Number(form.order), status: form.status, visibility: { portfolio: form.portfolio, resume: form.resume } };
      return editing ? updateCustomSection(editing.id, input) : createCustomSection(input);
    },
    onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ["custom-sections"] }); setEditing(null); setForm(empty); toast.success("Secao salva."); },
    onError: () => toast.error("Nao foi possivel salvar a secao."),
  });

  const remove = useMutation({
    mutationFn: deleteCustomSection,
    onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ["custom-sections"] }); toast.success("Secao removida."); },
    onError: () => toast.error("Nao foi possivel remover a secao."),
  });

  return <>
    <PageHeader><PageTitle>Secoes customizadas</PageTitle><PageDescription>Crie blocos livres reutilizaveis no portfolio e em versoes do curriculo.</PageDescription></PageHeader>
    <Card><CardHeader><CardTitle>{editing ? "Editar secao" : "Nova secao"}</CardTitle></CardHeader><CardContent>
      <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); save.mutate(); }}>
        <div className="grid gap-4 md:grid-cols-3">
          <FormField><FormLabel htmlFor="section-title">Titulo</FormLabel><Input id="section-title" required value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} /></FormField>
          <FormField><FormLabel htmlFor="section-key">Chave</FormLabel><Input id="section-key" required value={form.key} onChange={(event) => setForm((current) => ({ ...current, key: event.target.value }))} /></FormField>
          <FormField><FormLabel htmlFor="section-order">Ordem</FormLabel><Input id="section-order" type="number" value={form.order} onChange={(event) => setForm((current) => ({ ...current, order: Number(event.target.value) }))} /></FormField>
        </div>
        <FormField><FormLabel htmlFor="section-content">Conteudo</FormLabel><Textarea className="min-h-40" id="section-content" value={form.content} onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))} /><FormDescription>Markdown simples: use **texto** para negrito.</FormDescription></FormField>
        <div className="grid gap-3 md:grid-cols-4">
          <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as typeof current.status }))}><option value="draft">Rascunho</option><option value="published">Publicado</option><option value="archived">Arquivado</option></select>
          <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.contentFormat} onChange={(event) => setForm((current) => ({ ...current, contentFormat: event.target.value as typeof current.contentFormat }))}><option value="html">HTML string</option><option value="markdown">Markdown</option></select>
          <label className="flex items-center gap-2 text-sm"><input checked={form.portfolio} type="checkbox" onChange={(event) => setForm((current) => ({ ...current, portfolio: event.target.checked }))} />Portfolio</label>
          <label className="flex items-center gap-2 text-sm"><input checked={form.resume} type="checkbox" onChange={(event) => setForm((current) => ({ ...current, resume: event.target.checked }))} />Curriculo</label>
        </div>
        <div className="flex gap-2"><Button disabled={save.isPending} type="submit">{save.isPending ? "Salvando..." : "Salvar"}</Button>{editing && <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancelar</Button>}</div>
      </form>
    </CardContent></Card>
    <Section><SectionHeader><SectionTitle>Secoes cadastradas</SectionTitle></SectionHeader><div className="grid gap-3">
      {query.data?.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-card p-4"><div><div className="flex items-center gap-2"><strong>{item.title}</strong><Badge tone={item.status === "published" ? "success" : "muted"}>{item.status}</Badge></div><p className="mt-1 text-xs text-muted-foreground">{item.key} · portfolio {item.visibility.portfolio ? "sim" : "nao"} · curriculo {item.visibility.resume ? "sim" : "nao"}</p></div><div className="flex gap-2"><Button variant="outline" onClick={() => setEditing(item)}>Editar</Button><Button variant="ghost" disabled={remove.isPending} onClick={() => remove.mutate(item.id)}>Excluir</Button></div></div>)}
      {!query.isLoading && !query.data?.length && <p className="text-sm text-muted-foreground">Nenhuma secao cadastrada.</p>}
    </div></Section>
  </>;
}
