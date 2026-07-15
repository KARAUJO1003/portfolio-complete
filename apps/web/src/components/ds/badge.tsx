import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "default" | "success" | "muted";
};

export function Badge({ className, tone = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-6 items-center rounded-md border px-2 text-xs font-medium",
        tone === "default" && "border-border bg-background text-foreground",
        tone === "success" && "border-border bg-primary-tint text-success",
        tone === "muted" && "border-border bg-muted text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
