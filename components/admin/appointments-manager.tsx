"use client";

import { CalendarPlus, List, Rows3, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge, Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { APPOINTMENT_STATUSES } from "@/lib/constants";
import { buildICalEvent, formatCurrency, formatTime } from "@/lib/utils";
import type { Appointment, AppointmentStatus } from "@/types";

type ViewMode = "list" | "week" | "day";

const statusStyles = {
  pending: "bg-amber-50 text-amber-800 border-amber-200",
  confirmed: "bg-blue-50 text-blue-800 border-blue-200",
  completed: "bg-emerald-50 text-emerald-800 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  no_show: "bg-stone-100 text-stone-700 border-stone-300",
};

/** Appointment filters, calendar export, and status management. */
export function AppointmentsManager({
  initialAppointments,
}: {
  initialAppointments: Appointment[];
}) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [status, setStatus] = useState("all");
  const [date, setDate] = useState("");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<ViewMode>("list");
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(
    () =>
      appointments.filter((appointment) => {
        const haystack = `${appointment.client_name} ${appointment.client_email} ${appointment.service?.name}`.toLowerCase();
        return (
          (status === "all" || appointment.status === status) &&
          (!date || appointment.appointment_date === date) &&
          (!query || haystack.includes(query.toLowerCase()))
        );
      }),
    [appointments, date, query, status]
  );

  async function updateStatus(id: string, nextStatus: AppointmentStatus) {
    const previous = appointments;
    setAppointments((items) =>
      items.map((item) =>
        item.id === id ? { ...item, status: nextStatus } : item
      )
    );
    try {
      const response = await fetch("/api/admin/appointments/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus, notify: true }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Update failed");
      toast.success(
        result.emailSent
          ? `Marked ${nextStatus} · client emailed`
          : `Appointment marked ${nextStatus}`
      );
    } catch (error) {
      setAppointments(previous);
      toast.error(
        error instanceof Error ? error.message : "Status could not be updated."
      );
    }
  }

  async function deleteAppointment(id: string) {
    if (!window.confirm("Delete this appointment? This cannot be undone.")) return;
    const previous = appointments;
    setAppointments((items) => items.filter((item) => item.id !== id));
    try {
      const response = await fetch(
        `/api/admin/appointments?id=${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          typeof result.error === "string" ? result.error : "Delete failed"
        );
      }
      setSelected((ids) => ids.filter((item) => item !== id));
      toast.success("Appointment deleted");
    } catch (error) {
      setAppointments(previous);
      toast.error(
        error instanceof Error ? error.message : "Appointment could not be deleted."
      );
    }
  }

  function exportCalendar() {
    const chosen = selected.length
      ? appointments.filter((item) => selected.includes(item.id))
      : filtered;
    if (!chosen.length) {
      toast.error("There are no appointments to export.");
      return;
    }
    const events = chosen.map((appointment) =>
      buildICalEvent({
        id: appointment.id,
        title: `${appointment.service?.name ?? "Lash appointment"}, ${appointment.client_name ?? "Client"}`,
        date: appointment.appointment_date,
        time: appointment.appointment_time,
        durationMinutes: appointment.service?.duration ?? 60,
        description: appointment.notes ?? undefined,
      })
        .split("\r\n")
        .slice(3, -1)
        .join("\r\n")
    );
    const calendar = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Lash Lux//Appointments//EN",
      ...events,
      "END:VCALENDAR",
    ].join("\r\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([calendar], { type: "text/calendar" }));
    link.download = "lashlux-appointments.ics";
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success(`Exported ${chosen.length} appointment${chosen.length === 1 ? "" : "s"}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Booking operations</p>
          <h1 className="mt-1 text-4xl text-ink">Appointments</h1>
          <p className="mt-2 text-muted-foreground">
            Confirm bookings, update outcomes, and export your schedule.
          </p>
        </div>
        <Button type="button" onClick={exportCalendar}>
          <CalendarPlus aria-hidden />
          Export {selected.length ? `selected (${selected.length})` : "all"}
        </Button>
      </div>

      <Card>
        <CardContent className="grid gap-3 p-4 md:grid-cols-[minmax(14rem,1fr)_12rem_11rem_auto]">
          <label className="relative">
            <span className="sr-only">Search appointments</span>
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" aria-hidden />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search client or service"
              className="pl-9"
            />
          </label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger aria-label="Filter by status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {APPOINTMENT_STATUSES.map((item) => (
                <SelectItem key={item} value={item}>
                  {item[0].toUpperCase() + item.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={date}
            aria-label="Filter by date"
            onChange={(event) => setDate(event.target.value)}
          />
          <div className="flex rounded-md border border-border p-1">
            <Button
              type="button"
              size="sm"
              variant={view === "list" ? "secondary" : "ghost"}
              onClick={() => setView("list")}
              aria-pressed={view === "list"}
            >
              <List /> List
            </Button>
            <Button
              type="button"
              size="sm"
              variant={view === "day" ? "secondary" : "ghost"}
              onClick={() => {
                setView("day");
                if (!date) setDate(new Date().toISOString().slice(0, 10));
              }}
              aria-pressed={view === "day"}
            >
              Day
            </Button>
            <Button
              type="button"
              size="sm"
              variant={view === "week" ? "secondary" : "ghost"}
              onClick={() => setView("week")}
              aria-pressed={view === "week"}
            >
              <Rows3 /> Week
            </Button>
          </div>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <CalendarPlus className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden />
            <h2 className="mt-4 font-display text-2xl">No appointments found</h2>
            <p className="mt-2 text-sm text-muted-foreground">Clear a filter to see more bookings.</p>
          </CardContent>
        </Card>
      ) : view === "day" ? (
        <Card>
          <CardContent className="space-y-3 p-5">
            <h2 className="font-display text-2xl">
              {new Date(`${date || filtered[0]?.appointment_date}T12:00:00`).toLocaleDateString(
                "en-US",
                { weekday: "long", month: "long", day: "numeric" }
              )}
            </h2>
            {[...filtered]
              .sort((a, b) => a.appointment_time.localeCompare(b.appointment_time))
              .map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex flex-col gap-3 rounded-xl border border-border bg-secondary/40 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">
                      {formatTime(appointment.appointment_time)} ·{" "}
                      {appointment.client_name ?? "Client"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.service?.name}
                      {appointment.payment_status === "paid"
                        ? " · deposit paid"
                        : appointment.payment_status === "pending"
                          ? " · deposit pending"
                          : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(["confirmed", "completed", "no_show", "cancelled"] as AppointmentStatus[]).map(
                      (next) => (
                        <Button
                          key={next}
                          type="button"
                          size="sm"
                          variant={appointment.status === next ? "primary" : "outline"}
                          onClick={() => updateStatus(appointment.id, next)}
                        >
                          {next.replace("_", " ")}
                        </Button>
                      )
                    )}
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      ) : view === "week" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Object.entries(
            filtered.reduce<Record<string, Appointment[]>>((groups, appointment) => {
              (groups[appointment.appointment_date] ??= []).push(appointment);
              return groups;
            }, {})
          ).map(([day, items]) => (
            <Card key={day}>
              <CardContent className="p-5">
                <h2 className="font-display text-2xl">
                  {new Date(`${day}T12:00:00`).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </h2>
                <div className="mt-4 space-y-3">
                  {items.map((appointment) => (
                    <div key={appointment.id} className="rounded-lg bg-secondary/70 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium">{formatTime(appointment.appointment_time)}</span>
                        <Badge className={statusStyles[appointment.status]}>{appointment.status}</Badge>
                      </div>
                      <p className="mt-2 text-sm">{appointment.client_name ?? "Client"}</p>
                      <p className="text-xs text-muted-foreground">{appointment.service?.name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-secondary/60 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="w-12 px-5 py-3">
                      <input
                        type="checkbox"
                        aria-label="Select all visible appointments"
                        checked={filtered.every((item) => selected.includes(item.id))}
                        onChange={(event) =>
                          setSelected(
                            event.target.checked
                              ? Array.from(new Set([...selected, ...filtered.map((item) => item.id)]))
                              : selected.filter((id) => !filtered.some((item) => item.id === id))
                          )
                        }
                      />
                    </th>
                    {["Client", "Service", "Date & time", "Value", "Status", "Actions"].map((heading) => (
                      <th key={heading} className="px-4 py-3 font-medium">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-secondary/30">
                      <td className="px-5 py-4">
                        <input
                          type="checkbox"
                          aria-label={`Select ${appointment.client_name ?? "appointment"}`}
                          checked={selected.includes(appointment.id)}
                          onChange={(event) =>
                            setSelected((ids) =>
                              event.target.checked
                                ? [...ids, appointment.id]
                                : ids.filter((id) => id !== appointment.id)
                            )
                          }
                        />
                      </td>
                      <td className="px-4 py-4">
                        <span className="block font-medium">{appointment.client_name ?? "Client"}</span>
                        <span className="block text-xs text-muted-foreground">{appointment.client_email}</span>
                      </td>
                      <td className="px-4 py-4">{appointment.service?.name ?? "Service"}</td>
                      <td className="px-4 py-4 text-muted-foreground">
                        {new Date(`${appointment.appointment_date}T12:00:00`).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        · {formatTime(appointment.appointment_time)}
                      </td>
                      <td className="px-4 py-4">{formatCurrency(appointment.service?.price ?? 0)}</td>
                      <td className="px-4 py-4">
                        <Select
                          value={appointment.status}
                          onValueChange={(value) =>
                            updateStatus(appointment.id, value as AppointmentStatus)
                          }
                        >
                          <SelectTrigger className="h-9 w-32" aria-label="Update status">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {APPOINTMENT_STATUSES.map((item) => (
                              <SelectItem key={item} value={item}>{item}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-4">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Delete appointment for ${appointment.client_name ?? "client"}`}
                          onClick={() => deleteAppointment(appointment.id)}
                        >
                          <Trash2 />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
