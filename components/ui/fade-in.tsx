"use client";

import { cn } from "@/lib/utils";

/**
 * Light entrance helper. Uses CSS so content never gets stuck invisible
 * or offset when scroll observers fail (common on mobile).
 */
export function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** @deprecated Kept for call-site compatibility. */
  immediate?: boolean;
}) {
  return (
    <div
      className={cn("motion-safe:animate-fade-up", className)}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
