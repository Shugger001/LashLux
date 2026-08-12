import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { SITE } from "@/lib/constants";

export function AboutTeaser() {
  return (
    <section className="section-pad">
      <div className="container-page grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <FadeIn>
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
            <Image
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1000&q=80"
              alt="Lash Lux artist preparing a client"
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 50vw"
            />
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-rose">
            The studio
          </p>
          <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
            Luxury in every lash.
          </h2>
          <p className="mt-3 font-script text-3xl text-rose">{SITE.slogan}</p>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            At Lash Lux, every set is customized to your eye shape, lifestyle, and
            desired glam — from natural classic to bold mega volume. Premium
            products, gentle technique, and results that last.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="bg-rose-gold text-ink hover:opacity-95">
              <Link href="/about">Our story</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">Studio details</Link>
            </Button>
          </div>
          <p className="mt-8 text-sm text-muted-foreground">{SITE.address}</p>
        </FadeIn>
      </div>
    </section>
  );
}
