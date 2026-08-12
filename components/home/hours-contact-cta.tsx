import Link from "next/link";
import { AtSign, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { DAY_LABELS, DEFAULT_HOURS, SITE } from "@/lib/constants";

export function HoursContactCta() {
  return (
    <section className="section-pad border-t border-border bg-secondary/50">
      <div className="container-page grid gap-12 lg:grid-cols-2">
        <FadeIn>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-rose">
            Book your lash experience
          </p>
          <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
            Ready when you are.
          </h2>
          <p className="mt-3 font-script text-3xl text-rose">{SITE.badge}</p>
          <p className="mt-4 max-w-md text-muted-foreground">
            Book online, WhatsApp us, or walk in when the schedule allows —
            appointments preferred.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-rose-gold text-ink hover:opacity-95">
              <Link href="/book">Book a session</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={SITE.whatsapp} target="_blank" rel="noreferrer">
                <MessageCircle className="h-4 w-4" aria-hidden />
                WhatsApp
              </a>
            </Button>
            <Button asChild size="lg" variant="ghost">
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
          <div className="rounded-xl border border-[#c9a27e]/40 bg-card p-6 sm:p-8">
            <h3 className="font-display text-2xl">Opening hours</h3>
            <ul className="mt-6 space-y-3 text-sm">
              {(
                Object.keys(DEFAULT_HOURS) as Array<keyof typeof DEFAULT_HOURS>
              ).map((key) => (
                <li
                  key={key}
                  className="flex items-center justify-between gap-4 border-b border-border/70 pb-3 last:border-0"
                >
                  <span>{DAY_LABELS[key]}</span>
                  <span className="text-muted-foreground">
                    {DEFAULT_HOURS[key]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
