"use client";

import { CalendarOff, Plus, Trash2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatTime } from "@/lib/utils";
import type { BlockedTime } from "@/types";

/** Manage closed days and blocked appointment windows. */
export function BlockedTimesManager({
  initialBlocks,
}: {
  initialBlocks: BlockedTime[];
}) {
  const [blocks, setBlocks] = useState(initialBlocks);
  const [allDay, setAllDay] = useState(true);
  const [saving, setSaving] = useState(false);

  async function onCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSaving(true);
    try {
      const response = await fetch("/api/admin/blocked-times", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blockDate: String(form.get("blockDate") ?? ""),
          allDay,
          startTime: allDay ? null : String(form.get("startTime") ?? ""),
          endTime: allDay ? null : String(form.get("endTime") ?? ""),
          reason: String(form.get("reason") ?? ""),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not save block");
      if (result.block) {
        setBlocks((items) =>
          [...items, result.block as BlockedTime].sort((a, b) =>
            a.block_date.localeCompare(b.block_date)
          )
        );
      }
      toast.success("Blocked time saved");
      event.currentTarget.reset();
      setAllDay(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    if (!window.confirm("Remove this blocked time?")) return;
    const previous = blocks;
    setBlocks((items) => items.filter((item) => item.id !== id));
    const response = await fetch(`/api/admin/blocked-times?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      setBlocks(previous);
      toast.error("Could not delete block");
      return;
    }
    toast.success("Block removed");
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Availability</p>
        <h1 className="mt-1 text-4xl text-ink">Blocked times</h1>
        <p className="mt-2 text-muted-foreground">
          Close holidays or lunch breaks so clients cannot book those slots.
        </p>
      </div>

      <Card>
        <CardContent className="p-5">
          <form className="grid gap-4 md:grid-cols-2" onSubmit={onCreate}>
            <div className="space-y-2">
              <Label htmlFor="blockDate">Date</Label>
              <Input id="blockDate" name="blockDate" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason (optional)</Label>
              <Input id="reason" name="reason" maxLength={200} placeholder="Holiday, training, lunch" />
            </div>
            <label className="flex items-center gap-2 text-sm md:col-span-2">
              <input
                type="checkbox"
                checked={allDay}
                onChange={(event) => setAllDay(event.target.checked)}
              />
              Block the entire day
            </label>
            {!allDay && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start</Label>
                  <Input id="startTime" name="startTime" type="time" required={!allDay} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End</Label>
                  <Input id="endTime" name="endTime" type="time" required={!allDay} />
                </div>
              </>
            )}
            <div className="md:col-span-2">
              <Button type="submit" disabled={saving} aria-busy={saving}>
                <Plus aria-hidden />
                {saving ? "Saving…" : "Add blocked time"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {blocks.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <CalendarOff className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden />
            <h2 className="mt-4 font-display text-2xl">No upcoming blocks</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Add a holiday or break to keep the booking calendar accurate.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {blocks.map((block) => (
            <Card key={block.id}>
              <CardContent className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="font-medium">
                    {new Date(`${block.block_date}T12:00:00`).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {!block.start_time || !block.end_time
                      ? "All day"
                      : `${formatTime(String(block.start_time))} - ${formatTime(String(block.end_time))}`}
                    {block.reason ? ` · ${block.reason}` : ""}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Delete blocked time"
                  onClick={() => onDelete(block.id)}
                >
                  <Trash2 />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
