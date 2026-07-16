import { cn } from "@/lib/utils";

type FramedCardProps = React.HTMLAttributes<HTMLDivElement> & {
  /** moldura interna reta (0px) dentro do card arredondado */
  inset?: boolean;
  /** marcas de registro nos cantos, em cor de acento */
  ticks?: boolean;
};

/**
 * Card-assinatura: canto externo arredondado + moldura interna reta + marcas
 * de registro nos cantos. A tensao "moldura dentro do card" e o gesto premium.
 * Aplique padding >= 20px no conteudo para nao colidir com a moldura interna.
 */
export function FramedCard({
  className,
  children,
  inset = true,
  ticks = true,
  ...props
}: FramedCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-border/70 bg-surface/70 backdrop-blur",
        className,
      )}
      {...props}
    >
      {inset ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-[9px] rounded-[10px] border border-foreground/10"
        />
      ) : null}
      {ticks ? <CornerTicks /> : null}
      {children}
    </div>
  );
}

function CornerTicks() {
  const base = "pointer-events-none absolute z-[1] size-2 border-primary-accent";

  return (
    <>
      <span aria-hidden="true" className={cn(base, "left-1.5 top-1.5 border-l border-t")} />
      <span aria-hidden="true" className={cn(base, "right-1.5 top-1.5 border-r border-t")} />
      <span aria-hidden="true" className={cn(base, "bottom-1.5 left-1.5 border-b border-l")} />
      <span aria-hidden="true" className={cn(base, "bottom-1.5 right-1.5 border-b border-r")} />
    </>
  );
}
