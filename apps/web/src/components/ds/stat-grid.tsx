import { cn } from "@/lib/utils";

/**
 * Grade de metricas emoldurada: divisorias internas full-bleed, sem gap.
 * Empilha no mobile (divide-y) e vira colunas no desktop (divide-x).
 */
export function StatGrid({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 divide-y divide-border/70 overflow-hidden rounded-2xl border border-border/70 bg-surface/60 backdrop-blur sm:grid-cols-3 sm:divide-x sm:divide-y-0",
        className,
      )}
      {...props}
    />
  );
}

type StatProps = {
  label: string;
  value: string;
  href?: string;
};

export function Stat({ label, value, href }: StatProps) {
  const body = (
    <div className="group h-full p-5 transition-colors hover:bg-surface-raised/60">
      <p className="font-mono text-2xl font-semibold tracking-tight tabular-nums transition-colors group-hover:text-primary-accent">
        {value}
      </p>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground-subtle">
        {label}
      </p>
    </div>
  );

  if (href) {
    return (
      <a href={href} rel="noreferrer" target="_blank">
        {body}
      </a>
    );
  }

  return body;
}
