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
        className="object-cover object-[center_30%] sm:object-[center_28%]"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/65 to-ink/35" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/40" />

      <div className="container-page relative flex min-h-[100svh] flex-col justify-end pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-24 sm:pb-14 sm:pt-28 lg:pb-16">
        <div className="max-w-2xl text-cream">
          {/* Header already shows brand on mobile — keep mark light here */}
          <div className="mb-5 hidden items-center gap-3 sm:mb-7 sm:flex">
            <BrandLogo size="lg" className="border-[#c9a27e] bg-white/95 shadow-soft" />
            <div>
              <p className="font-display text-xl font-bold tracking-[0.22em] sm:text-2xl">
                LASH<span className="text-rose-gold">LUX</span>
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-cream/60">
                Eyelash fixing · Lash extensions
              </p>
            </div>
          </div>

          <p className="font-script text-[2.75rem] leading-none text-[#f0d2b8] sm:text-5xl lg:text-6xl">
            {SITE.slogan}
          </p>

          <h1 className="mt-4 max-w-xl font-display text-[1.85rem] font-semibold leading-[1.1] tracking-tight text-cream sm:mt-5 sm:text-5xl lg:text-6xl">
            Professional eyelash fixing, classic to mega volume.
          </h1>

          <p className="mt-3 max-w-lg text-sm leading-6 text-cream/75 sm:mt-4 sm:text-base sm:leading-7">
            Soft, custom lash sets mapped to your eye shape. Book a full set, fill,
            or safe removal at Old Ashongman.
          </p>

          <div className="mt-6 flex w-full flex-col gap-3 sm:mt-9 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
            <Button asChild size="lg" className="w-full pr-2 sm:w-auto">
              <Link href="/book" className="inline-flex w-full items-center justify-center gap-3 sm:w-auto">
                Book eyelash fixing
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink/10">
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </span>
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full border-cream/35 text-cream hover:bg-cream/10 hover:text-cream sm:w-auto"
            >
              <a href={SITE.whatsapp} target="_blank" rel="noreferrer">
                WhatsApp to book
              </a>
            </Button>
          </div>

          <p className="mt-5 text-[10px] uppercase tracking-[0.16em] text-cream/55 sm:mt-7 sm:text-[11px] sm:tracking-[0.18em]">
            {SITE.policy}
          </p>
        </div>
      </div>
    </section>
  );
}
