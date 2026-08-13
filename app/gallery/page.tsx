import type { Metadata } from "next";
import Link from "next/link";

import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { Button } from "@/components/ui/button";
import { getGallery } from "@/lib/data";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Eyelash Fixing Gallery",
  description:
    "Browse eyelash fixing looks from Lash Lux, classic, hybrid, volume, and specialty sets in Old Ashongman.",
  path: "/gallery",
});

export default async function GalleryPage() {
  const gallery = await getGallery();
  const crumbsLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Gallery", path: "/gallery" },
  ]);

  return (
    <section className="section-pad">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbsLd) }}
      />
      <div className="container-page">
        <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow">Recent artistry</p>
            <h1 className="mt-5 text-balance font-editorial text-5xl text-ink sm:text-6xl lg:text-7xl">
              Find your next lash look.
            </h1>
            <div className="mt-5 h-px w-16 bg-gradient-to-r from-[#c9a27e] to-transparent" />
            <p className="mt-5 text-pretty text-base leading-8 text-muted-foreground sm:text-lg">
              Every set is mapped to suit the client&apos;s eye shape, natural
              lashes, and preferred level of glam.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/book">Book fixing</Link>
          </Button>
        </div>
        <div className="mt-12">
          <GalleryGrid items={gallery} />
        </div>
      </div>
    </section>
  );
}
