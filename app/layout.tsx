import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Providers } from "@/components/providers";
import { SITE } from "@/lib/constants";
import { getCurrentProfile } from "@/lib/data";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Lash Lux | Luxury Lash Extensions",
    template: "%s | Lash Lux",
  },
  description:
    "Book classic, hybrid, volume, and mega volume lashes with Lash Lux — luxury in every lash at Manna Apartment, Old Ashongman.",
  openGraph: {
    title: "Lash Lux | Luxury Lash Extensions",
    description: SITE.slogan + " " + SITE.tagline,
    url: SITE.url,
    siteName: SITE.name,
    type: "website",
    images: [
      {
        url: "/images/lashlux-flyer.png",
        width: 1200,
        height: 1500,
        alt: "Lash Lux official flyer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lash Lux | Luxury in Every Lash",
    description: "Book your custom lash set with Lash Lux.",
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
        </Providers>
      </body>
    </html>
  );
}
