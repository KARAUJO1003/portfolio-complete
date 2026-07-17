import { cn } from "@/lib/utils";

export type TableVariant = "default" | "card";

export type TableProps = React.ComponentProps<"table"> & {
  variant?: TableVariant;
};

/**
 * Adaptado do particle p-table-8 do Coss (Base UI). Ver docs/ui-primitives.md.
 * `variant="card"` fecha a tabela num frame com borda unica, sem shadow por linha
 * (docs/admin-visual-references.md, principio 1: separacao por borda, nao sombra).
 */
export function Table({ className, variant = "default", ...props }: TableProps) {
  return (
    <div className="relative w-full overflow-x-auto" data-slot="table-container" data-variant={variant}>
      <table
        className={cn(
          "w-full caption-bottom text-sm in-data-[variant=card]:border-separate in-data-[variant=card]:border-spacing-0",
          className,
        )}
        data-slot="table"
        {...props}
      />
    </div>
  );
}

export function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead className={cn("[&_tr]:border-b [&_tr]:border-border", className)} data-slot="table-header" {...props} />;
}

export function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      className={cn(
        "in-data-[variant=card]:overflow-hidden in-data-[variant=card]:rounded-xl in-data-[variant=card]:border in-data-[variant=card]:border-border [&_tr:last-child]:border-0",
        className,
      )}
      data-slot="table-body"
      {...props}
    />
  );
}

export function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      className={cn(
        "border-b border-border transition-colors hover:bg-surface-raised/60 data-[state=selected]:bg-primary-tint/60",
        className,
      )}
      data-slot="table-row"
      {...props}
    />
  );
}

export function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      className={cn(
        "h-10 whitespace-nowrap px-2.5 text-left align-middle text-sm font-medium text-muted-foreground has-[[role=checkbox]]:w-px first:has-[[role=checkbox]]:pe-0 last:has-[[role=checkbox]]:ps-0",
        className,
      )}
      data-slot="table-head"
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      className={cn(
        "whitespace-nowrap p-2.5 align-middle has-[[role=checkbox]]:w-px first:has-[[role=checkbox]]:pe-0 last:has-[[role=checkbox]]:ps-0",
        className,
      )}
      data-slot="table-cell"
      {...props}
    />
  );
}

export function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      className={cn("border-t border-border bg-surface-muted/60 font-medium [&>tr]:last:border-b-0", className)}
      data-slot="table-footer"
      {...props}
    />
  );
}

export function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return (
    <caption className={cn("mt-4 text-sm text-muted-foreground", className)} data-slot="table-caption" {...props} />
  );
}
