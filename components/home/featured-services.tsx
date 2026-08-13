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
    image: "/services/classic.jpg",
  },
  {
    label: "Hybrid",
    image: "/services/hybrid.jpg",
  },
  {
    label: "Volume",
    image: "/services/volume.jpg",
  },
  {
    label: "Mega",
    image: "/services/mega-volume.jpg",
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

        <FadeIn delay={0.05} className="mt-10 lg:mt-14">
          <div className="relative mx-auto max-w-lg lg:max-w-md">
            <div
              className="absolute -inset-6 rounded-full opacity-70 blur-3xl sm:-inset-8"
              style={{
                background:
                  "radial-gradient(circle, rgba(240,210,176,0.4), transparent 65%)",
              }}
              aria-hidden
            />
            <div className="relative grid grid-cols-2 gap-4 sm:gap-6">
              {STYLE_CIRCLES.map((item, index) => (
                <div
                  key={item.label}
                  className={`group relative ${index % 2 === 1 ? "mt-6 sm:mt-10" : ""}`}
                >
                  <div className="relative aspect-square overflow-hidden rounded-full border-[3px] border-[#c9a27e]/60 p-1 shadow-[0_22px_48px_-24px_rgba(58,42,44,0.5)]">
                    <div className="relative h-full w-full overflow-hidden rounded-full">
                      <Image
                        src={item.image}
                        alt={`${item.label} lash look`}
                        fill
                        className="object-cover transition-transform duration-700 transition-lux group-hover:scale-110"
                        sizes="(max-width: 640px) 42vw, 220px"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/75 to-transparent px-3 pb-4 pt-10 text-center sm:pb-5 sm:pt-12">
                        <p className="font-display text-xs font-semibold tracking-[0.14em] text-cream sm:text-sm">
                          {item.label}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-8 text-center font-script text-3xl text-rose sm:mt-10 sm:text-4xl">
              Healthy lashes, happy you.
            </p>
          </div>
        </FadeIn>

        <div className="mt-10 grid items-start gap-8 lg:mt-14">
          <FadeIn>
            <div className="frame-lux">
              <div className="frame-lux-inner overflow-hidden">
                <div className="bg-rose-gold px-6 py-4 text-center">
                  <p className="font-display text-sm font-bold uppercase tracking-[0.24em] text-ink">
                    Services
                  </p>
                </div>
                <ul className="grid grid-cols-1 divide-y divide-[#c9a27e]/15 sm:grid-cols-2 sm:divide-y-0">
                  {featured.map((service) => (
                    <li
                      key={service.id}
                      className="border-[#c9a27e]/15 sm:border-b sm:odd:border-r"
                    >
                      <Link
                        href={`/book?service=${service.id}`}
                        className="group flex h-full items-start justify-between gap-3 px-4 py-4 transition-all duration-300 transition-lux hover:bg-gradient-to-r hover:from-blush/50 hover:to-transparent sm:gap-4 sm:px-6 sm:py-5"
                      >
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[#c9a27e]/25 sm:h-16 sm:w-16">
                          <Image
                            src={service.image_url ?? "/services/volume.jpg"}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-display text-base text-ink transition-colors group-hover:text-rose-deep sm:text-lg">
                            {service.name}
                          </p>
                          <p className="mt-1.5 line-clamp-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                            {service.description}
                          </p>
                          <p className="mt-2.5 text-[11px] uppercase tracking-[0.16em] text-[#c9a27e]">
                            {formatDuration(service.duration)}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="font-display text-sm font-semibold text-rose-deep sm:text-base">
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
