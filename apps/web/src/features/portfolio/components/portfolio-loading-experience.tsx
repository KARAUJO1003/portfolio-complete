"use client";

import { motion, useReducedMotion } from "motion/react";

const loadingSteps = ["Desenhando layout", "Compondo projetos", "Sincronizando dados"];

export function PortfolioLoadingExperience() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-label="Carregando portfolio"
      aria-live="polite"
      className="relative grid min-h-dvh overflow-hidden bg-background px-6 py-8 text-foreground"
      role="status"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-48 opacity-40 [background-image:radial-gradient(circle,rgba(143,183,255,0.2)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <motion.div
          animate={reduceMotion ? undefined : { x: ["-12%", "12%", "-12%"], opacity: [0.22, 0.42, 0.22] }}
          className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-accent/12 blur-3xl"
          transition={{ duration: 4.5, ease: "easeInOut", repeat: Infinity }}
        />
      </div>

      <section className="relative mx-auto grid w-full max-w-5xl content-center gap-8 self-center lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <motion.p
            animate={reduceMotion ? undefined : { opacity: [0.55, 1, 0.55] }}
            className="text-xs font-medium uppercase tracking-[0.28em] text-primary-accent"
            transition={{ duration: 2.2, repeat: Infinity }}
          >
            Kaesyo Portfolio
          </motion.p>
          <h1 className="mt-5 max-w-md text-balance text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            Construindo a interface.
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
            Carregando dados, organizando secoes e preparando os projetos para uma experiencia mais fluida.
          </p>
          <div className="mt-8 grid gap-3">
            {loadingSteps.map((step, index) => (
              <motion.div
                animate={reduceMotion ? undefined : { opacity: [0.45, 1, 0.45] }}
                className="flex items-center gap-3 text-xs text-muted-foreground"
                key={step}
                transition={{ delay: index * 0.3, duration: 1.7, repeat: Infinity }}
              >
                <span className="grid size-5 place-items-center rounded-full border border-border bg-card text-[10px] text-primary-accent">
                  {index + 1}
                </span>
                {step}
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
          className="relative min-h-[360px] overflow-hidden rounded-2xl border border-border bg-card/80 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.24)]"
          transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
        >
          <div className="mb-5 flex items-center justify-between border-b border-border pb-4">
            <div className="flex gap-2">
              <span className="size-2.5 rounded-full bg-danger/70" />
              <span className="size-2.5 rounded-full bg-warning/70" />
              <span className="size-2.5 rounded-full bg-success/70" />
            </div>
            <span className="rounded-full border border-border px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-foreground-subtle">
              front-end build
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-[0.78fr_1.22fr]">
            <div className="space-y-3">
              <SkeletonLine delay={0.1} width="72%" />
              <SkeletonLine delay={0.2} width="48%" />
              <div className="pt-5">
                <AnimatedMenuLine delay={0.15} />
                <AnimatedMenuLine delay={0.3} />
                <AnimatedMenuLine delay={0.45} />
                <AnimatedMenuLine delay={0.6} />
              </div>
            </div>

            <div className="relative min-h-[260px] rounded-xl border border-border bg-background/70 p-4">
              <BlueprintSvg reduceMotion={Boolean(reduceMotion)} />
              <div className="absolute inset-x-4 bottom-4 grid gap-3 sm:grid-cols-2">
                <WireCard delay={0.3} />
                <WireCard delay={0.5} />
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

function SkeletonLine({ delay, width }: { delay: number; width: string }) {
  return (
    <motion.span
      animate={{ opacity: [0.35, 0.8, 0.35], scaleX: [0.94, 1, 0.94] }}
      className="block h-3 origin-left rounded-full bg-muted"
      style={{ width }}
      transition={{ delay, duration: 1.6, repeat: Infinity }}
    />
  );
}

function AnimatedMenuLine({ delay }: { delay: number }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <motion.span
        animate={{ scaleX: [0.55, 1, 0.55], opacity: [0.35, 1, 0.35] }}
        className="h-px w-10 origin-left bg-border"
        transition={{ delay, duration: 1.8, repeat: Infinity }}
      />
      <motion.span
        animate={{ opacity: [0.24, 0.7, 0.24] }}
        className="h-2 w-20 rounded-full bg-muted"
        transition={{ delay: delay + 0.12, duration: 1.8, repeat: Infinity }}
      />
    </div>
  );
}

function WireCard({ delay }: { delay: number }) {
  return (
    <motion.div
      animate={{ opacity: [0.46, 1, 0.46], y: [8, 0, 8] }}
      className="rounded-lg border border-border bg-card/85 p-3"
      transition={{ delay, duration: 2.4, ease: "easeInOut", repeat: Infinity }}
    >
      <span className="block h-16 rounded-md border border-primary-accent/25 bg-primary-accent/10" />
      <span className="mt-3 block h-2 w-20 rounded-full bg-muted" />
      <span className="mt-2 block h-2 w-28 rounded-full bg-muted/80" />
    </motion.div>
  );
}

function BlueprintSvg({ reduceMotion }: { reduceMotion: boolean }) {
  const lineTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 1.7, ease: [0.22, 1, 0.36, 1] as const, repeat: Infinity, repeatDelay: 0.7 };

  return (
    <svg aria-hidden="true" className="absolute inset-0 size-full" fill="none" viewBox="0 0 520 300">
      <defs>
        <linearGradient id="portfolio-loader-line" x1="50" x2="470" y1="40" y2="250">
          <stop stopColor="var(--primary-accent)" stopOpacity="0.95" />
          <stop offset="1" stopColor="var(--success)" stopOpacity="0.75" />
        </linearGradient>
      </defs>
      <motion.path
        animate={{ pathLength: 1, opacity: 1 }}
        d="M56 62H188V118H56V62ZM224 62H464V118H224V62ZM56 150H188V246H56V150ZM224 150H464V246H224V150Z"
        initial={{ pathLength: 0, opacity: 0.2 }}
        stroke="url(#portfolio-loader-line)"
        strokeWidth="1.5"
        transition={lineTransition}
      />
      <motion.path
        animate={{ pathLength: 1, opacity: [0.35, 0.85, 0.35] }}
        d="M72 84H152M240 84H430M240 100H356M72 172H146M72 194H166M72 216H128M240 176H430M240 198H380M240 220H408"
        initial={{ pathLength: 0, opacity: 0.2 }}
        stroke="var(--foreground-muted)"
        strokeLinecap="round"
        strokeWidth="2"
        transition={lineTransition}
      />
      <motion.circle
        animate={reduceMotion ? undefined : { cx: [56, 188, 224, 464, 464, 224, 56], cy: [62, 118, 62, 118, 246, 150, 246] }}
        cx="56"
        cy="62"
        fill="var(--primary-accent)"
        r="4"
        transition={{ duration: 3.2, ease: "easeInOut", repeat: Infinity }}
      />
    </svg>
  );
}
