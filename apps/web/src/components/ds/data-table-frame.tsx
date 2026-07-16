"use client";

import { EmptyState, PageFrame, PageFrameContent, PageFrameDescription, PageFrameHeader, PageFrameTitle, Toolbar } from "@/components/ds/admin-primitives";
import { Input } from "@/components/ui/input";

type DataTableFrameProps = {
  actions?: React.ReactNode;
  children: React.ReactNode;
  description?: string;
  empty?: boolean;
  emptyDescription?: string;
  emptyTitle?: string;
  filters?: React.ReactNode;
  onSearchChange?: (value: string) => void;
  search?: string;
  searchPlaceholder?: string;
  title: string;
};

export function DataTableFrame({
  actions,
  children,
  description,
  empty,
  emptyDescription,
  emptyTitle = "Nenhum registro encontrado",
  filters,
  onSearchChange,
  search,
  searchPlaceholder = "Buscar...",
  title,
}: DataTableFrameProps) {
  return (
    <PageFrame>
      <PageFrameHeader>
        <div>
          <PageFrameTitle>{title}</PageFrameTitle>
          {description && <PageFrameDescription>{description}</PageFrameDescription>}
        </div>
        {actions}
      </PageFrameHeader>
      <PageFrameContent className="grid gap-4">
        <Toolbar>
          {onSearchChange && (
            <Input
              className="min-w-64 max-w-sm"
              placeholder={searchPlaceholder}
              value={search ?? ""}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          )}
          {filters}
        </Toolbar>
        {empty ? <EmptyState description={emptyDescription} title={emptyTitle} /> : children}
      </PageFrameContent>
    </PageFrame>
  );
}
