"use client";

/**
 * Reusable Framer Motion wrappers. Used sparingly across the site —
 * performance matters more than flair. All entrance animations use
 * `whileInView` so they fire on scroll and only once.
 */
import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const viewport = { once: true, margin: "-80px" } as const;

const fadeInVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const slideInLeftVariants: Variants = {
  hidden: { opacity: 0, x: -24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

type WrapperProps = {
  children: ReactNode;
  className?: string;
  /** Delay in seconds before the animation starts. */
  delay?: number;
};

export function FadeIn({ children, className, delay = 0 }: WrapperProps) {
  return (
    <motion.div
      className={className}
      variants={fadeInVariants}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

export function SlideInLeft({ children, className, delay = 0 }: WrapperProps) {
  return (
    <motion.div
      className={className}
      variants={slideInLeftVariants}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

/** Parent that staggers the entrance of its `StaggerItem` children. */
export function StaggerContainer({ children, className }: WrapperProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={{ show: { transition: { staggerChildren: 0.08 } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: WrapperProps) {
  return (
    <motion.div className={className} variants={staggerItemVariants}>
      {children}
    </motion.div>
  );
}
