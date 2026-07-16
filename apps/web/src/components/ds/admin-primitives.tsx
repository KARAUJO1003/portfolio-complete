import { AlertCircleIcon, InboxIcon, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageFrame({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card shadow-sm shadow-black/5",
        className,
      )}
      {...props}
    />
  );
}

export function PageFrameHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-b border-border bg-surface-raised/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
      {...props}
    />
  );
}

export function PageFrameTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-sm font-semibold tracking-normal", className)} {...props} />;
}

export function PageFrameDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("max-w-2xl text-[13px] leading-5 text-muted-foreground", className)} {...props} />;
}

export function PageFrameContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5", className)} {...props} />;
}

export function ActionBar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-border bg-surface-raised/75 p-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
      {...props}
    />
  );
}

export function Toolbar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-wrap items-center gap-2", className)} {...props} />;
}

export function EmptyState({
  action,
  className,
  description,
  icon: Icon = InboxIcon,
  title,
}: {
  action?: React.ReactNode;
  className?: string;
  description?: string;
  icon?: LucideIcon;
  title: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-44 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface-muted/50 p-8 text-center",
        className,
      )}
    >
      <div className="mb-3 flex size-9 items-center justify-center rounded-full border border-border bg-surface-raised text-muted-foreground">
        <Icon className="size-4" />
      </div>
      <p className="text-sm font-semibold">{title}</p>
      {description && (
        <p className="mt-1.5 max-w-sm text-[13px] leading-5 text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function LoadingState({ label = "Carregando..." }: { label?: string }) {
  return (
    <div className="grid gap-3 rounded-xl border border-border bg-card p-4">
      <div className="h-3 w-32 animate-pulse rounded-full bg-muted" />
      <div className="h-16 animate-pulse rounded-lg bg-muted/70" />
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export function ErrorState({
  action,
  description = "Tente novamente ou revise os dados informados.",
  title = "Nao foi possivel carregar",
}: {
  action?: React.ReactNode;
  description?: string;
  title?: string;
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-danger/30 bg-danger/10 p-4">
      <AlertCircleIcon className="mt-0.5 size-4 shrink-0 text-danger" />
      <div>
        <p className="text-sm font-semibold text-danger">{title}</p>
        <p className="mt-1 text-[13px] leading-5 text-muted-foreground">{description}</p>
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  );
}
