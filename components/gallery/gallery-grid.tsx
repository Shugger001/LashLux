"use client";

import Image from "next/image";
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
        {filtered.slice(0, visibleCount).map((item, index) => (
          <button
            key={item.id}
            type="button"
            className="group relative mb-6 block w-full break-inside-avoid overflow-hidden rounded-xl bg-sand focus-ring"
            onClick={() => setSelectedItem(item)}
            aria-label={`Open ${item.title}`}
          >
            <div
              className={
                index % 3 === 1 ? "relative aspect-[4/5]" : "relative aspect-[4/3]"
              }
            >
              <Image
                src={item.image_url}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-5 pt-16 text-left text-white">
                <p className="font-display text-2xl">{item.title}</p>
                <p className="mt-1 text-sm text-white/80">{item.category}</p>
              </div>
            </div>
          </button>
        ))}
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
        <p className="mt-10 rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
          No looks are available in this category yet.
        </p>
      )}

      <Dialog
        open={Boolean(selectedItem)}
        onOpenChange={(open) => !open && setSelectedItem(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-3xl">
          {selectedItem && (
            <>
              <div className="relative aspect-[4/3] overflow-hidden sm:rounded-t-xl">
                <Image
                  src={selectedItem.image_url}
                  alt={selectedItem.title}
                  fill
                  className="object-cover"
                  sizes="768px"
                  priority
                />
              </div>
              <DialogHeader className="p-6 sm:p-8">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-rose">
                  {selectedItem.category}
                </p>
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
