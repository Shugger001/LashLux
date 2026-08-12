import Link from "next/link";
import { AtSign, MessageCircle } from "lucide-react";

import { BrandLogo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { DAY_LABELS, DEFAULT_HOURS, SITE } from "@/lib/constants";

export function HoursContactCta() {
  return (
    <section className="section-pad border-t border-[#c9a27e]/20 bg-gradient-to-b from-blush/50 to-cream">
      <div className="container-page grid gap-12 lg:grid-cols-2">
        <FadeIn>
          <span className="eyebrow">Book eyelash fixing</span>
          <h2 className="mt-4 font-editorial text-4xl text-ink sm:text-5xl lg:text-6xl">
            Ready when you are.
          </h2>
          <p className="mt-4 font-script text-4xl text-rose sm:text-5xl">{SITE.badge}</p>
          <div className="mt-5 h-px w-16 bg-gradient-to-r from-[#c9a27e] to-transparent" />
          <p className="mt-5 max-w-md text-muted-foreground leading-7">
            Book a classic, hybrid, volume, or mega volume set online, WhatsApp
            us, or walk in when the schedule allows, appointments preferred.
          </p>
          <div className="mt-6 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:flex-wrap">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/book">Book fixing</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <a href={SITE.whatsapp} target="_blank" rel="noreferrer">
                <MessageCircle className="h-4 w-4" aria-hidden />
                WhatsApp
              </a>
            </Button>
            <Button asChild size="lg" variant="ghost" className="w-full sm:w-auto">
              <a href={SITE.instagram} target="_blank" rel="noreferrer">
                <AtSign className="h-4 w-4" aria-hidden />
                {SITE.instagramHandle}
              </a>
            </Button>
          </div>
          <div className="mt-8 space-y-2 text-sm">
            <p>
              <a className="hover:text-primary" href={`tel:${SITE.phone}`}>
                {SITE.phoneDisplay}
              </a>
            </p>
            <p className="text-muted-foreground">{SITE.address}</p>
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
              Snapchat: {SITE.snapchat}
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="frame-lux">
            <div className="frame-lux-inner relative overflow-hidden p-6 sm:p-8">
              <div className="absolute right-4 top-4 opacity-90">
                <BrandLogo size="md" />
              </div>
              <h3 className="font-display text-2xl text-ink">Opening hours</h3>
              <ul className="mt-6 space-y-3 text-sm">
                {(
                  Object.keys(DEFAULT_HOURS) as Array<keyof typeof DEFAULT_HOURS>
                ).map((key) => (
                  <li
                    key={key}
                    className="flex items-center justify-between gap-4 border-b border-[#c9a27e]/15 pb-3 last:border-0"
                  >
                    <span>{DAY_LABELS[key]}</span>
                    <span className="text-muted-foreground">
                      {DEFAULT_HOURS[key]}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 rounded-xl border border-[#c9a27e]/30 bg-blush/50 px-4 py-3 text-center text-xs uppercase tracking-[0.14em] text-ink">
                {SITE.policy}
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
