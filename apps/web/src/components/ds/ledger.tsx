import { cn } from "@/lib/utils";

/**
 * Tabela-ficha: container de cantos arredondados com divisorias de 1px que
 * cruzam toda a largura, sem gap entre linhas. `divide-y` desenha a regua
 * entre os filhos diretos (funciona mesmo com wrappers de animacao no meio);
 * `overflow-hidden` faz a regua encostar nas bordas sem vazar o raio.
 */
export function Ledger({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "divide-y divide-border/70 overflow-hidden rounded-2xl border border-border/70 bg-surface/60 backdrop-blur",
        className,
      )}
      {...props}
    />
  );
}

/** Linha da tabela-ficha: hover na largura toda + acento no gesto. */
export function LedgerRow({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("group relative transition-colors hover:bg-surface-raised/60", className)}
      {...props}
    />
  );
}
