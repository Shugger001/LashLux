import { Clock, Heart, Leaf, Shield } from "lucide-react";

import { FadeIn } from "@/components/ui/fade-in";
import { VALUE_PROPS } from "@/lib/constants";

const ICONS = {
  shield: Shield,
  leaf: Leaf,
  clock: Clock,
  heart: Heart,
} as const;

export function ValuePropsBar() {
  return (
    <section className="relative border-y border-[#c9a27e]/20 bg-white/55">
      <div className="container-page grid grid-cols-2 gap-8 py-12 sm:grid-cols-4 sm:gap-6 sm:py-14">
        {VALUE_PROPS.map((item, index) => {
          const Icon = ICONS[item.icon];
          return (
            <FadeIn key={item.key} delay={index * 0.06} className="text-center">
              <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#c9a27e]/40 bg-gradient-to-br from-white to-blush text-[#c9a27e] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
              </span>
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink sm:text-xs">
                {item.label}
              </p>
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
}
