import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { formatCurrency, formatDuration } from "@/lib/utils";
import type { Service } from "@/types";

const STYLE_CIRCLES = [
  {
    label: "Classic",
    image:
      "https://images.unsplash.com/photo-1583003879471-c8e003cdc6ea?w=600&q=80",
  },
  {
    label: "Hybrid",
    image:
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&q=80",
  },
  {
    label: "Volume",
    image:
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&q=80",
  },
  {
    label: "Mega",
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80",
  },
] as const;

export function FeaturedServices({ services }: { services: Service[] }) {
  const featured = services.slice(0, 6);

  return (
    <section className="section-pad">
      <div className="container-page">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Eyelash fixing menu</span>
          <h2 className="mt-5 font-display text-3xl text-ink sm:text-4xl lg:text-5xl">
            Enhance. Elevate. Empower.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Classic, hybrid, volume, and mega volume fixing — looks tailored to your eyes.
          </p>
        </FadeIn>

        <div className="mt-14 grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          {/* Flyer-style services panel */}
          <FadeIn>
            <div className="frame-lux">
              <div className="frame-lux-inner overflow-hidden">
                <div className="bg-rose-gold px-6 py-3 text-center">
                  <p className="font-display text-sm font-bold uppercase tracking-[0.22em] text-ink">
                    Services
                  </p>
                </div>
                <ul className="divide-y divide-border/80">
                  {featured.map((service) => (
                    <li key={service.id}>
                      <Link
                        href={`/book?service=${service.id}`}
                        className="group flex items-start justify-between gap-4 px-5 py-4 transition-colors duration-300 hover:bg-blush/40 sm:px-6"
                      >
                        <div>
                          <p className="font-display text-lg text-ink group-hover:text-rose-deep">
                            {service.name}
                          </p>
                          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                            {service.description}
                          </p>
                          <p className="mt-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                            {formatDuration(service.duration)}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-sm font-semibold text-rose-deep">
                            {formatCurrency(Number(service.price))}
                          </p>
                          <ArrowRight className="ml-auto mt-2 h-4 w-4 text-[#c9a27e] opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeIn>

          {/* Flyer-style circular look stack */}
          <FadeIn delay={0.1} className="lg:pt-6">
            <div className="relative mx-auto max-w-md">
              <div className="absolute -inset-6 rounded-full bg-gradient-to-br from-[#f0d2b0]/35 via-transparent to-[#c98990]/25 blur-2xl" aria-hidden />
              <div className="relative grid grid-cols-2 gap-5 sm:gap-6">
                {STYLE_CIRCLES.map((item, index) => (
                  <div
                    key={item.label}
                    className={`group relative ${index % 2 === 1 ? "mt-8 sm:mt-12" : ""}`}
                  >
                    <div className="relative aspect-square overflow-hidden rounded-full border-[3px] border-[#c9a27e]/55 shadow-[0_18px_40px_-24px_rgba(58,42,44,0.45)]">
                      <Image
                        src={item.image}
                        alt={`${item.label} lash look`}
                        fill
                        className="object-cover transition-transform duration-700 transition-lux group-hover:scale-105"
                        sizes="(max-width:768px) 45vw, 220px"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent px-3 pb-4 pt-10 text-center">
                        <p className="font-display text-sm font-semibold tracking-[0.12em] text-cream">
                          {item.label}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-center font-script text-3xl text-rose">
                Healthy lashes, happy you.
              </p>
            </div>
          </FadeIn>
        </div>

        <div className="mt-12 text-center">
          <Button asChild variant="outline">
            <Link href="/services">Explore full menu</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
