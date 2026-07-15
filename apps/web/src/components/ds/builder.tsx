import { cn } from "@/lib/utils";

export function BuilderLayout({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]", className)} {...props} />;
}

export function BuilderPanel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col gap-4 rounded-lg border border-border bg-card p-5", className)}
      {...props}
    />
  );
}

export function BuilderPreview({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("min-h-[620px] rounded-lg border border-border bg-card p-6", className)}
      {...props}
    />
  );
}

export function BuilderItem({ className, ...props }: React.HTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-md border border-border bg-background p-3 text-sm",
        className,
      )}
      {...props}
    />
  );
}

export function BuilderItemContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex min-w-0 flex-1 flex-col gap-1", className)} {...props} />;
}

export function BuilderItemTitle({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("font-medium", className)} {...props} />;
}

export function BuilderItemDescription({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("text-xs leading-5 text-muted-foreground", className)} {...props} />;
}

export function BuilderItemOptions({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-2 grid max-h-40 gap-2 overflow-y-auto border-t border-border pt-2", className)}
      {...props}
    />
  );
}

export function BuilderStatus({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-xs leading-5 text-muted-foreground", className)} {...props} />;
}
