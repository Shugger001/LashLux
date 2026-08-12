import { NextResponse } from "next/server";
import { z } from "zod";

import {
  createAdminClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { generateTimeSlots } from "@/lib/utils";

const querySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  serviceId: z.string().min(1).max(100),
});

/** Return available 30-minute start times for a service and date. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = querySchema.safeParse({
    date: url.searchParams.get("date"),
    serviceId: url.searchParams.get("serviceId"),
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "Choose a valid date and service." }, { status: 400 });
  }

  const requestedDate = new Date(`${parsed.data.date}T12:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (
    Number.isNaN(requestedDate.getTime()) ||
    requestedDate < today ||
    requestedDate.getDay() === 0 ||
    requestedDate.getDay() === 1
  ) {
    return NextResponse.json({ slots: [] });
  }

  const allSlots = generateTimeSlots(
    requestedDate.getDay() === 6 ? "09:00" : "10:00",
    requestedDate.getDay() === 6 ? "16:00" : "18:00"
  );

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      slots: allSlots.filter((_, index) => index % 5 !== 3),
      demo: true,
    });
  }

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return NextResponse.json(
      { error: "Booking availability is not configured." },
      { status: 503 }
    );
  }
  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("id")
    .eq("id", parsed.data.serviceId)
    .eq("is_active", true)
    .maybeSingle();
  if (serviceError || !service) {
    return NextResponse.json({ error: "That service is not available." }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("appointments")
    .select("appointment_time")
    .eq("appointment_date", parsed.data.date)
    .neq("status", "cancelled");
  if (error) {
    console.error("[availability:query-failed]", { code: error.code });
    return NextResponse.json({ error: "Available times could not be loaded." }, { status: 500 });
  }

  const booked = new Set(
    (data ?? []).map((appointment) =>
      String(appointment.appointment_time).slice(0, 5)
    )
  );
  return NextResponse.json({ slots: allSlots.filter((slot) => !booked.has(slot)) });
}
