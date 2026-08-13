import type { Metadata } from "next";
import { headers } from "next/headers";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";
import { Providers } from "@/components/providers";
import { SITE } from "@/lib/constants";
import { getCurrentProfile } from "@/lib/data";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url || "http://localhost:3000"),
  title: {
    default: "Lash Lux | Eyelash Fixing & Lash Extensions in Old Ashongman",
    template: "%s | Lash Lux",
  },
  description:
    "Lash Lux offers professional eyelash fixing in Old Ashongman, classic, hybrid, volume, and mega volume lash extensions. Walk-ins welcome, appointments preferred.",
  alternates: {
    canonical: SITE.url,
  },
  openGraph: {
    title: "Lash Lux | Eyelash Fixing & Lash Extensions",
    description: `${SITE.businessType}. ${SITE.tagline}`,
    url: SITE.url,
    siteName: SITE.name,
    type: "website",
    locale: "en_GH",
    images: [
      {
        url: "/images/hero-lashes.jpg",
        width: 1600,
        height: 1067,
        alt: "Lash Lux eyelash fixing studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lash Lux | Eyelash Fixing",
    description: "Book classic, hybrid, volume, or mega volume lashes at Lash Lux.",
    images: ["/images/hero-lashes.jpg"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Opt into dynamic rendering so per-request CSP nonces can be applied.
  headers().get("x-nonce");
  const profile = await getCurrentProfile();

  return (
    <html lang="en">
      <body className="min-h-screen">
        <Providers>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-card focus:px-3 focus:py-2"
          >
            Skip to content
          </a>
          <SiteHeader isLoggedIn={Boolean(profile)} />
          <main id="main" className="pt-16 sm:pt-[4.75rem]">
            {children}
          </main>
          <SiteFooter />
          <WhatsAppFloat />
        </Providers>
      </body>
    </html>
  );
}
