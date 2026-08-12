"use client";

import {
  CalendarDays,
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
import { formatCurrency, formatTime } from "@/lib/utils";
import type { AdminStats } from "@/types";

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-800 border-amber-200",
  confirmed: "bg-blue-50 text-blue-800 border-blue-200",
  completed: "bg-emerald-50 text-emerald-800 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

/** Dashboard metrics, weekly chart, and operational shortcuts. */
export function DashboardOverview({ stats }: { stats: AdminStats }) {
  const cards = [
    {
      label: "Appointments",
      value: String(stats.totalAppointments),
      note: "All-time bookings",
      icon: CalendarDays,
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
    {
      label: "Popular service",
      value: stats.popularService,
      note: "Most booked",
      icon: Scissors,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-primary">Studio overview</p>
        <h1 className="mt-1 text-4xl text-ink">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          A quick look at bookings, revenue, and client activity.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Key metrics">
        {cards.map((item) => (
          <Card key={item.label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="mt-2 truncate font-display text-3xl text-ink">
                    {item.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.note}</p>
                </div>
                <span className="rounded-lg bg-secondary p-3 text-primary">
                  <item.icon className="h-5 w-5" aria-hidden />
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

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
              ["/admin/appointments", "Manage appointments", "Confirm or reschedule bookings"],
              ["/admin/services", "Add a service", "Update pricing and availability"],
              ["/admin/clients", "Message clients", "Send a thoughtful promotion"],
            ].map(([href, label, detail]) => (
              <Link
                key={href}
                href={href}
                className="rounded-lg border border-border p-4 transition-colors hover:border-primary/40 hover:bg-secondary focus-ring"
              >
                <span className="block text-sm font-medium">{label}</span>
                <span className="mt-1 block text-xs text-muted-foreground">{detail}</span>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Recent appointments</CardTitle>
          <Link href="/admin/appointments" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </CardHeader>
        <CardContent>
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
                      {appointment.client_name ?? appointment.user?.full_name ?? "Client"}
                    </td>
                    <td className="py-4 text-muted-foreground">
                      {appointment.service?.name ?? "Service"}
                    </td>
                    <td className="py-4 text-muted-foreground">
                      {new Date(`${appointment.appointment_date}T12:00:00`).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      at {formatTime(appointment.appointment_time)}
                    </td>
                    <td className="py-4">
                      <Badge className={STATUS_STYLES[appointment.status]}>
                        {appointment.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
