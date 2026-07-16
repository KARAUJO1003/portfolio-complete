import { cn } from "@/lib/utils";

/**
 * Grade de metricas emoldurada: divisorias internas full-bleed, sem gap.
 * Empilha no mobile (divide-y) e vira colunas no desktop (divide-x).
 */
export function StatGrid({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card sm:grid-cols-3 sm:divide-x sm:divide-y-0",
        className,
      )}
      {...props}
    />
  );
}

type StatProps = {
  /** Comparacao curta (ex.: "+2% vs mes passado"). `tone` define se vira sinal colorido. */
  delta?: string;
  deltaTone?: "danger" | "neutral" | "success";
  href?: string;
  label: string;
  value: string;
};

/**
 * Rotulo em caps acima, numero como protagonista abaixo.
 * Ver docs/admin-visual-references.md, principios 3 e 4: o numero domina e a cor
 * so aparece no delta quando carrega significado.
 */
export function Stat({ delta, deltaTone = "neutral", href, label, value }: StatProps) {
  const body = (
    <div className={cn("h-full p-4", href && "transition-colors hover:bg-surface-raised/60")}>
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-foreground-subtle">{label}</p>
      <p className="mt-1.5 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
      {delta && (
        <p
          className={cn(
            "mt-1 text-xs tabular-nums",
            deltaTone === "success" && "text-success",
            deltaTone === "danger" && "text-danger",
            deltaTone === "neutral" && "text-muted-foreground",
          )}
        >
          {delta}
        </p>
      )}
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
