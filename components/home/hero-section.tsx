import Image from "next/image";
import Link from "next/link";

import { BrandLogo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { SITE } from "@/lib/constants";

export function HeroSection() {
  return (
    <section className="relative min-h-[min(92vh,900px)] overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=1800&q=80"
        alt="Close-up of luxury lash extensions"
        fill
        priority
        className="object-cover object-[center_30%]"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/50 to-ink/20" />
      <div
        className="pointer-events-none absolute -left-10 top-0 h-48 w-48 opacity-40 sm:h-64 sm:w-64"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(201,162,126,0.55), transparent 70%)",
        }}
        aria-hidden
      />

      <div className="container-page relative flex min-h-[min(92vh,900px)] flex-col justify-end pb-16 pt-28 sm:pb-20 lg:justify-center lg:pb-0">
        <FadeIn className="max-w-xl text-cream">
          <div className="mb-6 flex items-center gap-3">
            <BrandLogo size="md" className="border-[#c9a27e] bg-white/90" />
            <p className="font-display text-sm font-bold tracking-[0.22em] text-cream/90">
              LASH<span className="text-[#e8c4a8]">LUX</span>
            </p>
          </div>
          <p className="font-script text-4xl text-[#f0d2b8] sm:text-5xl">
            {SITE.slogan}
          </p>
          <h1 className="mt-4 max-w-lg font-display text-4xl font-semibold leading-tight tracking-tight text-cream sm:text-5xl lg:text-6xl">
            Luxury in every lash.
          </h1>
          <p className="mt-4 max-w-md text-sm text-cream/75 sm:text-base">
            Classic, hybrid, volume, and mega volume — custom looks that enhance,
            elevate, and empower.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-rose-gold text-ink hover:opacity-95">
              <Link href="/book">Book your lash experience</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-cream/40 bg-transparent text-cream hover:bg-cream/10 hover:text-cream"
            >
              <a href={SITE.whatsapp} target="_blank" rel="noreferrer">
                DM to book
              </a>
            </Button>
          </div>
          <p className="mt-6 text-xs uppercase tracking-[0.16em] text-cream/55">
            {SITE.policy}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
