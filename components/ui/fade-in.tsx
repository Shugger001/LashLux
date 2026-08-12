"use client";

import { motion, useReducedMotion } from "framer-motion";

export function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{
        duration: 0.7,
        ease: [0.32, 0.72, 0, 1],
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
