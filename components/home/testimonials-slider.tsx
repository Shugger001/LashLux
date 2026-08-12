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
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-rose">
            Client love
          </p>
          <h2 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
            Soft sets. Strong retention. Calm appointments.
          </h2>
        </FadeIn>

        <div className="mt-10 overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {items.map((item) => (
              <blockquote
                key={item.id}
                className="min-w-0 flex-[0_0_90%] rounded-xl border border-border bg-card p-6 sm:flex-[0_0_48%] lg:flex-[0_0_32%]"
              >
                <div className="flex gap-1" aria-label={`${item.rating} out of 5 stars`}>
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-rose text-rose"
                      aria-hidden
                    />
                  ))}
                </div>
                <p className="mt-4 text-base leading-relaxed text-foreground">
                  “{item.content}”
                </p>
                <footer className="mt-6">
                  <p className="font-medium">{item.client_name}</p>
                  {item.service_used ? (
                    <p className="text-sm text-muted-foreground">
                      {item.service_used}
                    </p>
                  ) : null}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
