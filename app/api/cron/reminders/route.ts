import { NextResponse } from "next/server";

import { sendBookingReminder } from "@/lib/email";
import {
  createAdminClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = request.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

/** Daily cron: email clients with appointments tomorrow. */
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, sent: 0, demo: true });
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const date = tomorrow.toISOString().slice(0, 10);

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("appointments")
    .select(
      "id, client_name, client_email, appointment_date, appointment_time, service:services(name)"
    )
    .eq("appointment_date", date)
    .in("status", ["pending", "confirmed"])
    .is("reminder_sent_at", null);

  if (error) {
    console.error("[cron:reminders-query]", { message: error.message });
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }

  let sent = 0;
  let skipped = 0;

  for (const appointment of data ?? []) {
    const email = appointment.client_email;
    if (!email) {
      skipped += 1;
      continue;
    }
    const serviceJoin = appointment.service as
      | { name: string }
      | { name: string }[]
      | null;
    const serviceName = Array.isArray(serviceJoin)
      ? serviceJoin[0]?.name ?? "Eyelash fixing"
      : serviceJoin?.name ?? "Eyelash fixing";

    try {
      const result = await sendBookingReminder({
        to: email,
        clientName: appointment.client_name ?? "there",
        serviceName,
        date: appointment.appointment_date,
        time: String(appointment.appointment_time).slice(0, 5),
      });
      if (!result.skipped) sent += 1;
      else skipped += 1;

      await admin
        .from("appointments")
        .update({ reminder_sent_at: new Date().toISOString() })
        .eq("id", appointment.id);
    } catch (err) {
      console.error("[cron:reminder-send]", {
        appointmentId: appointment.id,
        message: err instanceof Error ? err.message : "unknown",
      });
    }
  }

  return NextResponse.json({ ok: true, date, sent, skipped });
}
