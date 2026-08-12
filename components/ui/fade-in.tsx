"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Light entrance motion that never hides content.
 * (Opacity-based reveals were leaving blank gaps when whileInView/animate failed.)
 */
export function FadeIn({
  children,
  className,
  delay = 0,
  immediate = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Kept for call-site compatibility; motion always runs safely on mount/in-view. */
  immediate?: boolean;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  const transition = {
    duration: 0.55,
    ease: [0.32, 0.72, 0, 1] as const,
    delay,
  };

  if (immediate) {
    return (
      <motion.div
        className={className}
        initial={{ y: 12 }}
        animate={{ y: 0 }}
        transition={transition}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ y: 14 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
