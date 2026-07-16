"use client";

import { AlertTriangleIcon, type LucideIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ConfirmDialogProps = {
  cancelLabel?: string;
  confirmLabel?: string;
  description: string;
  icon?: LucideIcon;
  /** `danger` reserva a cor de risco para acoes destrutivas. Ver docs/admin-visual-references.md. */
  tone?: "danger" | "neutral";
  loading?: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  title: string;
};

/**
 * Caminho unico para acao destrutiva no admin. AlertDialog (nao Dialog) porque
 * confirmacao destrutiva nao deve fechar por clique fora nem ESC acidental.
 * Foco preso e aria vem do Base UI; o texto de consequencia e obrigatorio via `description`.
 */
export function ConfirmDialog({
  cancelLabel = "Cancelar",
  confirmLabel = "Confirmar",
  description,
  icon: Icon = AlertTriangleIcon,
  tone = "danger",
  loading = false,
  onConfirm,
  onOpenChange,
  open,
  title,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogPopup>
        <AlertDialogHeader>
          <div
            className={cn(
              "mb-1 flex size-9 items-center justify-center rounded-full border",
              tone === "danger" ? "border-danger/30 bg-danger/10 text-danger" : "border-border bg-surface-muted text-muted-foreground",
            )}
          >
            <Icon className="size-4" />
          </div>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button disabled={loading} type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {cancelLabel}
          </Button>
          <Button
            disabled={loading}
            type="button"
            variant={tone === "danger" ? "destructive" : "default"}
            onClick={onConfirm}
          >
            {loading ? "Processando..." : confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  );
}
