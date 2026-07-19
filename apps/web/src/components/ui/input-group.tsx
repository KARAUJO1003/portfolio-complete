import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Adaptado do particle `p-input-group-2` do Coss (`@coss/input-group`):
 * `InputGroup` (container com borda unica) + `InputGroupAddon` (icone/texto
 * fixo) + `InputGroupInput` (input sem borda propria, ocupa o resto).
 * Mesma densidade/tokens de `components/ui/input.tsx` (h-7, bg-input/20).
 */
export function InputGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex h-7 w-full items-center gap-1.5 rounded-md border border-border bg-input/20 px-2 transition-colors",
        "focus-within:border-foreground focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
        "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function InputGroupAddon({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("flex shrink-0 items-center text-muted-foreground [&_svg]:size-3.5", className)}
      {...props}
    />
  );
}

export type InputGroupInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function InputGroupInput({ className, ...props }: InputGroupInputProps) {
  return (
    <input
      className={cn(
        "h-full min-w-0 flex-1 bg-transparent text-sm outline-none",
        "placeholder:text-muted-foreground disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  );
}

export function InputGroupText({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("shrink-0 whitespace-nowrap text-xs text-muted-foreground", className)} {...props} />;
}
