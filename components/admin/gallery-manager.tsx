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
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { GalleryItem } from "@/types";

/** Gallery batch import, featured state, and deletion controls. */
export function GalleryManager({ initialItems }: { initialItems: GalleryItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function addImages(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    const values = new FormData(event.currentTarget);
    const urls = String(values.get("urls") ?? "")
      .split("\n")
      .map((url) => url.trim())
      .filter(Boolean);
    const title = String(values.get("title") ?? "").trim() || "Lash look";
    const category = String(values.get("category") ?? "").trim() || "Classic";
    if (!urls.length || urls.some((url) => {
      try { new URL(url); return false; } catch { return true; }
    })) {
      toast.error("Enter one valid image URL per line.");
      setIsSaving(false);
      return;
    }
    const payloads = urls.map((image_url, index) => ({
      image_url,
      title: urls.length > 1 ? `${title} ${index + 1}` : title,
      description: null,
      category,
      is_featured: false,
    }));
    let added: GalleryItem[];
    if (isSupabaseConfigured()) {
      const { data, error } = await createClient()
        .from("gallery")
        .insert(payloads)
        .select("id, image_url, title, description, category, is_featured, created_at");
      if (error || !data) {
        toast.error("Images could not be added.");
        setIsSaving(false);
        return;
      }
      added = data as GalleryItem[];
    } else {
      added = payloads.map((payload) => ({
        id: `demo-${crypto.randomUUID()}`,
        ...payload,
        created_at: new Date().toISOString(),
      }));
    }
    setItems((current) => [...added, ...current]);
    setIsSaving(false);
    setIsOpen(false);
    toast.success(`Added ${added.length} image${added.length === 1 ? "" : "s"}`);
  }

  async function toggleFeatured(item: GalleryItem) {
    const next = !item.is_featured;
    setItems((current) => current.map((value) => value.id === item.id ? { ...value, is_featured: next } : value));
    if (isSupabaseConfigured()) {
      const { error } = await createClient().from("gallery").update({ is_featured: next }).eq("id", item.id);
      if (error) {
        setItems((current) => current.map((value) => value.id === item.id ? item : value));
        toast.error("Featured state could not be updated.");
        return;
      }
    }
    toast.success(next ? "Added to featured gallery" : "Removed from featured gallery");
  }

  async function removeItem(item: GalleryItem) {
    if (!window.confirm(`Delete “${item.title}”?`)) return;
    if (isSupabaseConfigured()) {
      const { error } = await createClient().from("gallery").delete().eq("id", item.id);
      if (error) {
        toast.error("Image could not be deleted.");
        return;
      }
    }
    setItems((current) => current.filter((value) => value.id !== item.id));
    toast.success("Gallery image deleted");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Portfolio</p>
          <h1 className="mt-1 text-4xl text-ink">Gallery</h1>
          <p className="mt-2 text-muted-foreground">Curate finished looks and choose images for the homepage.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild><Button><Plus /> Add images</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add gallery images</DialogTitle>
              <DialogDescription>Paste one image URL per line to add several at once.</DialogDescription>
            </DialogHeader>
            <form className="grid gap-4" onSubmit={addImages}>
              <div className="grid gap-2">
                <Label htmlFor="gallery-urls">Image URLs</Label>
                <Textarea id="gallery-urls" name="urls" rows={6} required placeholder={"https://example.com/look-1.jpg\nhttps://example.com/look-2.jpg"} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="gallery-title">Title</Label>
                  <Input id="gallery-title" name="title" maxLength={80} placeholder="Soft volume set" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="gallery-category">Category</Label>
                  <Input id="gallery-category" name="category" maxLength={40} defaultValue="Classic" />
                </div>
              </div>
              <Button type="submit" disabled={isSaving}>{isSaving ? "Adding…" : "Add to gallery"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {items.length === 0 ? (
        <Card><CardContent className="py-16 text-center"><Images className="mx-auto h-8 w-8 text-muted-foreground" /><h2 className="mt-4 font-display text-2xl">Your gallery is empty</h2><p className="mt-2 text-sm text-muted-foreground">Add finished looks to build your portfolio.</p></CardContent></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-[4/3] bg-secondary">
                {/* Admin-entered URLs are displayed directly so any valid host works. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image_url} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-medium">{item.title}</h2>
                    <p className="mt-1 text-xs text-muted-foreground">{item.category}</p>
                  </div>
                  {item.is_featured ? <Star className="h-5 w-5 fill-primary text-primary" aria-label="Featured" /> : null}
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Switch id={`featured-${item.id}`} checked={item.is_featured} onCheckedChange={() => toggleFeatured(item)} />
                    <Label htmlFor={`featured-${item.id}`} className="text-xs">Featured</Label>
                  </div>
                  <Button type="button" variant="ghost" size="icon" aria-label={`Delete ${item.title}`} onClick={() => removeItem(item)}><Trash2 /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
