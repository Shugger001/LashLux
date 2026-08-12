import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { BrandLogo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/constants";

export function HeroSection() {
  return (
    <section className="hero-flush relative min-h-[100dvh] overflow-hidden">
      <Image
        src="/images/hero-lashes.jpg"
        alt="Close-up of professional eyelash extensions after fixing"
        fill
        priority
        className="object-cover object-[center_35%]"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/60 to-ink/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/30" />

      <div
        className="pointer-events-none absolute -left-16 -top-10 h-72 w-72 rounded-full opacity-50 blur-2xl"
        style={{
          background:
            "radial-gradient(circle, rgba(232,196,168,0.55), transparent 70%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -right-10 h-80 w-80 rounded-full opacity-40 blur-2xl"
        style={{
          background:
            "radial-gradient(circle, rgba(201,137,144,0.45), transparent 70%)",
        }}
        aria-hidden
      />

      <div className="container-page relative flex min-h-[100dvh] flex-col justify-end pb-16 pt-28 sm:pb-20 lg:pb-24">
        <div className="max-w-2xl text-cream">
          <div className="mb-7 flex items-center gap-3">
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

          <p className="font-script text-5xl leading-none text-[#f0d2b8] sm:text-6xl">
            {SITE.slogan}
          </p>

          <h1 className="mt-5 max-w-xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-cream sm:text-5xl lg:text-6xl">
            Professional eyelash fixing — classic to mega volume.
          </h1>

          <p className="mt-4 max-w-lg text-sm text-cream/75 sm:text-base">
            Soft, custom lash sets mapped to your eye shape. Book a full set, fill,
            or safe removal at Old Ashongman.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="pr-2">
              <Link href="/book" className="inline-flex items-center gap-3">
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
              className="border-cream/35 text-cream hover:bg-cream/10 hover:text-cream"
            >
              <a href={SITE.whatsapp} target="_blank" rel="noreferrer">
                DM to book
              </a>
            </Button>
          </div>

          <p className="mt-7 text-[11px] uppercase tracking-[0.18em] text-cream/55">
            {SITE.policy}
          </p>
        </div>
      </div>
    </section>
  );
}
