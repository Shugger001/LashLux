import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { BrandLogo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/constants";

export function HeroSection() {
  return (
    <section className="hero-flush relative min-h-[100svh] overflow-hidden">
      <Image
        src="/images/hero-lashes.jpg"
        alt="Close-up of professional eyelash extensions after fixing"
        fill
        priority
        className="object-cover object-[center_30%] sm:object-[center_28%] motion-safe:animate-hero-ken"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/92 via-ink/68 to-ink/28" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/88 via-ink/25 to-ink/45" />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#1a1214] to-transparent"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute -left-16 -top-10 h-72 w-72 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(232,196,168,0.55), transparent 70%)",
        }}
        aria-hidden
      />

      <div className="container-page relative flex min-h-[100svh] flex-col justify-end pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-24 sm:pb-16 sm:pt-28 lg:pb-20">
        <div className="max-w-2xl text-cream">
          <div className="mb-5 hidden sm:mb-8 sm:block">
            <BrandLogo
              size="lg"
              priority
              className="rounded-xl bg-cream/95 p-2 shadow-soft"
            />
          </div>

          <p className="font-script text-[2.85rem] leading-none text-[#f0d2b8] sm:text-5xl lg:text-6xl">
            {SITE.slogan}
          </p>
          <div className="mt-4 h-px w-16 bg-gradient-to-r from-[#c9a27e] to-transparent sm:mt-5 sm:w-24" />

          <h1 className="mt-5 max-w-xl font-display text-[1.9rem] font-semibold leading-[1.08] tracking-tight text-cream sm:mt-6 sm:text-5xl lg:text-6xl">
            Professional eyelash fixing, classic to mega volume.
          </h1>

          <p className="mt-4 max-w-md text-sm leading-6 text-cream/72 sm:mt-5 sm:text-base sm:leading-7">
            Soft, custom lash sets mapped to your eye shape. Book a full set, fill,
            or safe removal at Old Ashongman.
          </p>

          <div className="mt-7 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
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
              className="w-full border-cream/40 bg-white/5 text-cream backdrop-blur-sm hover:bg-cream/10 hover:text-cream sm:w-auto"
            >
              <a href={SITE.whatsapp} target="_blank" rel="noreferrer">
                WhatsApp to book
              </a>
            </Button>
          </div>

          <p className="mt-6 text-[10px] uppercase tracking-[0.18em] text-cream/50 sm:mt-8 sm:text-[11px]">
            {SITE.policy}
          </p>
        </div>
      </div>
    </section>
  );
}
