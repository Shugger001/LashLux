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
    <section className="section-pad bg-secondary/40">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <FadeIn>
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-rose">
              Gallery
            </p>
            <h2 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
              Recent work
            </h2>
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

        <div className="mt-10 overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="relative min-w-0 flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_30%]"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 85vw, 30vw"
                  />
                </div>
                <p className="mt-3 font-display text-xl">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.category}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <Button asChild variant="outline">
            <Link href="/gallery">View full gallery</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
