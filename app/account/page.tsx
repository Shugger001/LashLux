import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  createAdminClient,
  createClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { cn, formatTime } from "@/lib/utils";
import type { AppointmentStatus } from "@/types";

export const metadata: Metadata = {
  title: "Your Account",
  description: "View your Lash Lux appointment requests and confirmed sessions.",
};

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
};

function getServiceName(service: AccountAppointment["service"]) {
  if (Array.isArray(service)) return service[0]?.name ?? "Lash service";
  return service?.name ?? "Lash service";
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
      `${b.appointment_date}T${b.appointment_time}`.localeCompare(
        `${a.appointment_date}T${a.appointment_time}`
      )
    );
  } catch {
    loadError = true;
  }

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
                Track pending requests and confirmed lash sessions in one place.
              </p>
            </div>
            <Button asChild>
              <Link href="/book">Book a session</Link>
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
                </div>
              ) : appointments.length ? (
                <ul className="divide-y divide-border">
                  {appointments.map((appointment) => (
                    <li
                      key={appointment.id}
                      className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <h2 className="font-display text-xl text-ink">
                          {getServiceName(appointment.service)}
                        </h2>
                        <p className="mt-1 tabular-nums text-sm text-muted-foreground">
                          {new Date(
                            `${appointment.appointment_date}T12:00:00`
                          ).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          at {formatTime(appointment.appointment_time)}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize",
                          statusStyles[appointment.status]
                        )}
                      >
                        {appointment.status}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-10 text-center">
                  <h2 className="font-display text-2xl text-ink">
                    No appointments yet.
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    Choose your next lash look and send a booking request.
                  </p>
                  <Button asChild className="mt-6">
                    <Link href="/book">Book a session</Link>
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
            <p className="eyebrow">Your Lash Lux account</p>
            <h1 className="mt-4 text-balance font-display text-4xl text-ink">
              Sign in to view your appointments.
            </h1>
            <p className="mt-3 text-pretty text-muted-foreground">
              Your requests and confirmed sessions will appear here.
            </p>
            <Button asChild className="mt-7">
              <Link href="/auth/login?next=%2Faccount">Sign in to your account</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
