"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { BrandWordmark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({
  isAdmin = false,
  isLoggedIn = false,
}: {
  isAdmin?: boolean;
  isLoggedIn?: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="pointer-events-none sticky top-0 z-40 px-3 pb-2 pt-3 sm:px-4 sm:pt-4">
      <div className="pointer-events-auto container-page">
        <div className="flex items-center justify-between gap-3 rounded-full border border-[#c9a27e]/25 bg-cream/80 px-3 py-2 shadow-[0_18px_40px_-28px_rgba(58,42,44,0.45)] backdrop-blur-xl sm:px-4">
          <Link href="/" className="rounded-full focus-ring">
            <BrandWordmark />
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm transition-colors duration-300 transition-lux hover:text-rose-deep",
                  pathname === item.href
                    ? "bg-white text-ink shadow-sm"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {isAdmin ? (
              <Button asChild variant="outline" size="sm">
                <Link href="/admin">Admin</Link>
              </Button>
            ) : isLoggedIn ? null : (
              <Button asChild variant="ghost" size="sm">
                <Link href="/auth/login">Sign in</Link>
              </Button>
            )}
            <Button asChild size="sm">
              <Link href="/book">Book now</Link>
            </Button>
          </div>

          <button
            type="button"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#c9a27e]/30 bg-white/70 md:hidden focus-ring"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            className="pointer-events-auto container-page mt-2 md:hidden"
          >
            <div className="rounded-[1.5rem] border border-[#c9a27e]/25 bg-cream/95 p-4 shadow-soft backdrop-blur-xl">
              <nav className="flex flex-col gap-1" aria-label="Mobile">
                {NAV.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index, duration: 0.35 }}
                  >
                    <Link
                      href={item.href}
                      className="block rounded-xl px-3 py-3 text-base"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <Button asChild className="mt-2">
                  <Link href="/book" onClick={() => setOpen(false)}>
                    Book now
                  </Link>
                </Button>
              </nav>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
