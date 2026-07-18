"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cn } from "@/lib/utils";

/**
 * Base UI e a base de primitivos deste projeto. Ver docs/ui-primitives.md.
 * Adaptado do particle @coss/switch: substitui o toggle feito na mao em
 * FormFields.Switch (checkbox sr-only + spans absolutos, sem role="switch",
 * fragil a layout - ver docs/admin-redesign-tasks.md Fase 1).
 */
export function Switch({ className, ...props }: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "inline-flex h-6 w-10 shrink-0 items-center rounded-full border border-transparent p-0.5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[unchecked]:bg-muted data-[checked]:bg-primary",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="block size-5 rounded-full bg-background shadow-sm transition-transform data-[checked]:translate-x-4" />
    </SwitchPrimitive.Root>
  );
}
