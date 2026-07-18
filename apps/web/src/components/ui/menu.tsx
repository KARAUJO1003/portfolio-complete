"use client";

import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { cn } from "@/lib/utils";

/**
 * Base UI e a base de primitivos deste projeto. Ver docs/ui-primitives.md.
 * Adaptado do particle @coss/menu: sem checkbox/radio/submenu (nao usados
 * ainda, adicionar seguindo o mesmo padrao quando precisar). Tokens do
 * projeto (nao existe --popover/--accent/--destructive aqui): popup usa
 * bg-card/border-border (igual AlertDialog), item destacado usa bg-muted,
 * variante destructive usa text-danger.
 */
export const Menu = MenuPrimitive.Root;
export const MenuTrigger = MenuPrimitive.Trigger;
export const MenuPortal = MenuPrimitive.Portal;
export const MenuGroup = MenuPrimitive.Group;

export function MenuPopup({
  align = "end",
  alignOffset,
  children,
  className,
  side = "bottom",
  sideOffset = 6,
  ...props
}: MenuPrimitive.Popup.Props & {
  align?: MenuPrimitive.Positioner.Props["align"];
  alignOffset?: MenuPrimitive.Positioner.Props["alignOffset"];
  side?: MenuPrimitive.Positioner.Props["side"];
  sideOffset?: MenuPrimitive.Positioner.Props["sideOffset"];
}) {
  return (
    <MenuPortal>
      <MenuPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        className="z-50"
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          className={cn(
            "min-w-48 rounded-lg border border-border bg-card p-1 text-foreground shadow-lg shadow-black/40 outline-none",
            className,
          )}
          {...props}
        >
          {children}
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPortal>
  );
}

export function MenuGroupLabel({ className, ...props }: MenuPrimitive.GroupLabel.Props) {
  return (
    <MenuPrimitive.GroupLabel
      className={cn("px-2 py-1.5 text-xs font-medium text-muted-foreground", className)}
      {...props}
    />
  );
}

export function MenuItem({
  className,
  variant = "default",
  ...props
}: MenuPrimitive.Item.Props & { variant?: "default" | "destructive" }) {
  return (
    <MenuPrimitive.Item
      className={cn(
        "flex min-h-7 cursor-default select-none items-center gap-2 rounded-md px-2 py-1 text-sm outline-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-muted [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground",
        variant === "destructive" && "text-danger data-highlighted:text-danger [&_svg]:text-danger",
        className,
      )}
      {...props}
    />
  );
}

export function MenuLinkItem({
  className,
  closeOnClick = true,
  variant = "default",
  ...props
}: MenuPrimitive.LinkItem.Props & { variant?: "default" | "destructive" }) {
  return (
    <MenuPrimitive.LinkItem
      className={cn(
        "flex min-h-7 cursor-default select-none items-center gap-2 rounded-md px-2 py-1 text-sm outline-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-muted [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground",
        variant === "destructive" && "text-danger data-highlighted:text-danger [&_svg]:text-danger",
        className,
      )}
      closeOnClick={closeOnClick}
      {...props}
    />
  );
}

export function MenuSeparator({ className, ...props }: MenuPrimitive.Separator.Props) {
  return <MenuPrimitive.Separator className={cn("mx-1 my-1 h-px bg-border", className)} {...props} />;
}
