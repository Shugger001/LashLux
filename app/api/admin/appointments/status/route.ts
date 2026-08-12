import { NextResponse } from "next/server";
import { z } from "zod";

import { sendStatusUpdateEmail } from "@/lib/email";
import { APPOINTMENT_STATUSES } from "@/lib/constants";
import {
  createAdminClient,
  createClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

const schema = z.object({
  id: z.string().uuid(),
  status: z.enum(APPOINTMENT_STATUSES),
  notify: z.boolean().optional().default(true),
});

/** Admin status update with optional client email. */
export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: true, demo: true });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status update" }, { status: 400 });
  }

  const session = createClient();
  const {
    data: { user },
  } = await session.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: appointment, error } = await admin
    .from("appointments")
    .update({
      status: parsed.data.status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.id)
    .select(
      "id, client_name, client_email, appointment_date, appointment_time, status, service:services(name)"
    )
    .single();

  if (error || !appointment) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  let emailSent = false;
  if (parsed.data.notify && appointment.client_email) {
    const serviceJoin = appointment.service as
      | { name: string }
      | { name: string }[]
      | null;
    const serviceName = Array.isArray(serviceJoin)
      ? serviceJoin[0]?.name ?? "Eyelash fixing"
      : serviceJoin?.name ?? "Eyelash fixing";
    try {
      const result = await sendStatusUpdateEmail({
        to: appointment.client_email,
        clientName: appointment.client_name ?? "there",
        serviceName,
        date: appointment.appointment_date,
        time: String(appointment.appointment_time).slice(0, 5),
        status: parsed.data.status,
      });
      emailSent = !result.skipped;
    } catch (err) {
      console.error("[admin:status-email]", {
        appointmentId: appointment.id,
        message: err instanceof Error ? err.message : "unknown",
      });
    }
  }

  return NextResponse.json({ success: true, emailSent, appointment });
}
