"use client";

import { Star } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

import { FadeIn } from "@/components/ui/fade-in";
import type { Testimonial } from "@/types";

export function TestimonialsSlider({ items }: { items: Testimonial[] }) {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" });

  return (
    <section className="section-pad">
      <div className="container-page">
        <FadeIn className="max-w-2xl">
          <span className="eyebrow">Client love</span>
          <h2 className="mt-4 font-display text-3xl text-ink sm:text-4xl lg:text-5xl">
            Soft sets. Strong retention. Calm appointments.
          </h2>
        </FadeIn>

        <div className="mt-12 overflow-hidden" ref={emblaRef}>
          <div className="flex gap-5">
            {items.map((item) => (
              <blockquote
                key={item.id}
                className="min-w-0 flex-[0_0_90%] sm:flex-[0_0_48%] lg:flex-[0_0_32%]"
              >
                <div className="frame-lux h-full">
                  <div className="frame-lux-inner flex h-full flex-col p-6 sm:p-7">
                    <div
                      className="flex gap-1"
                      aria-label={`${item.rating} out of 5 stars`}
                    >
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-[#c9a27e] text-[#c9a27e]"
                          aria-hidden
                        />
                      ))}
                    </div>
                    <p className="mt-5 flex-1 text-base leading-relaxed text-foreground">
                      “{item.content}”
                    </p>
                    <footer className="mt-6 border-t border-border/70 pt-4">
                      <p className="font-medium text-ink">{item.client_name}</p>
                      {item.service_used ? (
                        <p className="text-sm text-muted-foreground">
                          {item.service_used}
                        </p>
                      ) : null}
                    </footer>
                  </div>
                </div>
              </blockquote>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
