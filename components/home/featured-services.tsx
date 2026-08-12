import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { formatCurrency, formatDuration } from "@/lib/utils";
import type { Service } from "@/types";

export function FeaturedServices({ services }: { services: Service[] }) {
  const featured = services.slice(0, 4);

  return (
    <section className="section-pad">
      <div className="container-page">
        <FadeIn className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-rose">
            Services
          </p>
          <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
            Enhance. Elevate. Empower.
          </h2>
          <p className="mt-4 text-muted-foreground">
            From natural classic to bold mega volume — custom looks tailored to you.
          </p>
        </FadeIn>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((service, index) => (
            <FadeIn key={service.id} delay={index * 0.08}>
              <article className="group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
                  <Image
                    src={
                      service.image_url ??
                      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&q=80"
                    }
                    alt={service.name}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    sizes="(max-width:768px) 100vw, 25vw"
                  />
                </div>
                <div className="mt-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-2xl text-ink">
                      {service.name}
                    </h3>
                    <p className="text-sm font-medium text-rose">
                      {formatCurrency(Number(service.price))}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatDuration(service.duration)}
                  </p>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>

        <div className="mt-10">
          <Button asChild variant="outline">
            <Link href="/services">Explore all services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
