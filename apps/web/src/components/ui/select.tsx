"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Base UI e a base de primitivos deste projeto. Ver docs/ui-primitives.md.
 * Adaptado do particle @coss/select: sem useRender/mergeProps (mesmo criterio
 * do table.tsx), sem `items` prop (a lista de opcoes fica so nos `SelectItem`
 * filhos, API mais simples que basta para valores string do projeto), sem
 * variantes de tamanho (o projeto tem uma densidade so, h-7).
 */
export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;

export function SelectTrigger({ className, children, ...props }: SelectPrimitive.Trigger.Props) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "flex h-7 w-full items-center justify-between gap-2 rounded-md border border-input bg-input/20 px-2 text-sm outline-none transition-colors focus-visible:border-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[popup-open]:border-foreground",
        className,
      )}
      // vaul (Drawer) captura pointerdown pra decidir se inicia o gesto de
      // arrastar; sem esse atributo, um Select dentro de um Drawer nao abre
      // o popup (issue conhecida do vaul, ver node_modules/vaul shouldDrag).
      data-vaul-no-drag=""
      {...props}
    >
      {children}
      <SelectPrimitive.Icon>
        <ChevronsUpDownIcon className="size-4 shrink-0 text-muted-foreground" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export function SelectPopup({
  align = "start",
  className,
  sideOffset = 4,
  ...props
}: SelectPrimitive.Popup.Props & {
  align?: SelectPrimitive.Positioner.Props["align"];
  sideOffset?: SelectPrimitive.Positioner.Props["sideOffset"];
}) {
  return (
    <SelectPrimitive.Portal>
      {/* alignItemWithTrigger (default true) tenta focar/alinhar o item
          selecionado sobre o trigger feito um <select> nativo; esse foco
          conflita com o focus-trap do vaul quando o Select esta dentro de um
          Drawer (o popup abre e fecha sozinho ~60ms depois, reason "none",
          vindo do onFocus de SelectTrigger). Com false vira dropdown comum,
          ancorado abaixo do trigger, sem essa disputa de foco. */}
      <SelectPrimitive.Positioner align={align} alignItemWithTrigger={false} className="z-50" sideOffset={sideOffset}>
        <SelectPrimitive.Popup
          className={cn(
            "max-h-(--available-height) min-w-(--anchor-width) overflow-y-auto rounded-lg border border-border bg-card p-1 text-foreground shadow-lg shadow-black/40 outline-none",
            className,
          )}
          {...props}
        />
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

export function SelectItem({ className, children, ...props }: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "grid min-h-7 grid-cols-[1rem_1fr] cursor-default select-none items-center gap-2 rounded-md px-2 py-1 text-sm outline-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-muted",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemIndicator className="col-start-1">
        <CheckIcon className="size-3.5" />
      </SelectPrimitive.ItemIndicator>
      <SelectPrimitive.ItemText className="col-start-2 min-w-0 truncate">{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

export function SelectGroupLabel({ className, ...props }: SelectPrimitive.GroupLabel.Props) {
  return <SelectPrimitive.GroupLabel className={cn("px-2 py-1.5 text-xs font-medium text-muted-foreground", className)} {...props} />;
}

export function SelectSeparator({ className, ...props }: SelectPrimitive.Separator.Props) {
  return <SelectPrimitive.Separator className={cn("mx-1 my-1 h-px bg-border", className)} {...props} />;
}
