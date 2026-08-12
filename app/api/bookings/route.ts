import { NextResponse } from "next/server";

import { sendBookingConfirmation } from "@/lib/email";
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
  const key = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const current = requests.get(key);
  if (!current || current.resetAt <= now) {
    requests.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > RATE_LIMIT;
}

/** Validate and create a pending appointment request. */
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
      { error: parsed.error.issues[0]?.message ?? "Check your booking details." },
      { status: 400 }
    );
  }

  const input = {
    ...parsed.data,
    fullName: parsed.data.fullName.trim(),
    email: parsed.data.email.trim().toLowerCase(),
    phone: parsed.data.phone.trim(),
    notes: parsed.data.notes?.trim() || undefined,
  };
  const appointmentDate = new Date(`${input.date}T12:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (
    Number.isNaN(appointmentDate.getTime()) ||
    appointmentDate < today ||
    appointmentDate.getDay() === 0 ||
    appointmentDate.getDay() === 1
  ) {
    return NextResponse.json({ error: "Choose an available studio date." }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { success: true, id: `demo-${crypto.randomUUID()}`, demo: true },
      { status: 201 }
    );
  }

  try {
    const sessionClient = createClient();
    const admin = createAdminClient();
    const { data: service, error: serviceError } = await admin
      .from("services")
      .select("id, name, duration")
      .eq("id", input.serviceId)
      .eq("is_active", true)
      .maybeSingle();
    if (serviceError || !service) {
      return NextResponse.json({ error: "That service is not available." }, { status: 404 });
    }

    const { data: existingSlot } = await admin
      .from("appointments")
      .select("id")
      .eq("appointment_date", input.date)
      .eq("appointment_time", input.time)
      .neq("status", "cancelled")
      .limit(1)
      .maybeSingle();
    if (existingSlot) {
      return NextResponse.json(
        { error: "That time was just booked. Please choose another." },
        { status: 409 }
      );
    }

    const {
      data: { user: signedInUser },
    } = await sessionClient.auth.getUser();
    let userId = signedInUser?.id;

    if (!userId) {
      const { data: usersData, error: usersError } =
        await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
      if (usersError) throw usersError;
      userId = usersData.users.find(
        (user) => user.email?.toLowerCase() === input.email
      )?.id;
    }

    if (!userId) {
      const temporaryPassword = `${crypto.randomUUID()}Aa1!`;
      const { data: created, error: createError } =
        await admin.auth.admin.createUser({
          email: input.email,
          password: temporaryPassword,
          email_confirm: true,
          user_metadata: { full_name: input.fullName, phone: input.phone },
        });
      if (createError || !created.user) throw createError ?? new Error("User creation failed");
      userId = created.user.id;
    }

    const { data: appointment, error: insertError } = await admin
      .from("appointments")
      .insert({
        user_id: userId,
        service_id: service.id,
        appointment_date: input.date,
        appointment_time: input.time,
        status: "pending",
        notes: input.notes ?? null,
        client_name: input.fullName,
        client_email: input.email,
        client_phone: input.phone,
      })
      .select("id")
      .single();
    if (insertError) throw insertError;

    try {
      await sendBookingConfirmation({
        to: input.email,
        clientName: input.fullName,
        serviceName: service.name,
        date: input.date,
        time: input.time,
        notes: input.notes,
      });
    } catch (error) {
      console.error("[booking:notification-failed]", {
        appointmentId: appointment.id,
        message: error instanceof Error ? error.message : "unknown",
      });
    }

    return NextResponse.json(
      { success: true, id: appointment.id },
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
