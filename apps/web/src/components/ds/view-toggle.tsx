"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ViewToggleOption<T extends string> = {
  icon: LucideIcon;
  label: string;
  value: T;
};

type ViewToggleProps<T extends string> = {
  className?: string;
  onChange: (value: T) => void;
  options: ViewToggleOption<T>[];
  value: T;
};

/**
 * Segmentado grade/tabela reutilizavel. Ver docs/admin-visual-references.md
 * (Projetos usa as duas visoes, decisao 2026-07-17).
 */
export function ViewToggle<T extends string>({ className, onChange, options, value }: ViewToggleProps<T>) {
  return (
    <div
      className={cn("inline-flex items-center gap-0.5 rounded-md border border-border bg-surface-raised p-0.5", className)}
      role="group"
    >
      {options.map((option) => {
        const Icon = option.icon;
        const active = option.value === value;

        return (
          <button
            key={option.value}
            aria-pressed={active}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-[5px] px-2.5 py-1.5 text-xs font-medium transition-colors",
              active
                ? "bg-card text-foreground shadow-sm shadow-black/5"
                : "text-muted-foreground hover:text-foreground",
            )}
            type="button"
            onClick={() => onChange(option.value)}
          >
            <Icon className="size-4" />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
