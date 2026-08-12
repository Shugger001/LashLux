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
    <section className="border-y border-border bg-card/70">
      <div className="container-page grid grid-cols-2 gap-6 py-10 sm:grid-cols-4 sm:gap-8">
        {VALUE_PROPS.map((item, index) => {
          const Icon = ICONS[item.icon];
          return (
            <FadeIn key={item.key} delay={index * 0.05} className="text-center">
              <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#c9a27e]/40 text-[#c9a27e]">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink sm:text-xs">
                {item.label}
              </p>
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
}
