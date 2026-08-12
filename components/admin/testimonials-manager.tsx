"use client";

import { Check, MessageSquareQuote, Pencil, Plus, Star, Trash2, X } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge, Card, CardContent } from "@/components/ui/card";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Testimonial } from "@/types";

/** Testimonial moderation, editing, creation, and sorting. */
export function TestimonialsManager({ initialTestimonials }: { initialTestimonials: Testimonial[] }) {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [sort, setSort] = useState("date");
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const sorted = useMemo(
    () => [...testimonials].sort((a, b) => sort === "rating" ? b.rating - a.rating : b.created_at.localeCompare(a.created_at)),
    [sort, testimonials]
  );

  async function saveTestimonial(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    const values = new FormData(event.currentTarget);
    const payload = {
      client_name: String(values.get("client_name") ?? "").trim(),
      content: String(values.get("content") ?? "").trim(),
      rating: Number(values.get("rating")),
      service_used: String(values.get("service_used") ?? "").trim() || null,
      client_image: null,
      is_approved: editing?.is_approved ?? true,
    };
    if (!payload.client_name || payload.content.length < 10 || payload.rating < 1 || payload.rating > 5) {
      toast.error("Add a client name, review, and rating from 1-5.");
      setIsSaving(false);
      return;
    }
    let saved: Testimonial;
    try {
      const response = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing ? { id: editing.id, ...payload } : payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Testimonial could not be saved.");
      saved = result.testimonial as Testimonial;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Testimonial could not be saved.");
      setIsSaving(false);
      return;
    }
    setTestimonials((items) => editing ? items.map((item) => item.id === editing.id ? saved : item) : [saved, ...items]);
    setIsSaving(false);
    setIsOpen(false);
    setEditing(null);
    toast.success(editing ? "Testimonial updated" : "Testimonial added");
  }

  async function moderate(item: Testimonial, approved: boolean) {
    setTestimonials((items) => items.map((value) => value.id === item.id ? { ...value, is_approved: approved } : value));
    try {
      const response = await fetch("/api/admin/testimonials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, is_approved: approved }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Approval state could not be updated.");
      toast.success(approved ? "Testimonial approved" : "Testimonial rejected");
    } catch (error) {
      setTestimonials((items) => items.map((value) => value.id === item.id ? item : value));
      toast.error(error instanceof Error ? error.message : "Approval state could not be updated.");
    }
  }

  async function remove(item: Testimonial) {
    if (!window.confirm(`Delete testimonial from ${item.client_name}?`)) return;
    try {
      const response = await fetch(
        `/api/admin/testimonials?id=${encodeURIComponent(item.id)}`,
        { method: "DELETE" }
      );
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error ?? "Testimonial could not be deleted.");
      setTestimonials((items) => items.filter((value) => value.id !== item.id));
      toast.success("Testimonial deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Testimonial could not be deleted.");
    }
  }

  function openEditor(item: Testimonial | null) {
    setEditing(item);
    setIsOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Social proof</p>
          <h1 className="mt-1 text-4xl text-ink">Testimonials</h1>
          <p className="mt-2 text-muted-foreground">Review client feedback before it appears publicly.</p>
        </div>
        <div className="flex gap-3">
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-40" aria-label="Sort testimonials"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="date">Newest first</SelectItem><SelectItem value="rating">Highest rating</SelectItem></SelectContent>
          </Select>
          <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) setEditing(null); }}>
            <DialogTrigger asChild><Button onClick={() => openEditor(null)}><Plus /> Add</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editing ? "Edit testimonial" : "Add testimonial"}</DialogTitle>
                <DialogDescription>Only use feedback the client has agreed to share.</DialogDescription>
              </DialogHeader>
              <form className="grid gap-4" onSubmit={saveTestimonial}>
                <div className="grid gap-2"><Label htmlFor="testimonial-name">Client name</Label><Input id="testimonial-name" name="client_name" required maxLength={80} defaultValue={editing?.client_name ?? ""} /></div>
                <div className="grid gap-2"><Label htmlFor="testimonial-content">Testimonial</Label><Textarea id="testimonial-content" name="content" required minLength={10} maxLength={800} rows={5} defaultValue={editing?.content ?? ""} /></div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2"><Label htmlFor="testimonial-rating">Rating</Label><Input id="testimonial-rating" name="rating" type="number" min="1" max="5" required defaultValue={editing?.rating ?? 5} /></div>
                  <div className="grid gap-2"><Label htmlFor="testimonial-service">Service used</Label><Input id="testimonial-service" name="service_used" maxLength={80} defaultValue={editing?.service_used ?? ""} /></div>
                </div>
                <Button type="submit" disabled={isSaving}>{isSaving ? "Saving…" : editing ? "Save changes" : "Add testimonial"}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {sorted.length === 0 ? (
        <Card><CardContent className="py-16 text-center"><MessageSquareQuote className="mx-auto h-8 w-8 text-muted-foreground" /><h2 className="mt-4 font-display text-2xl">No testimonials yet</h2></CardContent></Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {sorted.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-medium">{item.client_name}</h2>
                      <Badge className={item.is_approved ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-800"}>{item.is_approved ? "Approved" : "Pending"}</Badge>
                    </div>
                    <div className="mt-2 flex" aria-label={`${item.rating} out of 5 stars`}>
                      {Array.from({ length: 5 }, (_, index) => <Star key={index} className={`h-4 w-4 ${index < item.rating ? "fill-primary text-primary" : "text-border"}`} aria-hidden />)}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
                <blockquote className="mt-4 text-sm leading-6 text-muted-foreground">“{item.content}”</blockquote>
                {item.service_used ? <p className="mt-3 text-xs font-medium">{item.service_used}</p> : null}
                <div className="mt-5 flex flex-wrap gap-2">
                  {!item.is_approved ? <Button size="sm" onClick={() => moderate(item, true)}><Check /> Approve</Button> : <Button size="sm" variant="outline" onClick={() => moderate(item, false)}><X /> Reject</Button>}
                  <Button size="sm" variant="outline" onClick={() => openEditor(item)}><Pencil /> Edit</Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(item)}><Trash2 /> Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
