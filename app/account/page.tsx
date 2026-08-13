import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";
import {
  createAdminClient,
  createClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { cn, formatTime } from "@/lib/utils";
import { whatsappHref } from "@/lib/whatsapp";
import type { AppointmentStatus } from "@/types";

export const metadata: Metadata = pageMetadata({
  title: "Your Account",
  description: "View your Lash Lux appointment requests and confirmed sessions.",
  path: "/account",
  noIndex: true,
});

interface AccountAppointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: AppointmentStatus;
  service: { name: string } | { name: string }[] | null;
}

const statusStyles: Record<AppointmentStatus, string> = {
  pending: "bg-warning/10 text-warning",
  confirmed: "bg-success/10 text-success",
  completed: "bg-secondary text-muted-foreground",
  cancelled: "bg-destructive/10 text-destructive",
  no_show: "bg-muted text-muted-foreground",
};

function getServiceName(service: AccountAppointment["service"]) {
  if (Array.isArray(service)) return service[0]?.name ?? "Lash service";
  return service?.name ?? "Lash service";
}

function appointmentStamp(appointment: AccountAppointment) {
  return `${appointment.appointment_date}T${appointment.appointment_time}`;
}

function isUpcoming(appointment: AccountAppointment) {
  if (
    appointment.status === "cancelled" ||
    appointment.status === "completed" ||
    appointment.status === "no_show"
  ) {
    return false;
  }
  const when = new Date(
    `${appointment.appointment_date}T${appointment.appointment_time}`
  );
  return Number.isFinite(when.getTime()) && when.getTime() >= Date.now();
}

function AppointmentRow({ appointment }: { appointment: AccountAppointment }) {
  const serviceName = getServiceName(appointment.service);
  const dateLabel = new Date(
    `${appointment.appointment_date}T12:00:00`
  ).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timeLabel = formatTime(appointment.appointment_time);
  const helpHref = whatsappHref(
    `Hi Lash Lux! I have a question about my ${serviceName} appointment on ${dateLabel} at ${timeLabel} (ref ${appointment.id.slice(0, 8)}).`
  );

  return (
    <li className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="font-display text-xl text-ink">{serviceName}</h3>
        <p className="mt-1 tabular-nums text-sm text-muted-foreground">
          {dateLabel} at {timeLabel}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize",
            statusStyles[appointment.status]
          )}
        >
          {appointment.status.replace("_", " ")}
        </span>
        {(appointment.status === "pending" ||
          appointment.status === "confirmed") && (
          <Button asChild size="sm" variant="outline">
            <a href={helpHref} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </Button>
        )}
      </div>
    </li>
  );
}

/** Client account view with appointments linked by auth ID or booking email. */
export default async function AccountPage() {
  if (!isSupabaseConfigured()) return <SignedOutAccount />;

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <SignedOutAccount />;

  let appointments: AccountAppointment[] = [];
  let loadError = false;

  try {
    const admin = createAdminClient();
    const select =
      "id, appointment_date, appointment_time, status, service:services(name)";
    const queries = [
      admin.from("appointments").select(select).eq("user_id", user.id),
    ];

    if (user.email) {
      queries.push(
        admin
          .from("appointments")
          .select(select)
          .eq("client_email", user.email.toLowerCase())
      );
    }

    const results = await Promise.all(queries);
    loadError = results.some((result) => Boolean(result.error));

    const uniqueAppointments = new Map<string, AccountAppointment>();
    results.forEach((result) => {
      (result.data ?? []).forEach((appointment) => {
        uniqueAppointments.set(
          appointment.id,
          appointment as AccountAppointment
        );
      });
    });

    appointments = Array.from(uniqueAppointments.values()).sort((a, b) =>
      appointmentStamp(b).localeCompare(appointmentStamp(a))
    );
  } catch {
    loadError = true;
  }

  const upcoming = appointments.filter(isUpcoming).sort((a, b) =>
    appointmentStamp(a).localeCompare(appointmentStamp(b))
  );
  const past = appointments.filter((item) => !isUpcoming(item));

  return (
    <section className="section-pad">
      <div className="container-page">
        <div className="mx-auto max-w-4xl">
          <p className="eyebrow">Your Lash Lux account</p>
          <div className="mt-4 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-balance font-display text-4xl text-ink sm:text-5xl">
                Your appointments.
              </h1>
              <p className="mt-3 text-pretty text-muted-foreground">
                Track upcoming sessions and past eyelash fixing visits in one place.
              </p>
            </div>
            <Button asChild>
              <Link href="/book">Book fixing</Link>
            </Button>
          </div>

          <div className="frame-lux mt-10">
            <div className="frame-lux-inner p-5 sm:p-8">
              {loadError ? (
                <div className="py-10 text-center" role="alert">
                  <h2 className="font-display text-2xl text-ink">
                    We could not load your appointments.
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    Please refresh the page or contact the studio for help.
                  </p>
                  <Button asChild className="mt-6" variant="outline">
                    <a href={SITE.whatsapp} target="_blank" rel="noreferrer">
                      WhatsApp the studio
                    </a>
                  </Button>
                </div>
              ) : appointments.length ? (
                <div className="space-y-10">
                  <section aria-labelledby="upcoming-title">
                    <div className="flex items-end justify-between gap-3">
                      <h2
                        id="upcoming-title"
                        className="font-display text-2xl text-ink"
                      >
                        Upcoming
                      </h2>
                      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                        {upcoming.length}
                      </p>
                    </div>
                    {upcoming.length ? (
                      <ul className="mt-4 divide-y divide-border">
                        {upcoming.map((appointment) => (
                          <AppointmentRow
                            key={appointment.id}
                            appointment={appointment}
                          />
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-4 rounded-xl bg-secondary/70 p-5 text-sm text-muted-foreground">
                        No upcoming appointments.{" "}
                        <Link href="/book" className="font-medium text-rose-deep hover:underline">
                          Book your next set
                        </Link>
                        .
                      </p>
                    )}
                  </section>

                  <section aria-labelledby="past-title">
                    <div className="flex items-end justify-between gap-3">
                      <h2 id="past-title" className="font-display text-2xl text-ink">
                        Past
                      </h2>
                      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                        {past.length}
                      </p>
                    </div>
                    {past.length ? (
                      <ul className="mt-4 divide-y divide-border">
                        {past.map((appointment) => (
                          <AppointmentRow
                            key={appointment.id}
                            appointment={appointment}
                          />
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-4 text-sm text-muted-foreground">
                        Past visits will appear here after your first appointment.
                      </p>
                    )}
                  </section>
                </div>
              ) : (
                <div className="py-10 text-center">
                  <h2 className="font-display text-2xl text-ink">
                    No appointments yet.
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    Choose your next lash look and send a booking request.
                  </p>
                  <Button asChild className="mt-6">
                    <Link href="/book">Book fixing</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SignedOutAccount() {
  return (
    <section className="section-pad">
      <div className="container-page">
        <div className="frame-lux mx-auto max-w-xl">
          <div className="frame-lux-inner p-8 text-center sm:p-10">
            <p className="eyebrow">Book without signing in</p>
            <h1 className="mt-4 text-balance font-display text-4xl text-ink">
              Ready for eyelash fixing?
            </h1>
            <p className="mt-3 text-pretty text-muted-foreground">
              Guests can book online or WhatsApp us. Sign in is only needed if
              you already saved a profile.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link href="/book">Book fixing</Link>
              </Button>
              <Button asChild variant="outline">
                <a
                  href={whatsappHref(
                    "Hi Lash Lux! I'd like to book eyelash fixing."
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Already have a profile?{" "}
              <Link
                href="/auth/login?next=%2Faccount"
                className="font-medium text-rose-deep hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
