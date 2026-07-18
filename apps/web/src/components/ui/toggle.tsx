"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { cn } from "@/lib/utils";

/**
 * Base UI e a base de primitivos deste projeto. Ver docs/ui-primitives.md.
 * Adaptado do particle @coss/toggle: sem class-variance-authority (o projeto
 * nao usa CVA em nenhum outro lugar) e sem variantes de tamanho/estilo - uma
 * densidade so (h-7), igual Button/Input/Select.
 */
export function Toggle({ className, ...props }: TogglePrimitive.Props) {
  return (
    <TogglePrimitive
      className={cn(
        "inline-flex h-7 shrink-0 cursor-pointer items-center justify-center gap-1.5 px-2.5 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 data-[pressed]:bg-card data-[pressed]:text-foreground data-[pressed]:shadow-sm [&_svg]:size-4 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
}
