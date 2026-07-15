"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import type { Variants } from "motion/react";
import { cn } from "@/lib/utils";

const revealVariants = {
  "fade-up": {
    hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
  "fade-in": {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  "scale-in": {
    hidden: { opacity: 0, scale: 0.96, filter: "blur(8px)" },
    visible: { opacity: 1, scale: 1, filter: "blur(0px)" },
  },
  "slide-left": {
    hidden: { opacity: 0, x: 32, filter: "blur(8px)" },
    visible: { opacity: 1, x: 0, filter: "blur(0px)" },
  },
  "slide-right": {
    hidden: { opacity: 0, x: -32, filter: "blur(8px)" },
    visible: { opacity: 1, x: 0, filter: "blur(0px)" },
  },
} as const satisfies Record<string, Variants>;

const staggerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
} satisfies Variants;

const itemVariants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.28, ease: "easeOut" },
  },
} satisfies Variants;

type MotionDivProps = React.ComponentProps<typeof motion.div>;

type MotionRevealProps = MotionDivProps & {
  delay?: number;
  variant?: keyof typeof revealVariants;
};

export function MotionReveal({
  children,
  className,
  delay = 0,
  variant = "fade-up",
  ...props
}: MotionRevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <motion.div className={className} {...props}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      transition={{ delay, duration: 0.32, ease: "easeOut" }}
      variants={revealVariants[variant]}
      viewport={{ once: true, amount: 0.22 }}
      whileInView="visible"
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function MotionStagger({
  children,
  className,
  ...props
}: MotionDivProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <motion.div className={className} {...props}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      variants={staggerVariants}
      viewport={{ once: true, amount: 0.18 }}
      whileInView="visible"
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function MotionItem({ children, className, ...props }: MotionDivProps) {
  return (
    <motion.div className={className} variants={itemVariants} {...props}>
      {children}
    </motion.div>
  );
}

export function MotionHoverCard({
  children,
  className,
  ...props
}: MotionDivProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn("will-change-transform", className)}
      transition={{ duration: 0.22, ease: "easeOut" }}
      whileHover={reduceMotion ? undefined : { y: -4, scale: 1.01 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.4,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 top-0 z-50 h-px origin-left bg-primary-accent"
      style={{ scaleX, width: "100%" }}
    />
  );
}

export function ScrollParallax({
  children,
  className,
  offset = 48,
}: MotionDivProps & { offset?: number }) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, offset]);

  return (
    <motion.div className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}
