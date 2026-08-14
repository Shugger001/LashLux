import { MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

type ButtonVariant = React.ComponentProps<typeof Button>["variant"];
type ButtonSize = React.ComponentProps<typeof Button>["size"];

/** Primary CTA that opens Google Maps to the studio pin. */
export function DirectionsButton({
  variant = "outline",
  size = "lg",
  className,
  label = "Get directions",
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  label?: string;
}) {
  return (
    <Button asChild variant={variant} size={size} className={className}>
      <a href={SITE.mapsUrl} target="_blank" rel="noreferrer">
        <MapPin className="h-4 w-4" aria-hidden />
        {label}
      </a>
    </Button>
  );
}

/** Address line that also opens directions. */
export function DirectionsAddress({
  className,
  showIcon = true,
}: {
  className?: string;
  showIcon?: boolean;
}) {
  return (
    <a
      href={SITE.mapsUrl}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "inline-flex items-start gap-2 transition-colors hover:text-rose-deep focus-ring rounded-sm",
        className
      )}
    >
      {showIcon ? (
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#c9a27e]" aria-hidden />
      ) : null}
      <span>
        {SITE.address}
        <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Get directions
        </span>
      </span>
    </a>
  );
}
