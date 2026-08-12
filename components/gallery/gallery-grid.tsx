"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GALLERY_CATEGORIES } from "@/lib/constants";
import type { GalleryItem } from "@/types";

const PAGE_SIZE = 6;

function isVideo(item: GalleryItem) {
  return item.media_type === "video" || item.image_url.endsWith(".mp4");
}

/** Filterable, progressively loaded gallery with an accessible lightbox. */
export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [category, setCategory] = useState<(typeof GALLERY_CATEGORIES)[number]>(
    "All"
  );
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const filtered = useMemo(
    () =>
      category === "All"
        ? items
        : items.filter((item) => item.category === category),
    [category, items]
  );

  useEffect(() => setVisibleCount(PAGE_SIZE), [category]);

  return (
    <>
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Filter gallery by category"
      >
        {GALLERY_CATEGORIES.map((item) => (
          <Button
            key={item}
            type="button"
            size="sm"
            variant={category === item ? "primary" : "outline"}
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
          >
            {item}
          </Button>
        ))}
      </div>

      <div className="mt-10 columns-1 gap-6 sm:columns-2 lg:columns-3">
        {filtered.slice(0, visibleCount).map((item, index) => {
          const video = isVideo(item);
          return (
            <button
              key={item.id}
              type="button"
              className="frame-lux group relative mb-6 block w-full break-inside-avoid focus-ring"
              onClick={() => setSelectedItem(item)}
              aria-label={`Open ${item.title}${video ? " video" : ""}`}
            >
              <div
                className={`frame-lux-inner overflow-hidden ${
                  index % 3 === 1
                    ? "relative aspect-[4/5]"
                    : "relative aspect-[4/3]"
                }`}
              >
                {video ? (
                  <>
                    <video
                      className="absolute inset-0 h-full w-full object-cover"
                      src={item.image_url}
                      poster={item.poster_url ?? undefined}
                      muted
                      playsInline
                      preload="metadata"
                      aria-hidden
                    />
                    <span className="absolute left-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink/70 text-white">
                      <Play className="h-4 w-4 fill-current" aria-hidden />
                    </span>
                  </>
                ) : (
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 transition-lux group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 via-ink/25 to-transparent p-5 pt-16 text-left text-white">
                  <p className="font-editorial text-2xl sm:text-3xl">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[#f0d2b8]">
                    {item.category}
                    {video ? " · Video" : ""}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {visibleCount < filtered.length && (
        <div className="mt-4 text-center">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
          >
            Load more looks
          </Button>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="frame-lux mt-10">
          <p className="frame-lux-inner p-8 text-center text-muted-foreground">
            No looks are available in this category yet.
          </p>
        </div>
      )}

      <Dialog
        open={Boolean(selectedItem)}
        onOpenChange={(open) => !open && setSelectedItem(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-3xl">
          {selectedItem && (
            <>
              <div className="relative aspect-[4/3] overflow-hidden bg-ink sm:rounded-t-xl">
                {isVideo(selectedItem) ? (
                  <video
                    className="absolute inset-0 h-full w-full object-contain"
                    src={selectedItem.image_url}
                    poster={selectedItem.poster_url ?? undefined}
                    controls
                    playsInline
                    autoPlay
                    preload="metadata"
                  >
                    Your browser does not support this video.
                  </video>
                ) : (
                  <Image
                    src={selectedItem.image_url}
                    alt={selectedItem.title}
                    fill
                    className="object-cover"
                    sizes="768px"
                    priority
                  />
                )}
              </div>
              <DialogHeader className="p-6 sm:p-8">
                <p className="eyebrow">{selectedItem.category}</p>
                <DialogTitle className="text-4xl text-ink">
                  {selectedItem.title}
                </DialogTitle>
                {selectedItem.description && (
                  <DialogDescription className="text-base">
                    {selectedItem.description}
                  </DialogDescription>
                )}
              </DialogHeader>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
