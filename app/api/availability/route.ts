import { NextResponse } from "next/server";
import { z } from "zod";

import {
  BUFFER_MINUTES,
  generateBookableSlots,
  isBookableDate,
  rangesOverlap,
  timeToMinutes,
} from "@/lib/schedule";
import {
  createAdminClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

const querySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  serviceId: z.string().min(1).max(100),
});

/** Return available start times for a service and date (duration + buffer aware). */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = querySchema.safeParse({
    date: url.searchParams.get("date"),
    serviceId: url.searchParams.get("serviceId"),
  });
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Choose a valid date and service." },
      { status: 400 }
    );
  }

  const requestedDate = new Date(`${parsed.data.date}T12:00:00`);
  if (Number.isNaN(requestedDate.getTime()) || !isBookableDate(requestedDate)) {
    return NextResponse.json({ slots: [] });
  }

  if (!isSupabaseConfigured()) {
    if (process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production") {
      console.error("[availability:supabase-not-configured]");
      return NextResponse.json(
        { error: "Availability is temporarily unavailable." },
        { status: 503 }
      );
    }
    const demoDuration = 120;
    const allSlots = generateBookableSlots({
      date: requestedDate,
      durationMinutes: demoDuration,
    });
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
    .select("id, duration")
    .eq("id", parsed.data.serviceId)
    .eq("is_active", true)
    .maybeSingle();
  if (serviceError || !service) {
    return NextResponse.json(
      { error: "That service is not available." },
      { status: 404 }
    );
  }

  const allSlots = generateBookableSlots({
    date: requestedDate,
    durationMinutes: service.duration,
  });

  const { data, error } = await supabase
    .from("appointments")
    .select("appointment_time, service:services(duration)")
    .eq("appointment_date", parsed.data.date)
    .not("status", "in", "(cancelled,no_show)");
  if (error) {
    console.error("[availability:query-failed]", { code: error.code });
    return NextResponse.json(
      { error: "Available times could not be loaded." },
      { status: 500 }
    );
  }

  const { data: blocks } = await supabase
    .from("blocked_times")
    .select("start_time, end_time")
    .eq("block_date", parsed.data.date);

  if ((blocks ?? []).some((block) => !block.start_time && !block.end_time)) {
    return NextResponse.json({ slots: [], closed: true });
  }

  const bookedRanges = (data ?? []).map((appointment) => {
    const start = timeToMinutes(String(appointment.appointment_time));
    const serviceJoin = appointment.service as
      | { duration: number }
      | { duration: number }[]
      | null;
    const duration = Array.isArray(serviceJoin)
      ? serviceJoin[0]?.duration ?? 60
      : serviceJoin?.duration ?? 60;
    return { start, end: start + duration };
  });

  const blockedRanges = (blocks ?? [])
    .filter((block) => block.start_time && block.end_time)
    .map((block) => ({
      start: timeToMinutes(String(block.start_time)),
      end: timeToMinutes(String(block.end_time)),
    }));

  const slots = allSlots.filter((slot) => {
    const start = timeToMinutes(slot);
    const end = start + service.duration;
    const hitsBooking = bookedRanges.some((range) =>
      rangesOverlap(start, end, range.start, range.end, BUFFER_MINUTES)
    );
    const hitsBlock = blockedRanges.some((range) =>
      rangesOverlap(start, end, range.start, range.end, 0)
    );
    return !hitsBooking && !hitsBlock;
  });

  return NextResponse.json({ slots });
}
