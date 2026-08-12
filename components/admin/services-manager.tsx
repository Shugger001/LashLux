"use client";

import { ArrowDown, ArrowUp, Pencil, Plus, Scissors, Trash2 } from "lucide-react";
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
import { formatCurrency, formatDuration } from "@/lib/utils";
import type { Service } from "@/types";

const EMPTY_SERVICE = {
  name: "",
  description: "",
  price: 250,
  duration: 120,
  category: "Classic",
  image_url: "",
};

async function parseError(response: Response) {
  try {
    const body = (await response.json()) as { error?: string };
    return body.error ?? "Request failed.";
  } catch {
    return "Request failed.";
  }
}

/** Service creation, editing, availability, and display ordering. */
export function ServicesManager({ initialServices }: { initialServices: Service[] }) {
  const [services, setServices] = useState(initialServices);
  const [editing, setEditing] = useState<Service | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function saveService(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    const values = new FormData(event.currentTarget);
    const payload = {
      name: String(values.get("name") ?? "").trim(),
      description: String(values.get("description") ?? "").trim(),
      price: Number(values.get("price")),
      duration: Number(values.get("duration")),
      category: String(values.get("category") ?? "").trim(),
      image_url: String(values.get("image_url") ?? "").trim() || null,
    };
    if (
      !payload.name ||
      !payload.description ||
      !payload.category ||
      Number.isNaN(payload.price) ||
      payload.price < 0 ||
      Number.isNaN(payload.duration) ||
      payload.duration < 15
    ) {
      toast.error("Complete all fields with a valid price and duration.");
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/services", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing ? { id: editing.id, ...payload } : payload),
      });
      if (!response.ok) throw new Error(await parseError(response));
      const result = (await response.json()) as { service: Service };
      const saved = result.service;
      setServices((items) =>
        editing
          ? items.map((item) => (item.id === editing.id ? saved : item))
          : [...items, saved].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      );
      setIsOpen(false);
      setEditing(null);
      toast.success(editing ? "Service updated" : "Service added");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Service could not be saved.");
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleService(service: Service) {
    const next = !service.is_active;
    setServices((items) =>
      items.map((item) => (item.id === service.id ? { ...item, is_active: next } : item))
    );
    try {
      const response = await fetch("/api/admin/services", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: service.id, is_active: next }),
      });
      if (!response.ok) throw new Error(await parseError(response));
      toast.success(next ? "Service is now bookable" : "Service hidden from booking");
    } catch (error) {
      setServices((items) =>
        items.map((item) => (item.id === service.id ? service : item))
      );
      toast.error(
        error instanceof Error ? error.message : "Availability could not be updated."
      );
    }
  }

  async function reorder(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= services.length) return;
    const previous = services;
    const reordered = [...services];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    const normalized = reordered.map((item, itemIndex) => ({
      ...item,
      sort_order: itemIndex + 1,
    }));
    setServices(normalized);
    try {
      const response = await fetch("/api/admin/services/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: normalized.map((item) => ({
            id: item.id,
            sort_order: item.sort_order,
          })),
        }),
      });
      if (!response.ok) throw new Error(await parseError(response));
    } catch (error) {
      setServices(previous);
      toast.error(
        error instanceof Error ? error.message : "Service order could not be saved."
      );
    }
  }

  async function removeService(service: Service) {
    if (!window.confirm(`Delete ${service.name}?`)) return;
    try {
      const response = await fetch(
        `/api/admin/services?id=${encodeURIComponent(service.id)}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error(await parseError(response));
      setServices((items) => items.filter((item) => item.id !== service.id));
      toast.success("Service deleted");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Service could not be deleted."
      );
    }
  }

  function openEditor(service: Service | null) {
    setEditing(service);
    setIsOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Service menu</p>
          <h1 className="mt-1 text-4xl text-ink">Services</h1>
          <p className="mt-2 text-muted-foreground">
            Control pricing, timing, order, and booking availability.
          </p>
        </div>
        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) setEditing(null);
          }}
        >
          <DialogTrigger asChild>
            <Button type="button" onClick={() => openEditor(null)}>
              <Plus /> Add service
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit service" : "Add service"}</DialogTitle>
              <DialogDescription>
                Pricing is shown to clients during booking (GH₵).
              </DialogDescription>
            </DialogHeader>
            <form
              key={editing?.id ?? "new-service"}
              className="grid gap-4"
              onSubmit={saveService}
            >
              <div className="grid gap-2">
                <Label htmlFor="service-name">Name</Label>
                <Input
                  id="service-name"
                  name="name"
                  required
                  maxLength={80}
                  defaultValue={editing?.name ?? EMPTY_SERVICE.name}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="service-description">Description</Label>
                <Textarea
                  id="service-description"
                  name="description"
                  required
                  maxLength={1000}
                  defaultValue={editing?.description ?? EMPTY_SERVICE.description}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="grid gap-2">
                  <Label htmlFor="service-price">Price (GH₵)</Label>
                  <Input
                    id="service-price"
                    name="price"
                    type="number"
                    min="0"
                    step="1"
                    required
                    defaultValue={Number(editing?.price ?? EMPTY_SERVICE.price)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="service-duration">Minutes</Label>
                  <Input
                    id="service-duration"
                    name="duration"
                    type="number"
                    min="15"
                    step="15"
                    required
                    defaultValue={editing?.duration ?? EMPTY_SERVICE.duration}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="service-category">Category</Label>
                  <Input
                    id="service-category"
                    name="category"
                    required
                    defaultValue={editing?.category ?? EMPTY_SERVICE.category}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="service-image">Image URL (optional)</Label>
                <Input
                  id="service-image"
                  name="image_url"
                  type="text"
                  inputMode="url"
                  placeholder="https://…"
                  defaultValue={editing?.image_url ?? EMPTY_SERVICE.image_url}
                />
              </div>
              <Button type="submit" disabled={isSaving} aria-busy={isSaving}>
                {isSaving ? "Saving…" : editing ? "Save changes" : "Add service"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {services.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Scissors className="mx-auto h-8 w-8 text-muted-foreground" />
            <h2 className="mt-4 font-display text-2xl">No services yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Add your first bookable lash service.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {services.map((service, index) => (
            <Card key={service.id}>
              <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-display text-2xl">{service.name}</h2>
                    <span className="rounded-md bg-secondary px-2 py-1 text-xs">
                      {service.category}
                    </span>
                    {!service.is_active ? (
                      <span className="rounded-md bg-destructive/10 px-2 py-1 text-xs text-destructive">
                        Hidden
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {service.description}
                  </p>
                  <p className="mt-2 text-sm font-medium">
                    {formatCurrency(Number(service.price))} ·{" "}
                    {formatDuration(service.duration)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Label
                    htmlFor={`active-${service.id}`}
                    className="mr-1 text-xs text-muted-foreground"
                  >
                    Active
                  </Label>
                  <Switch
                    id={`active-${service.id}`}
                    checked={service.is_active}
                    onCheckedChange={() => toggleService(service)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={index === 0}
                    aria-label={`Move ${service.name} up`}
                    onClick={() => reorder(index, -1)}
                  >
                    <ArrowUp />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={index === services.length - 1}
                    aria-label={`Move ${service.name} down`}
                    onClick={() => reorder(index, 1)}
                  >
                    <ArrowDown />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => openEditor(service)}
                  >
                    <Pencil /> Edit
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${service.name}`}
                    onClick={() => removeService(service)}
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
