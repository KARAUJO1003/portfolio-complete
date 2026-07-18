"use client";

import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import type * as React from "react";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

/**
 * Base UI e a base de primitivos deste projeto. Ver docs/ui-primitives.md.
 * Adaptado do particle @coss/toggle-group: sem class-variance-authority nem
 * Separator (o grupo usa um unico fundo com padding, o item ativo ganha
 * bg-card - segmented control simples, ver Fase 1 de docs/admin-redesign-tasks.md).
 */
export function ToggleGroup({ className, ...props }: ToggleGroupPrimitive.Props) {
  return (
    <ToggleGroupPrimitive
      className={cn("inline-flex w-fit gap-0.5 rounded-md border border-input bg-input/20 p-0.5", className)}
      {...props}
    />
  );
}

export function ToggleGroupItem({ className, ...props }: React.ComponentProps<typeof Toggle>) {
  return <Toggle className={cn("rounded-sm", className)} {...props} />;
}
