"use client";

import { PortfolioLoadingExperience } from "@/features/portfolio/components/portfolio-loading-experience";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const minimumLoadingMs = 1800;

export function PortfolioEntryOverlay() {
  const [visible, setVisible] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const timeout = window.setTimeout(() => setVisible(false), minimumLoadingMs);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[80] bg-background"
          exit={{ opacity: 0, scale: reduceMotion ? 1 : 1.015 }}
          initial={{ opacity: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          <PortfolioLoadingExperience />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
