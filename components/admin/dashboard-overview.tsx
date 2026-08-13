"use client";

import {
  CalendarDays,
  CircleAlert,
  CircleDollarSign,
  Scissors,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency, formatTime } from "@/lib/utils";
import type { AdminStats } from "@/types";

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-800 border-amber-200",
  confirmed: "bg-blue-50 text-blue-800 border-blue-200",
  completed: "bg-emerald-50 text-emerald-800 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  no_show: "bg-stone-100 text-stone-700 border-stone-300",
};

/** Dashboard metrics, today's board, weekly chart, and operational shortcuts. */
export function DashboardOverview({ stats }: { stats: AdminStats }) {
  const capacityFull = stats.todayActiveCount >= stats.todayCapacity;
  const cards = [
    {
      label: "Pending",
      value: String(stats.pendingCount),
      note: "Needs confirmation",
      icon: CircleAlert,
      href: "/admin/appointments?status=pending",
      emphasize: stats.pendingCount > 0,
    },
    {
      label: "Today",
      value: `${stats.todayActiveCount}/${stats.todayCapacity}`,
      note: capacityFull ? "Day is full" : "Active slots used",
      icon: CalendarDays,
      href: `/admin/appointments?date=${stats.todayDate}&view=day`,
      emphasize: capacityFull,
    },
    {
      label: "Revenue",
      value: formatCurrency(stats.revenue),
      note: "Completed services",
      icon: CircleDollarSign,
    },
    {
      label: "New clients",
      value: String(stats.newClients),
      note: "Last 30 days",
      icon: UserPlus,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-primary">Studio overview</p>
        <h1 className="mt-1 text-4xl text-ink">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Confirm requests, watch today&apos;s capacity, and keep the schedule moving.
        </p>
      </div>

      {stats.pendingCount > 0 ? (
        <div
          className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50/90 p-4 sm:flex-row sm:items-center sm:justify-between"
          role="status"
        >
          <div className="flex items-start gap-3">
            <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden />
            <div>
              <p className="font-medium text-amber-950">
                {stats.pendingCount} appointment
                {stats.pendingCount === 1 ? "" : "s"} waiting for confirmation
              </p>
              <p className="mt-1 text-sm text-amber-900/80">
                Review pending requests so clients know their slot is held.
              </p>
            </div>
          </div>
          <Button asChild className="shrink-0">
            <Link href="/admin/appointments?status=pending">Review pending</Link>
          </Button>
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Key metrics">
        {cards.map((item) => {
          const content = (
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="mt-2 truncate font-display text-3xl text-ink">
                    {item.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.note}</p>
                </div>
                <span
                  className={cn(
                    "rounded-lg p-3",
                    item.emphasize
                      ? "bg-amber-100 text-amber-800"
                      : "bg-secondary text-primary"
                  )}
                >
                  <item.icon className="h-5 w-5" aria-hidden />
                </span>
              </div>
            </CardContent>
          );

          return item.href ? (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-xl focus-ring"
            >
              <Card className="h-full transition-colors hover:border-primary/40">
                {content}
              </Card>
            </Link>
          ) : (
            <Card key={item.label}>{content}</Card>
          );
        })}
      </section>

      <Card>
        <CardHeader className="flex-row items-center justify-between gap-3">
          <div>
            <CardTitle>Today&apos;s schedule</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {new Date(`${stats.todayDate}T12:00:00`).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
              {" · "}
              {stats.todayActiveCount}/{stats.todayCapacity} slots
              {stats.popularService !== "-"
                ? ` · popular: ${stats.popularService}`
                : ""}
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href={`/admin/appointments?date=${stats.todayDate}&view=day`}>
              Open day view
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {stats.todayAppointments.length ? (
            <ul className="divide-y divide-border">
              {stats.todayAppointments.map((appointment) => (
                <li
                  key={appointment.id}
                  className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-ink">
                      {formatTime(appointment.appointment_time)} ·{" "}
                      {appointment.client_name ??
                        appointment.user?.full_name ??
                        "Client"}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {appointment.service?.name ?? "Service"}
                      {appointment.client_phone
                        ? ` · ${appointment.client_phone}`
                        : ""}
                    </p>
                  </div>
                  <Badge className={STATUS_STYLES[appointment.status]}>
                    {appointment.status.replace("_", " ")}
                  </Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-lg bg-secondary/60 p-5 text-sm text-muted-foreground">
              No appointments booked for today yet.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(18rem,0.7fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Weekly bookings</CardTitle>
            <p className="text-sm text-muted-foreground">
              New appointment requests over the last seven days.
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-72" aria-label="Weekly bookings bar chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.weeklyBookings}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8ddd4" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} width={24} />
                  <Tooltip
                    cursor={{ fill: "rgba(193,122,107,.08)" }}
                    contentStyle={{ borderRadius: 12, borderColor: "#e8ddd4" }}
                  />
                  <Bar dataKey="count" name="Bookings" fill="#c17a6b" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {[
              [
                "/admin/appointments?status=pending",
                "Confirm pending",
                stats.pendingCount
                  ? `${stats.pendingCount} waiting`
                  : "No pending requests",
              ],
              [
                `/admin/appointments?date=${stats.todayDate}&view=day`,
                "Today's board",
                `${stats.todayActiveCount}/${stats.todayCapacity} slots used`,
              ],
              ["/admin/messages", "Contact inbox", "Read website contact messages"],
              ["/admin/services", "Edit services", "Update pricing and availability"],
              ["/admin/clients", "Message clients", "Send a thoughtful promotion"],
            ].map(([href, label, detail]) => (
              <Link
                key={href}
                href={href}
                className="rounded-lg border border-border p-4 transition-colors hover:border-primary/40 hover:bg-secondary focus-ring"
              >
                <span className="block text-sm font-medium">{label}</span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {detail}
                </span>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>Recent appointments</CardTitle>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Scissors className="h-3.5 w-3.5" aria-hidden />
              {stats.popularService}
            </span>
          </div>
          <Link
            href="/admin/appointments"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {stats.recentAppointments.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="pb-3 font-medium">Client</th>
                    <th className="pb-3 font-medium">Service</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {stats.recentAppointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td className="py-4 font-medium">
                        {appointment.client_name ??
                          appointment.user?.full_name ??
                          "Client"}
                      </td>
                      <td className="py-4 text-muted-foreground">
                        {appointment.service?.name ?? "Service"}
                      </td>
                      <td className="py-4 text-muted-foreground">
                        {new Date(
                          `${appointment.appointment_date}T12:00:00`
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        at {formatTime(appointment.appointment_time)}
                      </td>
                      <td className="py-4">
                        <Badge className={STATUS_STYLES[appointment.status]}>
                          {appointment.status.replace("_", " ")}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No appointments yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
