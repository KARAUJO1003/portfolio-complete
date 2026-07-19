"use client";

import { SearchIcon } from "lucide-react";
import { EmptyState, PageFrame, PageFrameContent, PageFrameDescription, PageFrameHeader, PageFrameTitle, Toolbar } from "@/components/ds/admin-primitives";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

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
  const hasToolbar = Boolean(onSearchChange) || Boolean(filters);

  return (
    <div className="grid gap-3">
      {hasToolbar && (
        <Toolbar>
          {onSearchChange && (
            <InputGroup className="min-w-64 max-w-sm">
              <InputGroupAddon>
                <SearchIcon className="size-3.5" />
              </InputGroupAddon>
              <InputGroupInput
                placeholder={searchPlaceholder}
                value={search ?? ""}
                onChange={(event) => onSearchChange(event.target.value)}
              />
            </InputGroup>
          )}
          {filters}
        </Toolbar>
      )}
      <PageFrame>
        <PageFrameHeader>
          <div>
            <PageFrameTitle>{title}</PageFrameTitle>
            {description && <PageFrameDescription>{description}</PageFrameDescription>}
          </div>
          {actions}
        </PageFrameHeader>
        <PageFrameContent className="grid gap-4">
          {empty ? <EmptyState description={emptyDescription} title={emptyTitle} /> : children}
        </PageFrameContent>
      </PageFrame>
    </div>
  );
}
