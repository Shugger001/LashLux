"use client";

import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/types";

export function TestimonialsSlider({ items }: { items: Testimonial[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  return (
    <section className="section-pad">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <FadeIn className="max-w-2xl">
            <span className="eyebrow">Client love</span>
            <h2 className="mt-3 font-editorial text-3xl text-ink sm:mt-4 sm:text-5xl lg:text-6xl">
              Soft sets. Strong retention. Calm appointments.
            </h2>
          </FadeIn>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Previous testimonial"
              onClick={scrollPrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Next testimonial"
              onClick={scrollNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-7 overflow-hidden sm:mt-12" ref={emblaRef}>
          <div className="flex gap-3 sm:gap-5">
            {items.map((item) => (
              <blockquote
                key={item.id}
                className="min-w-0 flex-[0_0_88%] sm:flex-[0_0_48%] lg:flex-[0_0_32%]"
              >
                <div className="frame-lux h-full">
                  <div className="frame-lux-inner flex h-full flex-col p-5 sm:p-8">
                    <p
                      className="font-script text-4xl leading-none text-[#c9a27e]/70 sm:text-5xl"
                      aria-hidden
                    >
                      “
                    </p>
                    <div
                      className="mt-2 flex gap-1"
                      aria-label={`${item.rating} out of 5 stars`}
                    >
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-3.5 w-3.5 fill-[#c9a27e] text-[#c9a27e]"
                          aria-hidden
                        />
                      ))}
                    </div>
                    <p className="mt-4 flex-1 font-editorial text-lg leading-relaxed text-ink sm:mt-5 sm:text-[1.35rem]">
                      {item.content}
                    </p>
                    <footer className="mt-6 border-t border-[#c9a27e]/20 pt-4 sm:mt-8 sm:pt-5">
                      <p className="font-display text-sm tracking-wide text-ink">
                        {item.client_name}
                      </p>
                      {item.service_used ? (
                        <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
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

        {items.length > 1 ? (
          <div
            className="mt-5 flex justify-center gap-2 sm:mt-8"
            role="tablist"
            aria-label="Testimonial slides"
          >
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selectedIndex === index}
                aria-label={`Show testimonial ${index + 1}`}
                className={cn(
                  "h-2 rounded-full transition-all focus-ring",
                  selectedIndex === index
                    ? "w-6 bg-rose-deep"
                    : "w-2 bg-[#c9a27e]/40 hover:bg-[#c9a27e]/70"
                )}
                onClick={() => scrollTo(index)}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
