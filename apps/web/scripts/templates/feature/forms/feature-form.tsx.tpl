"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, FormLabel } from "@/components/ds/form-field";
import { {{CAMEL}}Defaults, {{CAMEL}}Schema, type {{PASCAL}}FormValues } from "../schemas/{{FEATURE}}-schema";
import type { {{PASCAL}}Dto } from "../types/{{FEATURE}}";
export function {{PASCAL}}Form({ item, pending, onSubmit }: { item?: {{PASCAL}}Dto | null; pending?: boolean; onSubmit: (values: {{PASCAL}}FormValues) => Promise<void> }) {
  const form=useForm<{{PASCAL}}FormValues>({resolver:zodResolver({{CAMEL}}Schema),values:item ? { ...{{CAMEL}}Defaults, ...item } : {{CAMEL}}Defaults});
  return <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
{{FORM_FIELDS}}
    <Button disabled={pending} type="submit">{pending ? "Salvando..." : "Salvar"}</Button>
  </form>;
}
