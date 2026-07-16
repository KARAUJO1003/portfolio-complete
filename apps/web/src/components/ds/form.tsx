import { cn } from "@/lib/utils";

export function DsForm({ className, ...props }: React.FormHTMLAttributes<HTMLFormElement>) {
  return <form className={cn("grid gap-5", className)} {...props} />;
}

export function FormSection({
  children,
  className,
  description,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  description?: string;
  title: string;
}) {
  return (
    <section className={cn("rounded-xl border border-border bg-card p-4", className)}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold">{title}</h3>
        {description && <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>}
      </div>
      <div className="grid gap-4">{children}</div>
    </section>
  );
}

export function FormStep({
  active,
  index,
  label,
}: {
  active?: boolean;
  index: number;
  label: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full border border-border bg-surface-muted px-3 py-1.5 text-xs text-muted-foreground",
        active && "border-primary/50 bg-primary-tint text-foreground",
      )}
    >
      <span className="flex size-5 items-center justify-center rounded-full bg-surface-raised text-[10px]">
        {index}
      </span>
      {label}
    </div>
  );
}

export function FormActions({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "sticky bottom-4 z-10 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-background/90 p-3 shadow-lg shadow-black/10 backdrop-blur",
        className,
      )}
      {...props}
    />
  );
}

export function FormAside({ className, ...props }: React.HTMLAttributes<HTMLAsideElement>) {
  return (
    <aside
      className={cn("rounded-xl border border-border bg-surface-muted/60 p-4 text-sm leading-6", className)}
      {...props}
    />
  );
}

export function FormPreviewFrame({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-background shadow-sm shadow-black/5",
        className,
      )}
      {...props}
    />
  );
}
