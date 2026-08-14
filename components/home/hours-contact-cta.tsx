import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { BrandLogo } from "@/components/brand/logo";
import {
  DirectionsAddress,
  DirectionsButton,
} from "@/components/layout/directions-link";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { DAY_LABELS, DEFAULT_HOURS, SITE } from "@/lib/constants";

export function HoursContactCta() {
  return (
    <section className="section-pad border-t border-[#c9a27e]/20 bg-gradient-to-b from-blush/50 to-cream">
      <div className="container-page grid gap-8 lg:grid-cols-2 lg:gap-12">
        <FadeIn>
          <span className="eyebrow">Book eyelash fixing</span>
          <h2 className="mt-3 font-editorial text-3xl text-ink sm:mt-4 sm:text-5xl lg:text-6xl">
            Ready when you are.
          </h2>
          <p className="mt-3 font-script text-3xl text-rose sm:mt-4 sm:text-5xl">
            {SITE.badge}
          </p>
          <div className="mt-4 h-px w-14 bg-gradient-to-r from-[#c9a27e] to-transparent sm:mt-5 sm:w-16" />
          <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground sm:mt-5 sm:text-base sm:leading-7">
            Book a classic, hybrid, volume, or mega volume set online, WhatsApp
            us, or walk in when the schedule allows, appointments preferred.
          </p>
          <div className="mt-6 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:flex-wrap">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/book">Book fixing</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
            >
              <a href={SITE.whatsapp} target="_blank" rel="noreferrer">
                <MessageCircle className="h-4 w-4" aria-hidden />
                WhatsApp
              </a>
            </Button>
            <DirectionsButton className="w-full sm:w-auto" />
          </div>
          <div className="mt-8 space-y-3 text-sm">
            <p>
              <a className="hover:text-primary" href={`tel:${SITE.phone}`}>
                {SITE.phoneDisplay}
              </a>
            </p>
            <DirectionsAddress />
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
              Snapchat: {SITE.snapchat}
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="frame-lux">
            <div className="frame-lux-inner p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-2xl text-ink">Opening hours</h3>
                <BrandLogo
                  size="sm"
                  className="h-12 w-auto shrink-0 sm:h-14"
                />
              </div>
              <ul className="mt-6 space-y-3 text-sm">
                {(
                  Object.keys(DEFAULT_HOURS) as Array<keyof typeof DEFAULT_HOURS>
                ).map((key) => (
                  <li
                    key={key}
                    className="flex items-center justify-between gap-4 border-b border-[#c9a27e]/15 pb-3 last:border-0"
                  >
                    <span>{DAY_LABELS[key]}</span>
                    <span className="text-right text-muted-foreground">
                      {DEFAULT_HOURS[key]}
                    </span>
                  </li>
                ))}
              </ul>
              <DirectionsButton className="mt-6 w-full" />
              <p className="mt-4 rounded-xl border border-[#c9a27e]/30 bg-blush/50 px-4 py-3 text-center text-xs uppercase tracking-[0.14em] text-ink">
                {SITE.policy}
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
