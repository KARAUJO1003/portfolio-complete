"use client";

import { ThemeToggle } from "@/components/ds/theme-toggle";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

type FloatingMenuItem = {
  href: string;
  label: string;
  external?: boolean;
};

type PortfolioFloatingMenuProps = {
  items: FloatingMenuItem[];
};

export function PortfolioFloatingMenu({ items }: PortfolioFloatingMenuProps) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <div className="fixed right-4 bottom-4 z-50 lg:hidden">
      <AnimatePresence>
        {open && (
          <motion.div
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            className="absolute right-0 bottom-14 flex flex-col items-end gap-2"
            exit={{ opacity: 0, x: reduceMotion ? 0 : 12, filter: "blur(6px)" }}
            initial={{ opacity: 0, x: reduceMotion ? 0 : 12, filter: "blur(6px)" }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {items.map((item, index) => (
              <motion.a
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "rounded-full border border-border/80 bg-surface-raised/95 px-4 py-2 text-xs font-medium text-foreground shadow-[0_8px_24px_rgba(0,0,0,0.28)] backdrop-blur-xl",
                  "transition-colors hover:border-primary-accent/70 hover:text-primary-accent focus:outline-none focus:ring-2 focus:ring-primary-accent/50",
                )}
                exit={{ opacity: 0, x: reduceMotion ? 0 : 8 }}
                href={item.href}
                initial={{ opacity: 0, x: reduceMotion ? 0 : 8 }}
                key={item.href}
                onClick={() => setOpen(false)}
                rel={item.external ? "noreferrer" : undefined}
                target={item.external ? "_blank" : undefined}
                transition={{ delay: reduceMotion ? 0 : index * 0.025, duration: 0.18 }}
              >
                {item.label}
              </motion.a>
            ))}
            <div className="rounded-full border border-border/80 bg-surface-raised/95 p-1 shadow-[0_8px_24px_rgba(0,0,0,0.28)] backdrop-blur-xl">
              <ThemeToggle />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        aria-expanded={open}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        className="grid size-12 place-items-center rounded-full border border-primary-accent/50 bg-primary text-primary-foreground shadow-[0_12px_34px_rgba(217,70,239,0.28)] transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-accent/60"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span className="text-lg font-semibold">{open ? "×" : "+"}</span>
      </button>
    </div>
  );
}
