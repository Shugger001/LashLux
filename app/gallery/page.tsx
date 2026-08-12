import type { Metadata } from "next";
import Link from "next/link";

import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { Button } from "@/components/ui/button";
import { getGallery } from "@/lib/data";

export const metadata: Metadata = {
  title: "Lash Gallery",
  description:
    "Browse classic, hybrid, volume, and specialty lash looks created at Lash Lux.",
};

export default async function GalleryPage() {
  const gallery = await getGallery();

  return (
    <section className="section-pad">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-rose">
              Recent artistry
            </p>
            <h1 className="mt-3 font-display text-5xl text-ink sm:text-6xl">
              Find your next lash look.
            </h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Every set is mapped to suit the client&apos;s eye shape, natural
              lashes, and preferred level of glam.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/book">Book a session</Link>
          </Button>
        </div>
        <div className="mt-12">
          <GalleryGrid items={gallery} />
        </div>
      </div>
    </section>
  );
}
