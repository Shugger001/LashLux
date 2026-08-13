import { Clock, Heart, Leaf, Shield } from "lucide-react";

import { VALUE_PROPS } from "@/lib/constants";

const ICONS = {
  shield: Shield,
  leaf: Leaf,
  clock: Clock,
  heart: Heart,
} as const;

export function ValuePropsBar() {
  return (
    <section className="relative border-y border-[#c9a27e]/20 bg-white/65 backdrop-blur-sm">
      <div className="container-page grid grid-cols-2 gap-x-3 gap-y-5 py-6 sm:grid-cols-4 sm:gap-6 sm:py-12">
        {VALUE_PROPS.map((item) => {
          const Icon = ICONS[item.icon];
          return (
            <div key={item.key} className="text-center">
              <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#c9a27e]/45 bg-gradient-to-br from-white to-blush text-[#c9a27e] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_24px_-16px_rgba(58,42,44,0.35)] sm:h-14 sm:w-14">
                <Icon className="h-5 w-5" strokeWidth={1.25} aria-hidden />
              </span>
              <p className="mt-3 text-[10px] font-semibold uppercase leading-snug tracking-[0.14em] text-ink sm:mt-4 sm:text-[11px] sm:tracking-[0.16em]">
                {item.label}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
