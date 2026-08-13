import type { Metadata } from "next";
import Link from "next/link";
import { Droplets, Eye, Moon, Sparkles } from "lucide-react";

import { ServicesCatalog } from "@/components/services/services-catalog";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { LASH_CARE_TIPS, SITE } from "@/lib/constants";
import { getServices } from "@/lib/data";

export const metadata: Metadata = {
  title: "Eyelash Fixing Services",
  description:
    "Book eyelash fixing at Lash Lux, classic, hybrid, volume, mega volume, removal, and lash care in Old Ashongman.",
};

const careIcons = [Droplets, Sparkles, Eye, Moon];

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <section className="section-pad">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="eyebrow">Eyelash fixing menu</p>
            <h1 className="mt-5 text-balance font-editorial text-5xl text-ink sm:text-6xl lg:text-7xl">
              Choose your lash look.
            </h1>
            <div className="mt-5 h-px w-16 bg-gradient-to-r from-[#c9a27e] to-transparent" />
            <p className="mt-5 text-pretty text-base leading-8 text-muted-foreground sm:text-lg">
              From natural classic fixing to bold mega volume, every set starts
              with a consultation and is applied with care for your natural lashes.
            </p>
          </div>
          <div className="mt-12">
            <ServicesCatalog services={services} />
          </div>
        </div>
      </section>

      <section className="section-pad border-t border-[#c9a27e]/20 bg-gradient-to-b from-blush/40 to-transparent">
        <div className="container-page">
          <FadeIn className="max-w-2xl">
            <p className="eyebrow">Lash care</p>
            <h2 className="mt-5 text-balance font-editorial text-4xl text-ink sm:text-5xl">
              Keep your set looking fresh.
            </h2>
            <div className="mt-5 h-px w-16 bg-gradient-to-r from-[#c9a27e] to-transparent" />
          </FadeIn>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {LASH_CARE_TIPS.map((tip, index) => {
              const Icon = careIcons[index];
              return (
                <FadeIn key={tip.title} delay={index * 0.05}>
                  <article className="frame-lux h-full">
                    <div className="frame-lux-inner h-full p-6">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#c9a27e]/35 bg-gradient-to-br from-white to-blush text-[#c9a27e]">
                        <Icon className="h-5 w-5" strokeWidth={1.25} aria-hidden />
                      </span>
                      <h3 className="mt-5 font-display text-xl text-ink">
                        {tip.title}
                      </h3>
                      <p className="mt-3 text-pretty text-sm leading-6 text-muted-foreground">
                        {tip.body}
                      </p>
                    </div>
                  </article>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-pad border-t border-[#c9a27e]/20">
        <div className="container-page">
          <div className="frame-lux">
            <div className="frame-lux-inner flex flex-col items-start justify-between gap-6 p-6 sm:flex-row sm:items-center sm:p-10">
              <div className="max-w-xl">
                <p className="eyebrow">Ready to book</p>
                <h2 className="mt-3 font-editorial text-3xl text-ink sm:text-4xl">
                  Pick a look and reserve your slot.
                </h2>
                <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                  Online booking is open Monday–Saturday. Prefer chatting first?
                  Message us on WhatsApp.
                </p>
              </div>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/book">Book fixing</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                  <a href={SITE.whatsapp} target="_blank" rel="noreferrer">
                    WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
