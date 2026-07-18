"use client";

import { NumberField as NumberFieldPrimitive } from "@base-ui/react/number-field";
import { MinusIcon, PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Base UI e a base de primitivos deste projeto. Ver docs/ui-primitives.md.
 * Adaptado do particle @coss/number-field: sem ScrubArea (nao usado ainda) e
 * sem tamanhos sm/lg (o projeto tem uma densidade so). Decrement/Increment nao
 * tem borda lateral propria - so o `NumberFieldGroup` tem borda, sem
 * "divisorias do lado" (pedido do usuario, ver docs/admin-visual-references.md).
 */
export const NumberField = NumberFieldPrimitive.Root;

export function NumberFieldGroup({ className, ...props }: NumberFieldPrimitive.Group.Props) {
  return (
    <NumberFieldPrimitive.Group
      className={cn(
        "flex h-7 w-full items-stretch overflow-hidden rounded-md border border-input bg-input/20 transition-colors focus-within:border-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function NumberFieldDecrement({ className, ...props }: NumberFieldPrimitive.Decrement.Props) {
  return (
    <NumberFieldPrimitive.Decrement
      className={cn(
        "flex shrink-0 cursor-pointer items-center justify-center px-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <MinusIcon className="size-3.5" />
    </NumberFieldPrimitive.Decrement>
  );
}

export function NumberFieldIncrement({ className, ...props }: NumberFieldPrimitive.Increment.Props) {
  return (
    <NumberFieldPrimitive.Increment
      className={cn(
        "flex shrink-0 cursor-pointer items-center justify-center px-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <PlusIcon className="size-3.5" />
    </NumberFieldPrimitive.Increment>
  );
}

export function NumberFieldInput({ className, ...props }: NumberFieldPrimitive.Input.Props) {
  return (
    <NumberFieldPrimitive.Input
      className={cn(
        "w-full min-w-0 grow bg-transparent px-1 text-center text-sm tabular-nums outline-none",
        className,
      )}
      {...props}
    />
  );
}
