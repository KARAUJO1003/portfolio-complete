"use client";

import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

type DrawerFormShellProps = {
  children: React.ReactNode;
  description: string;
  formId: string;
  maxWidth?: string;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  pendingLabel?: string;
  saveLabel: string;
  saving: boolean;
  title: string;
};

/**
 * Drawer bottom padrao para forms de CRUD (Projetos, Skills, Trajetoria, Paginas,
 * Secoes, Usuarios). O `DrawerContent` fica `w-full` (padrao do primitivo); so o
 * conteudo interno (header + form) e limitado por `maxWidth` e centralizado.
 * Acao principal fica no header como toolbar (`form={formId}`), nao num rodape
 * flutuante. Ver docs/admin-visual-references.md.
 */
export function DrawerFormShell({
  children,
  description,
  formId,
  maxWidth = "max-w-2xl",
  onOpenChange,
  open,
  pendingLabel = "Salvando...",
  saveLabel,
  saving,
  title,
}: DrawerFormShellProps) {
  return (
    <Drawer direction="bottom" open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="border-border data-[vaul-drawer-direction=bottom]:max-h-[92vh] data-[vaul-drawer-direction=bottom]:rounded-t-xl">
        <div className={cn("mx-auto flex min-h-0 w-full flex-1 flex-col", maxWidth)}>
          <DrawerHeader className="flex-row items-start justify-between gap-4 border-b border-border text-left group-data-[vaul-drawer-direction=bottom]/drawer-content:text-left">
            <div className="min-w-0 flex-1">
              <DrawerTitle>{title}</DrawerTitle>
              <DrawerDescription>{description}</DrawerDescription>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button type="submit" form={formId} disabled={saving}>
                {saving ? pendingLabel : saveLabel}
              </Button>
              <DrawerClose
                aria-label="Fechar"
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <XIcon className="size-4" />
              </DrawerClose>
            </div>
          </DrawerHeader>
          <div className="min-h-0 flex-1 overflow-y-auto p-5">{children}</div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
