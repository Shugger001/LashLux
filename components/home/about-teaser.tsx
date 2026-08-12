import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { SITE } from "@/lib/constants";

export function AboutTeaser() {
  return (
    <section className="section-pad">
      <div className="container-page grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <FadeIn>
          <div className="frame-lux">
            <div className="frame-lux-inner relative aspect-[4/5] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1735151226446-1d364b4adc2f?w=1200&q=80"
                alt="Lash artist applying eyelash extensions"
                fill
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent" />
            </div>
          </div>
        </FadeIn>
        <FadeIn delay={0.08}>
          <span className="eyebrow">The lash studio</span>
          <h2 className="mt-4 font-editorial text-4xl text-ink sm:text-5xl lg:text-6xl">
            Eyelash fixing, done with care.
          </h2>
          <p className="mt-4 font-script text-4xl text-rose sm:text-5xl">{SITE.slogan}</p>
          <div className="mt-5 h-px w-16 bg-gradient-to-r from-[#c9a27e] to-transparent" />
          <p className="mt-6 max-w-md text-base leading-8 text-muted-foreground">
            Lash Lux is a professional eyelash fixing studio specializing in
            classic, hybrid, volume, and mega volume extensions, plus safe
            removals and aftercare. Premium products, gentle technique, and
            results that last.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="pr-2">
              <Link href="/about" className="inline-flex items-center gap-3">
                Our story
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink/10 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-px">
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </span>
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/book">Book fixing</Link>
            </Button>
          </div>
          <p className="mt-8 text-sm tracking-wide text-muted-foreground">{SITE.address}</p>
        </FadeIn>
      </div>
    </section>
  );
}
