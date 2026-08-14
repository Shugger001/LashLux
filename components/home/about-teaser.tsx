import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import {
  DirectionsAddress,
  DirectionsButton,
} from "@/components/layout/directions-link";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { SITE } from "@/lib/constants";

export function AboutTeaser() {
  return (
    <section className="section-pad">
      <div className="container-page grid items-center gap-7 lg:grid-cols-2 lg:gap-16">
        <FadeIn>
          <div className="frame-lux">
            <div className="frame-lux-inner relative aspect-[4/5] w-full overflow-hidden">
              <Image
                src="/images/hero-lashes.jpg"
                alt="Finished volume eyelash extensions at Lash Lux"
                fill
                className="object-cover object-[center_28%]"
                sizes="(max-width:1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent" />
            </div>
          </div>
        </FadeIn>
        <FadeIn delay={0.08}>
          <span className="eyebrow">The lash studio</span>
          <h2 className="mt-3 font-editorial text-3xl text-ink sm:mt-4 sm:text-5xl lg:text-6xl">
            Eyelash fixing, done with care.
          </h2>
          <p className="mt-3 font-script text-3xl text-rose sm:mt-4 sm:text-5xl">
            {SITE.slogan}
          </p>
          <div className="mt-4 h-px w-14 bg-gradient-to-r from-[#c9a27e] to-transparent sm:mt-5 sm:w-16" />
          <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground sm:mt-6 sm:text-base sm:leading-8">
            Lash Lux is a professional eyelash fixing studio specializing in
            classic, hybrid, volume, and mega volume extensions, plus safe
            removals and aftercare. Premium products, gentle technique, and
            results that last.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
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
            <DirectionsButton size="md" />
          </div>
          <div className="mt-8 text-sm tracking-wide text-muted-foreground">
            <DirectionsAddress />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
