"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GALLERY_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { whatsappBookService } from "@/lib/whatsapp";
import type { GalleryItem } from "@/types";

const PAGE_SIZE = 6;
type MediaFilter = "all" | "photos" | "videos";

function isVideo(item: GalleryItem) {
  return item.media_type === "video" || item.image_url.endsWith(".mp4");
}

/** Filterable, progressively loaded gallery with an accessible lightbox. */
export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [category, setCategory] = useState<(typeof GALLERY_CATEGORIES)[number]>(
    "All"
  );
  const [media, setMedia] = useState<MediaFilter>("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const byCategory =
      category === "All"
        ? items
        : items.filter((item) => item.category === category);

    const byMedia = byCategory.filter((item) => {
      if (media === "photos") return !isVideo(item);
      if (media === "videos") return isVideo(item);
      return true;
    });

    return [...byMedia].sort((a, b) => Number(isVideo(a)) - Number(isVideo(b)));
  }, [category, items, media]);

  const visibleItems = filtered.slice(0, visibleCount);
  const selectedItem =
    selectedIndex == null ? null : filtered[selectedIndex] ?? null;

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    setSelectedIndex(null);
  }, [category, media]);

  const showPrev = useCallback(() => {
    setSelectedIndex((current) => {
      if (current == null || !filtered.length) return current;
      return (current - 1 + filtered.length) % filtered.length;
    });
  }, [filtered.length]);

  const showNext = useCallback(() => {
    setSelectedIndex((current) => {
      if (current == null || !filtered.length) return current;
      return (current + 1) % filtered.length;
    });
  }, [filtered.length]);

  useEffect(() => {
    if (selectedIndex == null) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") showPrev();
      if (event.key === "ArrowRight") showNext();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedIndex, showNext, showPrev]);

  return (
    <>
      <div className="sticky top-16 z-20 -mx-1 space-y-3 bg-[hsl(var(--background)/0.95)] px-1 py-3 backdrop-blur-sm sm:top-20">
        <div
          className="flex gap-2 overflow-x-auto pb-1"
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
              className="shrink-0"
              onClick={() => setCategory(item)}
            >
              {item}
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            className="flex gap-2"
            role="group"
            aria-label="Filter gallery by media type"
          >
            {(
              [
                ["all", "All media"],
                ["photos", "Photos"],
                ["videos", "Videos"],
              ] as const
            ).map(([value, label]) => (
              <Button
                key={value}
                type="button"
                size="sm"
                variant={media === value ? "secondary" : "ghost"}
                aria-pressed={media === value}
                onClick={() => setMedia(value)}
              >
                {label}
              </Button>
            ))}
          </div>
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
            {filtered.length} look{filtered.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="mt-6 columns-1 gap-6 sm:mt-8 sm:columns-2 lg:columns-3">
        {visibleItems.map((item, index) => {
          const video = isVideo(item);
          return (
            <button
              key={item.id}
              type="button"
              className="frame-lux group relative mb-6 block w-full break-inside-avoid focus-ring"
              onClick={() => setSelectedIndex(index)}
              aria-label={`Open ${item.title}${video ? " video" : ""}`}
            >
              <div
                className={cn(
                  "frame-lux-inner overflow-hidden",
                  index % 3 === 1 ? "relative aspect-[4/5]" : "relative aspect-[4/3]"
                )}
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
            No looks match these filters yet. Try another category or media type.
          </p>
        </div>
      )}

      <Dialog
        open={Boolean(selectedItem)}
        onOpenChange={(open) => !open && setSelectedIndex(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-3xl">
          {selectedItem && selectedIndex != null ? (
            <>
              <div className="relative aspect-[4/3] overflow-hidden bg-ink sm:rounded-t-xl">
                {isVideo(selectedItem) ? (
                  <video
                    key={selectedItem.id}
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
                {filtered.length > 1 ? (
                  <>
                    <Button
                      type="button"
                      size="icon"
                      variant="secondary"
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-cream/90"
                      aria-label="Previous look"
                      onClick={showPrev}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="secondary"
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-cream/90"
                      aria-label="Next look"
                      onClick={showNext}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                ) : null}
              </div>
              <DialogHeader className="p-6 sm:p-8">
                <p className="eyebrow">
                  {selectedItem.category}
                  {isVideo(selectedItem) ? " · Video" : ""}
                  {filtered.length > 1
                    ? ` · ${selectedIndex + 1} of ${filtered.length}`
                    : ""}
                </p>
                <DialogTitle className="text-4xl text-ink">
                  {selectedItem.title}
                </DialogTitle>
                {selectedItem.description ? (
                  <DialogDescription className="text-base">
                    {selectedItem.description}
                  </DialogDescription>
                ) : null}
                <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                  <Button asChild>
                    <Link href="/book">Book this look</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <a
                      href={whatsappBookService(selectedItem.title)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      WhatsApp about this look
                    </a>
                  </Button>
                </div>
              </DialogHeader>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
