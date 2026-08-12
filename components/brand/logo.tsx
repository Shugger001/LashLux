import Image from "next/image";

import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

const LOGO_SRC = "/images/lash-lux-logo.png";
const LOGO_WIDTH = 1024;
const LOGO_HEIGHT = 682;

const LOGO_HEIGHT_CLASS = {
  sm: "h-9 w-auto",
  md: "h-12 w-auto sm:h-14",
  lg: "h-20 w-auto sm:h-24",
  nav: "h-10 w-auto sm:h-11",
  footer: "h-16 w-auto sm:h-20",
} as const;

type LogoSize = keyof typeof LOGO_HEIGHT_CLASS;

/** Official Lash Lux logo lockup (monogram + wordmark + tagline). */
export function BrandLogo({
  className,
  size = "md",
  priority = false,
}: {
  className?: string;
  size?: LogoSize;
  priority?: boolean;
}) {
  return (
    <Image
      src={LOGO_SRC}
      alt={`${SITE.name} logo`}
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      priority={priority}
      className={cn(
        "object-contain object-left",
        LOGO_HEIGHT_CLASS[size],
        className
      )}
    />
  );
}

/** Header/footer brand lockup using the official logo artwork. */
export function BrandWordmark({
  className,
  size = "nav",
  priority = false,
}: {
  className?: string;
  size?: Extract<LogoSize, "nav" | "footer" | "md" | "lg">;
  priority?: boolean;
  /** @deprecated Logo artwork already includes the tagline. */
  showTagline?: boolean;
  /** @deprecated Logo colors are baked into the artwork. */
  light?: boolean;
}) {
  return (
    <BrandLogo
      size={size}
      priority={priority}
      className={cn("rounded-md", className)}
    />
  );
}
