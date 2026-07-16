"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState, type ReactNode } from "react";

type AnimatedDisclosureProps = {
  children: ReactNode;
  className?: string;
  label: string;
};

export function AnimatedDisclosure({ children, className, label }: AnimatedDisclosureProps) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <div className={className}>
      <button
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between px-5 py-4 text-left text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary-accent/35"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        {label}
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          aria-hidden="true"
          className="grid size-6 place-items-center rounded-full border border-border text-xs"
          transition={{ duration: reduceMotion ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              animate={{ y: 0 }}
              className="overflow-hidden"
              exit={{ y: reduceMotion ? 0 : -8 }}
              initial={{ y: reduceMotion ? 0 : -8 }}
              transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
