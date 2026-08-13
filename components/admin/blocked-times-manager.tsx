"use client";

import { CalendarOff, Plus, Trash2 } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatTime } from "@/lib/utils";
import type { BlockedTime } from "@/types";

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(base: Date, days: number) {
  const next = new Date(base);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function nextSunday(from = new Date()) {
  const day = from.getUTCDay();
  const delta = day === 0 ? 7 : 7 - day;
  return addDays(from, delta);
}

/** Manage closed days and blocked appointment windows. */
export function BlockedTimesManager({
  initialBlocks,
}: {
  initialBlocks: BlockedTime[];
}) {
  const [blocks, setBlocks] = useState(initialBlocks);
  const [allDay, setAllDay] = useState(true);
  const [saving, setSaving] = useState(false);
  const [blockDate, setBlockDate] = useState("");
  const [reason, setReason] = useState("");

  const todayKey = toDateKey(new Date());
  const { upcoming, past } = useMemo(() => {
    const sorted = [...blocks].sort((a, b) =>
      a.block_date.localeCompare(b.block_date)
    );
    return {
      upcoming: sorted.filter((item) => item.block_date >= todayKey),
      past: sorted
        .filter((item) => item.block_date < todayKey)
        .sort((a, b) => b.block_date.localeCompare(a.block_date)),
    };
  }, [blocks, todayKey]);

  function applyPreset(kind: "today" | "tomorrow" | "sunday" | "lunch") {
    const now = new Date();
    if (kind === "today") {
      setBlockDate(toDateKey(now));
      setAllDay(true);
      setReason("Unavailable today");
      return;
    }
    if (kind === "tomorrow") {
      setBlockDate(toDateKey(addDays(now, 1)));
      setAllDay(true);
      setReason("Unavailable");
      return;
    }
    if (kind === "sunday") {
      setBlockDate(toDateKey(nextSunday(now)));
      setAllDay(true);
      setReason("Sunday closed");
      return;
    }
    setBlockDate(toDateKey(now));
    setAllDay(false);
    setReason("Lunch break");
  }

  async function onCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSaving(true);
    try {
      const response = await fetch("/api/admin/blocked-times", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blockDate: blockDate || String(form.get("blockDate") ?? ""),
          allDay,
          startTime: allDay
            ? null
            : String(form.get("startTime") || "13:00"),
          endTime: allDay ? null : String(form.get("endTime") || "14:00"),
          reason: reason || String(form.get("reason") ?? ""),
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
      setBlockDate("");
      setReason("");
      setAllDay(true);
      event.currentTarget.reset();
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
    const response = await fetch(
      `/api/admin/blocked-times?id=${encodeURIComponent(id)}`,
      { method: "DELETE" }
    );
    if (!response.ok) {
      setBlocks(previous);
      toast.error("Could not delete block");
      return;
    }
    toast.success("Block removed");
  }

  function BlockList({
    items,
    emptyTitle,
    emptyBody,
  }: {
    items: BlockedTime[];
    emptyTitle: string;
    emptyBody: string;
  }) {
    if (!items.length) {
      return (
        <Card>
          <CardContent className="py-10 text-center">
            <CalendarOff
              className="mx-auto h-7 w-7 text-muted-foreground"
              aria-hidden
            />
            <h3 className="mt-3 font-display text-xl">{emptyTitle}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{emptyBody}</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-3">
        {items.map((block) => (
          <Card key={block.id}>
            <CardContent className="flex items-center justify-between gap-4 p-4">
              <div>
                <p className="font-medium">
                  {new Date(`${block.block_date}T12:00:00`).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
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
    );
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
        <CardContent className="space-y-5 p-5">
          <div>
            <p className="text-sm font-medium text-ink">Quick presets</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button type="button" size="sm" variant="outline" onClick={() => applyPreset("today")}>
                Block today
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => applyPreset("tomorrow")}>
                Block tomorrow
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => applyPreset("sunday")}>
                Next Sunday
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => applyPreset("lunch")}>
                Lunch today
              </Button>
            </div>
          </div>

          <form className="grid gap-4 md:grid-cols-2" onSubmit={onCreate}>
            <div className="space-y-2">
              <Label htmlFor="blockDate">Date</Label>
              <Input
                id="blockDate"
                name="blockDate"
                type="date"
                required
                min={todayKey}
                value={blockDate}
                onChange={(event) => setBlockDate(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason (optional)</Label>
              <Input
                id="reason"
                name="reason"
                maxLength={200}
                placeholder="Holiday, training, lunch"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
              />
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
                  <Input
                    id="startTime"
                    name="startTime"
                    type="time"
                    defaultValue="13:00"
                    required={!allDay}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End</Label>
                  <Input
                    id="endTime"
                    name="endTime"
                    type="time"
                    defaultValue="14:00"
                    required={!allDay}
                  />
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

      <section className="space-y-3" aria-labelledby="upcoming-blocks-title">
        <div className="flex items-end justify-between gap-3">
          <h2 id="upcoming-blocks-title" className="font-display text-2xl text-ink">
            Upcoming
          </h2>
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
            {upcoming.length}
          </p>
        </div>
        <BlockList
          items={upcoming}
          emptyTitle="No upcoming blocks"
          emptyBody="Add a holiday or break to keep the booking calendar accurate."
        />
      </section>

      {past.length > 0 ? (
        <section className="space-y-3" aria-labelledby="past-blocks-title">
          <div className="flex items-end justify-between gap-3">
            <h2 id="past-blocks-title" className="font-display text-2xl text-ink">
              Past
            </h2>
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              {past.length}
            </p>
          </div>
          <BlockList
            items={past}
            emptyTitle="No past blocks"
            emptyBody="Older blocked times will appear here."
          />
        </section>
      ) : null}
    </div>
  );
}
