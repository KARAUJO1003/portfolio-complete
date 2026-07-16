"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import type { MotionValue, Variants } from "motion/react";
import { Children, useRef } from "react";
import type { ComponentProps, ReactNode } from "react";
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

type MotionDivProps = ComponentProps<typeof motion.div>;

type MotionRevealProps = MotionDivProps & {
  delay?: number;
  variant?: keyof typeof revealVariants;
};

type MotionScrollRevealProps = MotionDivProps & {
  blur?: number;
  y?: number;
};

type MotionScrollStackProps = MotionDivProps & {
  blur?: number;
  itemClassName?: string;
  stagger?: number;
  visibleWindow?: number;
  y?: number;
};

type MotionStickyStackProps = MotionDivProps & {
  itemClassName?: string;
  topOffset?: string;
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

export function MotionScrollReveal({
  blur = 2,
  children,
  className,
  style,
  y = 34,
  ...props
}: MotionScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 92%", "end 24%"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.45,
  });
  const opacity = useTransform(smoothProgress, [0, 0.32], [0.18, 1]);
  const translateY = useTransform(smoothProgress, [0, 0.32], [y, 0]);
  const scale = useTransform(smoothProgress, [0, 0.32], [0.975, 1]);
  const filter = useTransform(
    smoothProgress,
    [0, 0.32],
    [`blur(${blur}px)`, "blur(0px)"],
  );

  if (reduceMotion) {
    return (
      <motion.div className={className} ref={ref} style={style} {...props}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn("will-change-transform", className)}
      ref={ref}
      style={{ ...style, filter, opacity, scale, y: translateY }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function MotionScrollStack({
  blur = 0,
  children,
  className,
  itemClassName,
  stagger = 0.08,
  style,
  visibleWindow = 0.24,
  y = 34,
  ...props
}: MotionScrollStackProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 92%", "end 22%"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 22,
    mass: 0.45,
  });
  const items = Children.toArray(children);

  return (
    <motion.div className={className} ref={ref} style={style} {...props}>
      {items.map((child, index) => (
        <MotionScrollStackItem
          blur={blur}
          className={itemClassName}
          index={index}
          key={index}
          progress={smoothProgress}
          reduceMotion={Boolean(reduceMotion)}
          stagger={stagger}
          total={items.length}
          visibleWindow={visibleWindow}
          y={y}
        >
          {child}
        </MotionScrollStackItem>
      ))}
    </motion.div>
  );
}

function MotionScrollStackItem({
  blur,
  children,
  className,
  index,
  progress,
  reduceMotion,
  stagger,
  total,
  visibleWindow,
  y,
}: {
  blur: number;
  children: ReactNode;
  className?: string;
  index: number;
  progress: MotionValue<number>;
  reduceMotion: boolean;
  stagger: number;
  total: number;
  visibleWindow: number;
  y: number;
}) {
  const normalizedStagger = total > 8 ? Math.min(stagger, 0.045) : stagger;
  const start = Math.min(index * normalizedStagger, 0.72);
  const end = Math.min(start + visibleWindow, 0.96);
  const opacity = useTransform(progress, [start, end], [0.12, 1]);
  const translateY = useTransform(progress, [start, end], [y, 0]);
  const scale = useTransform(progress, [start, end], [0.965, 1]);
  const filter = useTransform(progress, [start, end], [`blur(${blur}px)`, "blur(0px)"]);

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={cn("will-change-transform", className)} style={{ filter, opacity, scale, y: translateY }}>
      {children}
    </motion.div>
  );
}

export function MotionStickyStack({
  children,
  className,
  itemClassName,
  style,
  topOffset = "96px",
  ...props
}: MotionStickyStackProps) {
  const reduceMotion = useReducedMotion();
  const items = Children.toArray(children);

  return (
    <motion.div className={className} style={style} {...props}>
      {items.map((child, index) => (
        <motion.div
          className={cn("sticky", itemClassName)}
          key={index}
          style={{
            top: `calc(${topOffset} + ${Math.min(index, 5) * 10}px)`,
            zIndex: index + 1,
          }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
          initial={reduceMotion ? undefined : { opacity: 0.42, scale: 0.975, y: 30 }}
          viewport={{ amount: 0.42, once: false }}
        >
          {child}
        </motion.div>
      ))}
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
