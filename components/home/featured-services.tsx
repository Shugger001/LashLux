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
    image: "/images/hero-lashes.jpg",
  },
  {
    label: "Hybrid",
    image: "/gallery/look-01.png",
  },
  {
    label: "Volume",
    image: "/gallery/look-02.png",
  },
  {
    label: "Mega",
    image: "/images/hero-lashes.jpg",
  },
] as const;

export function FeaturedServices({ services }: { services: Service[] }) {
  const featured = services.slice(0, 6);

  return (
    <section className="pb-14 pt-10 sm:pb-24 sm:pt-16 lg:pb-28 lg:pt-20">
      <div className="container-page">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Eyelash fixing menu</span>
          <h2 className="mt-5 font-editorial text-4xl text-ink sm:text-5xl lg:text-6xl">
            Enhance. Elevate. Empower.
          </h2>
          <div className="mx-auto mt-5 h-px w-16 bg-gradient-to-r from-transparent via-[#c9a27e] to-transparent" />
          <p className="mt-5 text-muted-foreground">
            Classic, hybrid, volume, and mega volume fixing, looks tailored to your eyes.
          </p>
        </FadeIn>

        <div className="mt-10 grid items-start gap-8 lg:mt-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <FadeIn>
            <div className="frame-lux">
              <div className="frame-lux-inner overflow-hidden">
                <div className="bg-rose-gold px-6 py-4 text-center">
                  <p className="font-display text-sm font-bold uppercase tracking-[0.24em] text-ink">
                    Services
                  </p>
                </div>
                <ul className="divide-y divide-[#c9a27e]/15">
                  {featured.map((service) => (
                    <li key={service.id}>
                      <Link
                        href={`/book?service=${service.id}`}
                        className="group flex items-start justify-between gap-4 px-5 py-5 transition-all duration-300 transition-lux hover:bg-gradient-to-r hover:from-blush/50 hover:to-transparent sm:px-6"
                      >
                        <div>
                          <p className="font-display text-lg text-ink transition-colors group-hover:text-rose-deep">
                            {service.name}
                          </p>
                          <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
                            {service.description}
                          </p>
                          <p className="mt-2.5 text-[11px] uppercase tracking-[0.16em] text-[#c9a27e]">
                            {formatDuration(service.duration)}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="font-display text-base font-semibold text-rose-deep">
                            {formatCurrency(Number(service.price))}
                          </p>
                          <ArrowRight className="ml-auto mt-3 h-4 w-4 text-[#c9a27e] opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.08} className="hidden lg:block lg:pt-4">
            <div className="relative mx-auto max-w-md">
              <div
                className="absolute -inset-8 rounded-full opacity-70 blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle, rgba(240,210,176,0.4), transparent 65%)",
                }}
                aria-hidden
              />
              <div className="relative grid grid-cols-2 gap-5 sm:gap-6">
                {STYLE_CIRCLES.map((item, index) => (
                  <div
                    key={item.label}
                    className={`group relative ${index % 2 === 1 ? "mt-10" : ""}`}
                  >
                    <div className="relative aspect-square overflow-hidden rounded-full border-[3px] border-[#c9a27e]/60 p-1 shadow-[0_22px_48px_-24px_rgba(58,42,44,0.5)]">
                      <div className="relative h-full w-full overflow-hidden rounded-full">
                        <Image
                          src={item.image}
                          alt={`${item.label} lash look`}
                          fill
                          className="object-cover transition-transform duration-700 transition-lux group-hover:scale-110"
                          sizes="220px"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/75 to-transparent px-3 pb-5 pt-12 text-center">
                          <p className="font-display text-sm font-semibold tracking-[0.14em] text-cream">
                            {item.label}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-10 text-center font-script text-4xl text-rose">
                Healthy lashes, happy you.
              </p>
            </div>
          </FadeIn>
        </div>

        <div className="mt-10 text-center sm:mt-12">
          <Button asChild variant="outline">
            <Link href="/services">Explore full menu</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
