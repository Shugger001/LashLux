import type { Metadata } from "next";

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
    "Lash Lux offers professional eyelash fixing in Old Ashongman — classic, hybrid, volume, and mega volume lash extensions. Walk-ins welcome, appointments preferred.",
  openGraph: {
    title: "Lash Lux | Eyelash Fixing & Lash Extensions",
    description: `${SITE.businessType}. ${SITE.tagline}`,
    url: SITE.url,
    siteName: SITE.name,
    type: "website",
    images: [
      {
        url: "/images/lashlux-flyer.png",
        width: 1200,
        height: 1500,
        alt: "Lash Lux eyelash fixing flyer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lash Lux | Eyelash Fixing",
    description: "Book classic, hybrid, volume, or mega volume lashes at Lash Lux.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
          <SiteHeader
            isAdmin={profile?.role === "admin"}
            isLoggedIn={Boolean(profile)}
          />
          <main id="main">{children}</main>
          <SiteFooter />
          <WhatsAppFloat />
        </Providers>
      </body>
    </html>
  );
}
