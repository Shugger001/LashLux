import type { Metadata } from "next";
import { AtSign, MapPin, MessageCircle, Phone } from "lucide-react";

import { ContactForm } from "@/components/contact/contact-form";
import { DAY_LABELS, DEFAULT_HOURS, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Lash Lux for eyelash fixing in Old Ashongman, WhatsApp, call, or book classic, hybrid, volume, and mega volume lashes online.",
};

export default function ContactPage() {
  return (
    <>
      <section className="section-pad">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Contact the lash studio</p>
            <h1 className="mt-5 text-balance font-display text-4xl text-ink sm:text-5xl">
              Book eyelash fixing.
            </h1>
            <p className="mt-3 font-script text-3xl text-rose">{SITE.slogan}</p>
            <p className="mt-5 max-w-lg text-pretty text-lg leading-8 text-muted-foreground">
              Questions about a full set, fill, removal, or aftercare? Message us.
              Walk-ins welcome, appointments preferred.
            </p>

            <address className="mt-8 space-y-4 text-sm not-italic">
              <a
                className="flex items-center gap-3 hover:text-primary"
                href={`tel:${SITE.phone}`}
              >
                <Phone className="h-5 w-5 text-rose" aria-hidden />
                {SITE.phoneDisplay}
              </a>
              <a
                className="flex items-center gap-3 hover:text-primary"
                href={SITE.whatsapp}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="h-5 w-5 text-rose" aria-hidden />
                WhatsApp · {SITE.phoneDisplay}
              </a>
              <p className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-rose" aria-hidden />
                {SITE.address}
              </p>
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                {SITE.policy}
              </p>
            </address>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                className="inline-flex h-11 items-center gap-2 rounded-md border border-border px-4 text-sm transition-colors hover:bg-secondary focus-ring"
                href={SITE.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Lash Lux on Instagram"
              >
                <AtSign className="h-4 w-4" aria-hidden />
                {SITE.instagramHandle}
              </a>
              <a
                className="inline-flex h-11 items-center gap-2 rounded-md border border-border px-4 text-sm transition-colors hover:bg-secondary focus-ring"
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

      <section className="section-pad border-y border-border bg-secondary/50">
        <div className="container-page">
          <div className="frame-lux">
          <div className="frame-lux-inner grid overflow-hidden lg:grid-cols-2">
          <iframe
            title="Map showing Lash Lux at Manna Apartment, Old Ashongman"
            src="https://www.google.com/maps?q=Manna%20Apartment%20Old%20Ashongman&output=embed"
            className="h-[420px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="p-8 sm:p-12">
            <p className="eyebrow">Plan your visit</p>
            <h2 className="mt-4 font-display text-3xl text-ink">Opening hours</h2>
            <ul className="mt-6 space-y-3 text-sm">
              {(Object.keys(DEFAULT_HOURS) as Array<keyof typeof DEFAULT_HOURS>).map(
                (key) => (
                  <li
                    key={key}
                    className="flex justify-between gap-4 border-b border-border pb-3 last:border-0"
                  >
                    <span>{DAY_LABELS[key]}</span>
                    <span className="text-muted-foreground">{DEFAULT_HOURS[key]}</span>
                  </li>
                )
              )}
            </ul>
          </div>
          </div>
          </div>
        </div>
      </section>
    </>
  );
}
