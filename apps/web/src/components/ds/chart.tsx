"use client";

import { MinusIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";
import { cn } from "@/lib/utils";

export type BreakdownItem = {
  label: string;
  tone?: "danger" | "foreground" | "success" | "warning";
  value: number;
};

const toneClassMap: Record<NonNullable<BreakdownItem["tone"]>, string> = {
  danger: "bg-danger",
  foreground: "bg-foreground/70",
  success: "bg-success",
  warning: "bg-warning",
};

/**
 * Distribuicao monocromatica em barras horizontais - nao uma tendencia
 * inventada. O admin nao tem serie historica real (sem tracking de eventos
 * ao longo do tempo), entao os graficos do dashboard visualizam composicao
 * atual real (status de projetos, categorias de skills etc), nao uma linha
 * do tempo fake. Ver docs/admin-visual-references.md, principio 4.
 */
export function BreakdownBars({ className, items }: { className?: string; items: BreakdownItem[] }) {
  const reduceMotion = useReducedMotion();
  const max = Math.max(1, ...items.map((item) => item.value));

  if (!items.length) {
    return <p className="text-xs leading-5 text-muted-foreground">Sem dados suficientes ainda.</p>;
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {items.map((item) => (
        <div className="flex items-center gap-3" key={item.label}>
          <span className="w-28 shrink-0 truncate text-xs text-muted-foreground">{item.label}</span>
          <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
            <motion.div
              animate={{ width: `${(item.value / max) * 100}%` }}
              className={cn("h-full rounded-full", toneClassMap[item.tone ?? "foreground"])}
              initial={{ width: reduceMotion ? `${(item.value / max) * 100}%` : 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
          <span className="w-6 shrink-0 text-right text-xs font-medium tabular-nums text-foreground">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * Painel com grid pontilhado sutil de fundo, estilo bklit, para dar destaque
 * a um bloco maior do dashboard sem introduzir cor/gradiente decorativo.
 */
export function ChartPanel({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl border border-border bg-card p-4", className)} {...props}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle,var(--border)_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]"
      />
      <div className="relative flex flex-col gap-4">{children}</div>
    </div>
  );
}

export function ChartPanelHeader({
  description,
  title,
  trailing,
}: {
  description?: string;
  title: string;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description ? <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{description}</p> : null}
      </div>
      {trailing}
    </div>
  );
}

const trendConfig = {
  down: { Icon: TrendingDownIcon, className: "text-danger", label: "Em queda" },
  stable: { Icon: MinusIcon, className: "text-muted-foreground", label: "Estavel" },
  up: { Icon: TrendingUpIcon, className: "text-success", label: "Em alta" },
} as const;

/**
 * Indicador de tendencia (subindo/caindo/estavel) baseado em dado real -
 * compara uma janela recente com a janela anterior (ver
 * `getLikesTrend` na API), nao um numero inventado. Cor entra aqui porque
 * carrega significado de verdade (alta/queda), seguindo o mesmo principio
 * ja usado no `deltaTone` do `Stat` (docs/admin-visual-references.md,
 * principio 4).
 */
export function TrendIndicator({
  changePct,
  className,
  trend,
}: {
  changePct: number | null;
  className?: string;
  trend: "down" | "stable" | "up";
}) {
  const { Icon, className: toneClassName, label } = trendConfig[trend];

  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1 text-xs font-medium", toneClassName, className)}>
      <Icon className="size-3.5" />
      {label}
      {changePct !== null ? (
        <span className="tabular-nums">
          ({changePct > 0 ? "+" : ""}
          {changePct}%)
        </span>
      ) : null}
    </span>
  );
}

export type AreaChartPoint = { label: string; value: number };

/**
 * Grafico de area/linha monocromatico, sem eixo (estilo bklit) - ao contrario
 * da `BreakdownBars` (composicao atual), este e o unico grafico do admin com
 * serie temporal real de verdade: visitas por dia tem timestamp real
 * (`PageVisitModel`), diferente de projetos/skills que nao tem historico.
 * Anima o desenho da linha (`pathLength`) e o fade-in da area.
 */
export function AreaChart({ className, data, height = 96 }: { className?: string; data: AreaChartPoint[]; height?: number }) {
  const gradientId = useId();
  const reduceMotion = useReducedMotion();
  const width = 300;
  const max = Math.max(1, ...data.map((point) => point.value));

  if (!data.length) {
    return <p className="text-xs leading-5 text-muted-foreground">Sem dados suficientes ainda.</p>;
  }

  const step = width / Math.max(1, data.length - 1);
  const coords = data.map((point, index) => ({
    x: index * step,
    y: height - (point.value / max) * (height - 8) - 4,
  }));
  const linePath = coords.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

  return (
    <div className={cn("w-full", className)}>
      <svg className="h-24 w-full overflow-visible" preserveAspectRatio="none" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--foreground)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="var(--foreground)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          animate={{ opacity: 1 }}
          d={areaPath}
          fill={`url(#${gradientId})`}
          initial={{ opacity: reduceMotion ? 1 : 0 }}
          stroke="none"
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        <motion.path
          animate={{ pathLength: 1 }}
          d={linePath}
          fill="none"
          initial={{ pathLength: reduceMotion ? 1 : 0 }}
          stroke="var(--foreground)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          transition={{ duration: 0.9, ease: "easeOut" }}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
        <span>{data[0]?.label}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  );
}

/**
 * Barra compacta pra listagens (uma linha por item, ex.: coluna de tabela ou
 * card de grade) - mesma logica da `BreakdownBars` (relativo ao maior valor
 * do conjunto, nao uma serie historica), so que sem label/legenda embutida,
 * pra caber num espaco pequeno.
 */
export function MiniBar({ className, max, value }: { className?: string; max: number; value: number }) {
  const reduceMotion = useReducedMotion();
  const safeMax = Math.max(1, max);
  const width = Math.min(100, (value / safeMax) * 100);

  return (
    <div className={cn("h-1 w-12 overflow-hidden rounded-full bg-muted", className)}>
      <motion.div
        animate={{ width: `${width}%` }}
        className="h-full rounded-full bg-foreground/60"
        initial={{ width: reduceMotion ? `${width}%` : 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
}
