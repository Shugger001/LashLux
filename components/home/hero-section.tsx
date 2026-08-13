import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { BrandLogo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/constants";

export function HeroSection() {
  return (
    <section className="hero-flush relative min-h-[88svh] overflow-hidden sm:min-h-[100svh]">
      <Image
        src="/images/hero-lashes.jpg"
        alt="Close-up of volume eyelash extensions on a Black woman"
        fill
        priority
        className="object-cover object-[center_28%] sm:object-[center_32%] motion-safe:animate-hero-ken"
        sizes="100vw"
      />
      {/* Keep copy readable over the photo */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/35" />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-ink via-ink/75 to-transparent"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute -left-16 -top-10 h-72 w-72 rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(232,196,168,0.45), transparent 70%)",
        }}
        aria-hidden
      />

      <div className="container-page relative flex min-h-[88svh] flex-col justify-end pb-[max(1rem,env(safe-area-inset-bottom))] pt-20 sm:min-h-[100svh] sm:pb-16 sm:pt-28 lg:pb-20">
        <div className="relative max-w-2xl text-cream">
          <div
            className="pointer-events-none absolute -inset-x-2 -inset-y-3 -z-10 rounded-[1.25rem] bg-ink/55 blur-[2px] sm:-inset-x-5 sm:-inset-y-6 sm:rounded-[1.75rem]"
            aria-hidden
          />

          <div className="mb-3 sm:mb-8">
            <BrandLogo
              size="md"
              priority
              className="rounded-xl bg-cream/95 p-1.5 shadow-soft sm:hidden"
            />
            <BrandLogo
              size="lg"
              priority
              className="hidden rounded-xl bg-cream/95 p-2 shadow-soft sm:block"
            />
          </div>

          <p className="font-script text-[2.35rem] leading-none text-[#f0d2b8] drop-shadow-[0_2px_12px_rgba(26,18,20,0.55)] sm:text-5xl lg:text-6xl">
            {SITE.slogan}
          </p>
          <div className="mt-3 h-px w-14 bg-gradient-to-r from-[#c9a27e] to-transparent sm:mt-5 sm:w-24" />

          <h1 className="mt-3.5 max-w-xl font-display text-[1.65rem] font-semibold leading-[1.08] tracking-tight text-cream drop-shadow-[0_2px_16px_rgba(26,18,20,0.65)] sm:mt-6 sm:text-5xl lg:text-6xl">
            Professional eyelash fixing, classic to mega volume.
          </h1>

          <p className="mt-3 max-w-md text-sm leading-5 text-cream/90 drop-shadow-[0_1px_10px_rgba(26,18,20,0.7)] sm:mt-5 sm:text-base sm:leading-7">
            Soft, custom lash sets mapped to your eye shape. Book a full set, fill,
            or safe removal at Old Ashongman.
          </p>

          <div className="mt-5 flex w-full flex-col gap-2.5 sm:mt-10 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
            <Button asChild size="lg" className="w-full pr-2 sm:w-auto">
              <Link
                href="/book"
                className="inline-flex w-full items-center justify-center gap-3 sm:w-auto"
              >
                Book eyelash fixing
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink/10 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-px">
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </span>
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full border-cream/50 bg-ink/40 text-cream backdrop-blur-sm hover:bg-ink/55 hover:text-cream sm:w-auto"
            >
              <a href={SITE.whatsapp} target="_blank" rel="noreferrer">
                WhatsApp to book
              </a>
            </Button>
          </div>

          <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-cream/70 sm:mt-8 sm:text-[11px]">
            {SITE.policy}
          </p>
        </div>
      </div>
    </section>
  );
}
