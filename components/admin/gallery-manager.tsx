"use client";

import { Images, Plus, Star, Trash2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { GalleryItem, GalleryMediaType } from "@/types";

function isVideo(item: GalleryItem) {
  return item.media_type === "video" || item.image_url.endsWith(".mp4");
}

/** Gallery batch import, featured state, and deletion controls. */
export function GalleryManager({ initialItems }: { initialItems: GalleryItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [mediaType, setMediaType] = useState<GalleryMediaType>("image");

  async function addMedia(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    const values = new FormData(event.currentTarget);
    const urls = String(values.get("urls") ?? "")
      .split("\n")
      .map((url) => url.trim())
      .filter(Boolean);
    const title = String(values.get("title") ?? "").trim() || "Lash look";
    const category = String(values.get("category") ?? "").trim() || (mediaType === "video" ? "Reels" : "Classic");
    const poster = String(values.get("poster") ?? "").trim() || null;
    if (!urls.length) {
      toast.error("Enter at least one media URL or path.");
      setIsSaving(false);
      return;
    }
    const payloads = urls.map((image_url, index) => ({
      image_url,
      poster_url: mediaType === "video" ? poster : null,
      title: urls.length > 1 ? `${title} ${index + 1}` : title,
      description: null as string | null,
      category,
      is_featured: false,
      media_type: mediaType,
    }));
    let added: GalleryItem[];
    try {
      const response = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloads),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Media could not be added.");
      added = result.items as GalleryItem[];
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Media could not be added.");
      setIsSaving(false);
      return;
    }
    setItems((current) => [...added, ...current]);
    setIsSaving(false);
    setIsOpen(false);
    toast.success(`Added ${added.length} item${added.length === 1 ? "" : "s"}`);
  }

  async function toggleFeatured(item: GalleryItem) {
    const next = !item.is_featured;
    setItems((current) =>
      current.map((value) =>
        value.id === item.id ? { ...value, is_featured: next } : value
      )
    );
    try {
      const response = await fetch("/api/admin/gallery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, is_featured: next }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Featured state could not be updated.");
      toast.success(next ? "Added to featured gallery" : "Removed from featured gallery");
    } catch (error) {
      setItems((current) =>
        current.map((value) => (value.id === item.id ? item : value))
      );
      toast.error(
        error instanceof Error ? error.message : "Featured state could not be updated."
      );
    }
  }

  async function removeItem(item: GalleryItem) {
    if (!window.confirm(`Delete “${item.title}”?`)) return;
    try {
      const response = await fetch(
        `/api/admin/gallery?id=${encodeURIComponent(item.id)}`,
        { method: "DELETE" }
      );
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error ?? "Item could not be deleted.");
      setItems((current) => current.filter((value) => value.id !== item.id));
      toast.success("Gallery item deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Item could not be deleted.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Portfolio</p>
          <h1 className="mt-1 text-4xl text-ink">Gallery</h1>
          <p className="mt-2 text-muted-foreground">
            Curate finished looks and reels for the homepage.
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus /> Add media
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add gallery media</DialogTitle>
              <DialogDescription>
                Paste one image or video URL/path per line (for example /gallery/reel-01.mp4).
              </DialogDescription>
            </DialogHeader>
            <form className="grid gap-4" onSubmit={addMedia}>
              <div className="grid gap-2">
                <Label htmlFor="gallery-type">Media type</Label>
                <select
                  id="gallery-type"
                  className="h-11 rounded-xl border border-[#e8d5c8] bg-card px-3 text-sm focus-ring"
                  value={mediaType}
                  onChange={(event) =>
                    setMediaType(event.target.value as GalleryMediaType)
                  }
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gallery-urls">Media URLs or paths</Label>
                <Textarea
                  id="gallery-urls"
                  name="urls"
                  rows={6}
                  required
                  placeholder={
                    mediaType === "video"
                      ? "/gallery/reel-01.mp4\n/gallery/reel-02.mp4"
                      : "/gallery/look-01.png\n/gallery/look-02.png"
                  }
                />
              </div>
              {mediaType === "video" && (
                <div className="grid gap-2">
                  <Label htmlFor="gallery-poster">Poster image (optional)</Label>
                  <Input
                    id="gallery-poster"
                    name="poster"
                    placeholder="/gallery/look-01.png"
                  />
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="gallery-title">Title</Label>
                  <Input
                    id="gallery-title"
                    name="title"
                    maxLength={80}
                    placeholder="Soft volume set"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="gallery-category">Category</Label>
                  <Input
                    id="gallery-category"
                    name="category"
                    maxLength={40}
                    defaultValue={mediaType === "video" ? "Reels" : "Classic"}
                  />
                </div>
              </div>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Adding…" : "Add to gallery"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Images className="mx-auto h-8 w-8 text-muted-foreground" />
            <h2 className="mt-4 font-display text-2xl">Your gallery is empty</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Add finished looks and reels to build your portfolio.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-[4/3] bg-secondary">
                {isVideo(item) ? (
                  <video
                    src={item.image_url}
                    poster={item.poster_url ?? undefined}
                    className="h-full w-full object-cover"
                    muted
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  // Admin-entered URLs are displayed directly so any valid host works.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-medium">{item.title}</h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.category}
                      {isVideo(item) ? " · Video" : ""}
                    </p>
                  </div>
                  {item.is_featured ? (
                    <Star
                      className="h-5 w-5 fill-primary text-primary"
                      aria-label="Featured"
                    />
                  ) : null}
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Switch
                      id={`featured-${item.id}`}
                      checked={item.is_featured}
                      onCheckedChange={() => toggleFeatured(item)}
                    />
                    <Label htmlFor={`featured-${item.id}`} className="text-xs">
                      Featured
                    </Label>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${item.title}`}
                    onClick={() => removeItem(item)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
