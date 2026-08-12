import { cn } from "@/lib/utils";

/** Circular Lash Lux mark inspired by the official flyer logo. */
export function BrandLogo({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const dim =
    size === "sm"
      ? "h-9 w-9 text-base"
      : size === "lg"
        ? "h-16 w-16 text-3xl"
        : "h-11 w-11 text-xl";

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border-2 border-[#c9a27e] bg-gradient-to-br from-[#fff8f6] to-[#f6e4e6] font-display font-bold text-ink shadow-[inset_0_0_0_1px_rgba(201,162,126,0.35)]",
        dim,
        className
      )}
      aria-hidden
    >
      <span className="relative leading-none">
        L
        <span className="absolute -bottom-1 left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-[#c9a27e] to-transparent" />
      </span>
    </span>
  );
}

export function BrandWordmark({
  className,
  showTagline = false,
  light = false,
}: {
  className?: string;
  showTagline?: boolean;
  light?: boolean;
}) {
  return (
    <span className={cn("inline-flex min-w-0 items-center gap-2 sm:gap-2.5", className)}>
      <BrandLogo size="sm" />
      <span className="min-w-0 leading-tight">
        <span
          className={cn(
            "block font-display text-base font-bold tracking-[0.08em] sm:text-lg",
            light ? "text-cream" : "text-ink"
          )}
        >
          LASH<span className="text-rose-gold">LUX</span>
        </span>
        {showTagline ? (
          <span
            className={cn(
              "block text-[10px] uppercase tracking-[0.18em]",
              light ? "text-cream/60" : "text-muted-foreground"
            )}
          >
            Eyelash fixing & extensions
          </span>
        ) : null}
      </span>
    </span>
  );
}
