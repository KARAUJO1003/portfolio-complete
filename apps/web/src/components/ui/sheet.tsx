"use client";

import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Base UI e a base de primitivos deste projeto. Ver docs/ui-primitives.md.
 * Adaptado do particle @coss/sheet (p-sheet-3): sem useRender/mergeProps
 * (nao usados em nenhum outro lugar do projeto, ver table.tsx) e sem
 * ScrollArea dedicado (SheetPanel usa overflow-y-auto simples).
 */
export const Sheet = SheetPrimitive.Root;
export const SheetTrigger = SheetPrimitive.Trigger;
export const SheetClose = SheetPrimitive.Close;
export const SheetPortal = SheetPrimitive.Portal;

type SheetSide = "right" | "left" | "top" | "bottom";

function SheetBackdrop({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Backdrop>) {
  return (
    <SheetPrimitive.Backdrop
      className={cn(
        "fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px] transition-opacity duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
        className,
      )}
      data-slot="sheet-backdrop"
      {...props}
    />
  );
}

const sideViewportClass: Record<SheetSide, string> = {
  right: "justify-end",
  left: "justify-start",
  top: "items-start",
  bottom: "items-end",
};

const sidePopupClass: Record<SheetSide, string> = {
  right:
    "h-full w-[calc(100%-3rem)] max-w-md border-l data-[ending-style]:translate-x-6 data-[starting-style]:translate-x-6",
  left: "h-full w-[calc(100%-3rem)] max-w-md border-r data-[ending-style]:-translate-x-6 data-[starting-style]:-translate-x-6",
  top: "max-h-[85vh] w-full border-b data-[ending-style]:-translate-y-6 data-[starting-style]:-translate-y-6",
  bottom: "max-h-[85vh] w-full border-t data-[ending-style]:translate-y-6 data-[starting-style]:translate-y-6",
};

export function SheetPopup({
  className,
  children,
  showCloseButton = true,
  side = "right",
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Popup> & {
  showCloseButton?: boolean;
  side?: SheetSide;
}) {
  return (
    <SheetPortal>
      <SheetBackdrop />
      <div className={cn("fixed inset-0 z-50 flex", sideViewportClass[side])} data-slot="sheet-viewport">
        <SheetPrimitive.Popup
          className={cn(
            "relative flex min-w-0 flex-col border-border bg-card text-foreground shadow-lg shadow-black/40 outline-none transition-[opacity,transform] duration-200 ease-out data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
            sidePopupClass[side],
            className,
          )}
          data-slot="sheet-popup"
          {...props}
        >
          {children}
          {showCloseButton && (
            <SheetPrimitive.Close
              aria-label="Fechar"
              className="absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <XIcon className="size-4" />
            </SheetPrimitive.Close>
          )}
        </SheetPrimitive.Popup>
      </div>
    </SheetPortal>
  );
}

export function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col gap-1.5 border-b border-border px-5 py-4", className)}
      data-slot="sheet-header"
      {...props}
    />
  );
}

export function SheetFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-auto flex flex-col-reverse gap-2 border-t border-border bg-surface-raised/75 px-5 py-4 sm:flex-row sm:justify-end",
        className,
      )}
      data-slot="sheet-footer"
      {...props}
    />
  );
}

export function SheetTitle({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return <SheetPrimitive.Title className={cn("text-sm font-semibold", className)} data-slot="sheet-title" {...props} />;
}

export function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      className={cn("text-[13px] leading-5 text-muted-foreground", className)}
      data-slot="sheet-description"
      {...props}
    />
  );
}

export function SheetPanel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex-1 overflow-y-auto p-5", className)} data-slot="sheet-panel" {...props} />;
}
