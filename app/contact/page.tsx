import type { Metadata } from "next";
import Link from "next/link";
import { AtSign, MapPin, MessageCircle, Phone } from "lucide-react";

import { ContactForm } from "@/components/contact/contact-form";
import { Button } from "@/components/ui/button";
import { DAY_LABELS, DEFAULT_HOURS, SITE } from "@/lib/constants";
import { getStudioOpenStatus } from "@/lib/schedule";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Lash Lux for eyelash fixing in Old Ashongman, WhatsApp, call, or book classic, hybrid, volume, and mega volume lashes online.",
};

/** Refresh open/closed status about once a minute. */
export const revalidate = 60;

export default function ContactPage() {
  const openStatus = getStudioOpenStatus();

  return (
    <>
      <section className="section-pad">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow">Contact the lash studio</p>
            <h1 className="mt-5 text-balance font-editorial text-5xl text-ink sm:text-6xl">
              Book eyelash fixing.
            </h1>
            <p className="mt-3 font-script text-4xl text-rose">{SITE.slogan}</p>
            <div className="mt-5 h-px w-16 bg-gradient-to-r from-[#c9a27e] to-transparent" />
            <p
              className={cn(
                "mt-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em]",
                openStatus.isOpen
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-[#c9a27e]/30 bg-blush/50 text-ink"
              )}
              aria-live="polite"
            >
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  openStatus.isOpen ? "bg-emerald-500" : "bg-[#c9a27e]"
                )}
                aria-hidden
              />
              {openStatus.label}
              <span className="font-normal normal-case tracking-normal text-muted-foreground">
                · today {openStatus.hoursLabel}
              </span>
            </p>
            <p className="mt-5 max-w-lg text-pretty text-base leading-8 text-muted-foreground sm:text-lg">
              Questions about a full set, fill, removal, or aftercare? Message us.
              Walk-ins welcome, appointments preferred.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild size="lg">
                <Link href="/book">Book fixing</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={SITE.whatsapp} target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <a href={SITE.mapsUrl} target="_blank" rel="noreferrer">
                  Get directions
                </a>
              </Button>
            </div>

            <address className="mt-8 space-y-4 text-sm not-italic">
              <a
                className="flex items-center gap-3 transition-colors hover:text-rose-deep"
                href={`mailto:${SITE.email}`}
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#c9a27e]/35 bg-blush/60 text-[#c9a27e]">
                  <AtSign className="h-4 w-4" aria-hidden />
                </span>
                {SITE.email}
              </a>
              <a
                className="flex items-center gap-3 transition-colors hover:text-rose-deep"
                href={`tel:${SITE.phone}`}
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#c9a27e]/35 bg-blush/60 text-[#c9a27e]">
                  <Phone className="h-4 w-4" aria-hidden />
                </span>
                {SITE.phoneDisplay}
              </a>
              <a
                className="flex items-center gap-3 transition-colors hover:text-rose-deep"
                href={SITE.whatsapp}
                target="_blank"
                rel="noreferrer"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#c9a27e]/35 bg-blush/60 text-[#c9a27e]">
                  <MessageCircle className="h-4 w-4" aria-hidden />
                </span>
                WhatsApp · {SITE.phoneDisplay}
              </a>
              <a
                className="flex items-start gap-3 transition-colors hover:text-rose-deep"
                href={SITE.mapsUrl}
                target="_blank"
                rel="noreferrer"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#c9a27e]/35 bg-blush/60 text-[#c9a27e]">
                  <MapPin className="h-4 w-4" aria-hidden />
                </span>
                <span className="pt-2">
                  {SITE.address}
                  <span className="mt-1 block text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    Open in Maps
                  </span>
                </span>
              </a>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {SITE.policy}
              </p>
            </address>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                className="inline-flex h-11 items-center gap-2 rounded-full border border-[#c9a27e]/40 bg-white/60 px-4 text-sm transition-colors hover:bg-white focus-ring"
                href={SITE.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Lash Lux on Instagram"
              >
                <AtSign className="h-4 w-4" aria-hidden />
                {SITE.instagramHandle}
              </a>
              <a
                className="inline-flex h-11 items-center gap-2 rounded-full border border-[#c9a27e]/40 bg-white/60 px-4 text-sm transition-colors hover:bg-white focus-ring"
                href={SITE.snapchatUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Lash Lux on Snapchat"
              >
                Snapchat · {SITE.snapchat}
              </a>
            </div>
          </div>
          <div>
            <ContactForm />
          </div>
        </div>
      </section>

      <section className="section-pad border-y border-[#c9a27e]/20 bg-gradient-to-b from-blush/35 to-transparent">
        <div className="container-page">
          <div className="frame-lux">
            <div className="frame-lux-inner grid overflow-hidden lg:grid-cols-2">
              <iframe
                title="Map showing Lash Lux at Manna Apartment, Old Ashongman"
                src={SITE.mapsEmbedUrl}
                className="h-[360px] w-full border-0 lg:h-full lg:min-h-[420px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="p-8 sm:p-12">
                <p className="eyebrow">Plan your visit</p>
                <h2 className="mt-4 font-editorial text-4xl text-ink">Opening hours</h2>
                <div className="mt-4 h-px w-16 bg-gradient-to-r from-[#c9a27e] to-transparent" />
                <p
                  className={cn(
                    "mt-5 text-sm font-medium",
                    openStatus.isOpen ? "text-emerald-700" : "text-muted-foreground"
                  )}
                >
                  {openStatus.label} · {openStatus.hoursLabel}
                </p>
                <ul className="mt-6 space-y-3 text-sm">
                  {(Object.keys(DEFAULT_HOURS) as Array<keyof typeof DEFAULT_HOURS>).map(
                    (key) => (
                      <li
                        key={key}
                        className="flex justify-between gap-4 border-b border-[#c9a27e]/15 pb-3 last:border-0"
                      >
                        <span>{DAY_LABELS[key]}</span>
                        <span className="text-muted-foreground">
                          {DEFAULT_HOURS[key]}
                        </span>
                      </li>
                    )
                  )}
                </ul>
                <Button asChild className="mt-8" variant="outline">
                  <a href={SITE.mapsUrl} target="_blank" rel="noreferrer">
                    Get directions
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
