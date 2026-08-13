import { NextResponse } from "next/server";

import { SITE } from "@/lib/constants";
import { sendBookingConfirmation } from "@/lib/email";
import {
  getDepositAmountGhs,
  initializePaystackDeposit,
  isDepositRequired,
} from "@/lib/paystack";
import {
  BUFFER_MINUTES,
  generateBookableSlots,
  isBookableDate,
  MAX_APPOINTMENTS_PER_DAY,
  rangesOverlap,
  timeToMinutes,
} from "@/lib/schedule";
import {
  createAdminClient,
  createClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { bookingApiSchema } from "@/lib/validations";

const requests = new Map<string, { count: number; resetAt: number }>();
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 8;

function isRateLimited(request: Request) {
  const key =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const current = requests.get(key);
  if (!current || current.resetAt <= now) {
    requests.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > RATE_LIMIT;
}

/** Validate and create a pending appointment request (optional Paystack deposit). */
export async function POST(request: Request) {
  if (isRateLimited(request)) {
    return NextResponse.json(
      { error: "Too many booking attempts. Please wait a few minutes." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = bookingApiSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          parsed.error.issues[0]?.message ?? "Check your booking details.",
      },
      { status: 400 }
    );
  }

  const input = {
    ...parsed.data,
    fullName: parsed.data.fullName.trim(),
    phone: parsed.data.phone.trim(),
    notes: parsed.data.notes?.trim() || undefined,
  };

  const appointmentDate = new Date(`${input.date}T12:00:00`);
  if (
    Number.isNaN(appointmentDate.getTime()) ||
    !isBookableDate(appointmentDate)
  ) {
    return NextResponse.json(
      { error: "Choose an available studio date." },
      { status: 400 }
    );
  }

  if (!isSupabaseConfigured()) {
    if (process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production") {
      console.error("[booking:supabase-not-configured]");
      return NextResponse.json(
        {
          error:
            "Booking is temporarily unavailable. The studio database is not connected.",
        },
        { status: 503 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        id: `demo-${crypto.randomUUID()}`,
        demo: true,
        emailSent: false,
        depositRequired: false,
      },
      { status: 201 }
    );
  }

  try {
    const sessionClient = createClient();
    const admin = createAdminClient();
    const { data: service, error: serviceError } = await admin
      .from("services")
      .select("id, name, duration, price")
      .eq("id", input.serviceId)
      .eq("is_active", true)
      .maybeSingle();
    if (serviceError || !service) {
      return NextResponse.json(
        { error: "That service is not available." },
        { status: 404 }
      );
    }

    const { data: dayBlocks } = await admin
      .from("blocked_times")
      .select("start_time, end_time")
      .eq("block_date", input.date);

    if ((dayBlocks ?? []).some((block) => !block.start_time && !block.end_time)) {
      return NextResponse.json(
        { error: "The studio is closed on that date." },
        { status: 400 }
      );
    }

    const normalizedTime = input.time.slice(0, 5);
    const validSlots = generateBookableSlots({
      date: appointmentDate,
      durationMinutes: service.duration,
    });
    if (!validSlots.includes(normalizedTime)) {
      return NextResponse.json(
        { error: "That time is outside studio hours for this service." },
        { status: 400 }
      );
    }

    const proposedStart = timeToMinutes(normalizedTime);
    const proposedEnd = proposedStart + service.duration;

    const blocked = (dayBlocks ?? []).some((block) => {
      if (!block.start_time || !block.end_time) return false;
      return rangesOverlap(
        proposedStart,
        proposedEnd,
        timeToMinutes(String(block.start_time)),
        timeToMinutes(String(block.end_time)),
        0
      );
    });
    if (blocked) {
      return NextResponse.json(
        { error: "That time is blocked. Please choose another." },
        { status: 409 }
      );
    }

    const { data: dayAppointments, error: dayError } = await admin
      .from("appointments")
      .select("id, appointment_time, service:services(duration)")
      .eq("appointment_date", input.date)
      .not("status", "in", "(cancelled,no_show)");
    if (dayError) throw dayError;

    if ((dayAppointments ?? []).length >= MAX_APPOINTMENTS_PER_DAY) {
      return NextResponse.json(
        {
          error: `This day is fully booked (${MAX_APPOINTMENTS_PER_DAY} appointments). Please choose another date.`,
        },
        { status: 409 }
      );
    }

    const hasOverlap = (dayAppointments ?? []).some((appointment) => {
      const start = timeToMinutes(String(appointment.appointment_time));
      const serviceJoin = appointment.service as
        | { duration: number }
        | { duration: number }[]
        | null;
      const duration = Array.isArray(serviceJoin)
        ? serviceJoin[0]?.duration ?? 60
        : serviceJoin?.duration ?? 60;
      return rangesOverlap(
        proposedStart,
        proposedEnd,
        start,
        start + duration,
        BUFFER_MINUTES
      );
    });
    if (hasOverlap) {
      return NextResponse.json(
        { error: "That time was just booked. Please choose another." },
        { status: 409 }
      );
    }

    const {
      data: { user: signedInUser },
    } = await sessionClient.auth.getUser();

    const userId: string | null = signedInUser?.id ?? null;
    // Paystack requires an email; use a phone-derived placeholder when deposits are on.
    const paystackEmail = `${input.phone.replace(/\D/g, "") || "guest"}@bookings.lashlux.app`;

    const depositRequired = isDepositRequired();
    const depositAmount = depositRequired ? getDepositAmountGhs() : 0;
    const paymentReference = depositRequired
      ? `ll_${crypto.randomUUID().replaceAll("-", "").slice(0, 24)}`
      : null;

    const { data: appointment, error: insertError } = await admin
      .from("appointments")
      .insert({
        user_id: userId,
        service_id: service.id,
        appointment_date: input.date,
        appointment_time: normalizedTime,
        status: "pending",
        notes: input.notes ?? null,
        client_name: input.fullName,
        client_email: signedInUser?.email?.toLowerCase() ?? null,
        client_phone: input.phone,
        payment_status: depositRequired ? "pending" : "none",
        payment_reference: paymentReference,
        deposit_amount: depositAmount,
      })
      .select("id")
      .single();
    if (insertError) throw insertError;

    if (depositRequired && paymentReference) {
      try {
        const pay = await initializePaystackDeposit({
          email: paystackEmail,
          amountGhs: depositAmount,
          reference: paymentReference,
          appointmentId: appointment.id,
          callbackUrl: `${SITE.url}/api/paystack/callback`,
        });
        return NextResponse.json(
          {
            success: true,
            id: appointment.id,
            emailSent: false,
            depositRequired: true,
            depositAmount,
            authorizationUrl: pay.authorization_url,
            paymentReference: pay.reference,
          },
          { status: 201 }
        );
      } catch (error) {
        await admin.from("appointments").delete().eq("id", appointment.id);
        console.error("[booking:paystack-init-failed]", {
          message: error instanceof Error ? error.message : "unknown",
        });
        return NextResponse.json(
          { error: "Payment could not be started. Please try again." },
          { status: 502 }
        );
      }
    }

    let emailSent = false;
    try {
      const result = await sendBookingConfirmation({
        clientName: input.fullName,
        clientPhone: input.phone,
        serviceName: service.name,
        date: input.date,
        time: normalizedTime,
        notes: input.notes,
      });
      emailSent = !result.skipped;
    } catch (error) {
      console.error("[booking:notification-failed]", {
        appointmentId: appointment.id,
        message: error instanceof Error ? error.message : "unknown",
      });
    }

    return NextResponse.json(
      {
        success: true,
        id: appointment.id,
        emailSent,
        depositRequired: false,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[booking:create-failed]", {
      message: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json(
      { error: "Your booking could not be saved. Please try again." },
      { status: 500 }
    );
  }
}
