"use client";

import Link from "next/link";
import { AtSign, MapPin, MessageCircle, Phone } from "lucide-react";
import { usePathname } from "next/navigation";

import { BrandWordmark } from "@/components/brand/logo";
import { DAY_LABELS, DEFAULT_HOURS, SITE } from "@/lib/constants";

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-border bg-ink text-cream">
      <div className="container-page grid gap-12 py-16 md:grid-cols-3">
        <div>
          <BrandWordmark light showTagline />
          <p className="mt-4 max-w-sm font-script text-2xl text-[#e8c4a8]">
            {SITE.slogan}
          </p>
          <p className="mt-2 text-sm text-cream/70">{SITE.promise}</p>
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm text-cream/80 transition-colors hover:text-[#e8c4a8]"
          >
            <AtSign className="h-4 w-4" aria-hidden />
            {SITE.instagramHandle}
          </a>
        </div>

        <div>
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-cream/50">
            Visit & book
          </p>
          <ul className="mt-4 space-y-3 text-sm text-cream/80">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#c9a27e]" aria-hidden />
              {SITE.address}
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#c9a27e]" aria-hidden />
              <a href={`tel:${SITE.phone}`} className="hover:text-[#e8c4a8]">
                {SITE.phoneDisplay}
              </a>
            </li>
            <li className="flex gap-3">
              <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#c9a27e]" aria-hidden />
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#e8c4a8]"
              >
                WhatsApp booking
              </a>
            </li>
          </ul>
          <p className="mt-4 text-xs uppercase tracking-[0.12em] text-cream/50">
            {SITE.policy}
          </p>
        </div>

        <div>
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-cream/50">
            Hours
          </p>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            {(Object.keys(DEFAULT_HOURS) as Array<keyof typeof DEFAULT_HOURS>).map(
              (key) => (
                <li key={key} className="flex justify-between gap-4">
                  <span>{DAY_LABELS[key]}</span>
                  <span>{DEFAULT_HOURS[key]}</span>
                </li>
              )
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-cream/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.name}. {SITE.badge}
          </p>
          <div className="flex gap-4">
            <Link href="/services" className="hover:text-cream">
              Services
            </Link>
            <Link href="/book" className="hover:text-cream">
              Book
            </Link>
            <Link href="/contact" className="hover:text-cream">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
