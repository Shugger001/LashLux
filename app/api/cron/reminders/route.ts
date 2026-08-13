import { NextResponse } from "next/server";

import { sendBookingReminder } from "@/lib/email";
import {
  createAdminClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { formatTime } from "@/lib/utils";
import { whatsappHref } from "@/lib/whatsapp";

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

/** Accra/UTC calendar date for "tomorrow". */
function tomorrowDateKey(now = new Date()) {
  const next = new Date(now);
  next.setUTCDate(next.getUTCDate() + 1);
  return next.toISOString().slice(0, 10);
}

function formatAppointmentDate(dateKey: string) {
  return new Date(`${dateKey}T12:00:00Z`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Daily cron: email clients with confirmed appointments tomorrow. */
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, sent: 0, failed: 0, skipped: 0, demo: true });
  }

  const date = tomorrowDateKey();
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("appointments")
    .select(
      "id, client_name, client_email, appointment_date, appointment_time, service:services(name)"
    )
    .eq("appointment_date", date)
    .eq("status", "confirmed")
    .is("reminder_sent_at", null);

  if (error) {
    console.error("[cron:reminders-query]", { message: error.message, date });
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }

  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const appointment of data ?? []) {
    const email = appointment.client_email?.trim();
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

    const timeKey = String(appointment.appointment_time).slice(0, 5);
    const friendlyDate = formatAppointmentDate(appointment.appointment_date);
    const friendlyTime = formatTime(timeKey);
    const manageHref = whatsappHref(
      `Hi Lash Lux! I need to reschedule my ${serviceName} on ${friendlyDate} at ${friendlyTime} (ref ${appointment.id.slice(0, 8)}).`
    );

    try {
      const result = await sendBookingReminder({
        to: email,
        clientName: appointment.client_name ?? "there",
        serviceName,
        date: friendlyDate,
        time: friendlyTime,
        manageHref,
        reference: appointment.id.slice(0, 8),
      });

      if (result.skipped) {
        // Provider not configured — leave reminder_sent_at null so a later run can retry.
        skipped += 1;
        continue;
      }

      const { error: updateError } = await admin
        .from("appointments")
        .update({ reminder_sent_at: new Date().toISOString() })
        .eq("id", appointment.id)
        .is("reminder_sent_at", null);

      if (updateError) {
        failed += 1;
        console.error("[cron:reminder-mark]", {
          appointmentId: appointment.id,
          message: updateError.message,
        });
        continue;
      }

      sent += 1;
    } catch (err) {
      failed += 1;
      console.error("[cron:reminder-send]", {
        appointmentId: appointment.id,
        message: err instanceof Error ? err.message : "unknown",
      });
    }
  }

  console.info("[cron:reminders-complete]", { date, sent, skipped, failed });
  return NextResponse.json({ ok: true, date, sent, skipped, failed });
}
