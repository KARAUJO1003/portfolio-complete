import { cn } from "@/lib/utils";

type BadgeTone = "danger" | "default" | "muted" | "success" | "warning";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
  /** Ponto colorido em vez de texto/fundo tintado. Ver docs/admin-visual-references.md, principio 4: cor so como sinal. */
  dot?: boolean;
};

const dotColor: Record<BadgeTone, string> = {
  danger: "bg-danger",
  default: "bg-foreground-subtle",
  muted: "bg-foreground-subtle",
  success: "bg-success",
  warning: "bg-warning",
};

export function Badge({ className, tone = "default", dot = false, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-6 items-center gap-1.5 rounded-md border px-2 text-xs font-medium",
        tone === "default" && "border-border bg-background text-foreground",
        tone === "success" && "border-border bg-primary-tint text-success",
        tone === "muted" && "border-border bg-muted text-muted-foreground",
        tone === "danger" && "border-border bg-danger/10 text-danger",
        tone === "warning" && "border-border bg-warning/10 text-warning",
        className,
      )}
      {...props}
    >
      {dot && <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", dotColor[tone])} />}
      {children}
    </span>
  );
}
