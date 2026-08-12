"use client";

import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import type { GalleryItem } from "@/types";

export function GalleryPreview({ items }: { items: GalleryItem[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    skipSnaps: false,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="section-pad relative overflow-hidden bg-gradient-to-b from-blush/50 via-blush/20 to-transparent">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <FadeIn>
            <span className="eyebrow">Gallery</span>
            <h2 className="mt-4 font-editorial text-4xl text-ink sm:text-5xl lg:text-6xl">
              Recent work
            </h2>
            <p className="mt-3 max-w-md text-muted-foreground">
              Soft classics to dramatic mega volume, every set mapped to the eye.
            </p>
          </FadeIn>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Previous gallery images"
              onClick={scrollPrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Next gallery images"
              onClick={scrollNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-12 overflow-hidden" ref={emblaRef}>
          <div className="flex gap-5">
            {items.map((item) => (
              <div
                key={item.id}
                className="relative min-w-0 flex-[0_0_85%] sm:flex-[0_0_48%] lg:flex-[0_0_31%]"
              >
                <div className="frame-lux group">
                  <div className="frame-lux-inner overflow-hidden">
                    <div className="relative aspect-[3/4]">
                      <Image
                        src={item.image_url}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 transition-lux group-hover:scale-105"
                        sizes="(max-width:768px) 85vw, 30vw"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent p-5 pt-16">
                        <p className="font-display text-xl text-cream">{item.title}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#f0d2b8]">
                          {item.category}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <Button asChild variant="outline">
            <Link href="/gallery">View full gallery</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
