import { NextResponse } from "next/server";

import { sendContactNotification } from "@/lib/email";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";
import {
  createClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { contactSchema } from "@/lib/validations";

/** Validate, store, and notify the studio about a contact request. */
export async function POST(request: Request) {
  const limit = checkRateLimit({
    key: `contact:${getRequestIp(request)}`,
    limit: 5,
    windowMs: 10 * 60 * 1000,
  });
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many messages. Please try again in a few minutes." },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSec) },
      }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Check your form details." },
      { status: 400 }
    );
  }

  const message = {
    name: parsed.data.name.trim(),
    email: parsed.data.email.trim().toLowerCase(),
    phone: parsed.data.phone.trim(),
    message: parsed.data.message.trim(),
  };

  if (isSupabaseConfigured()) {
    const { error } = await createClient()
      .from("contact_messages")
      .insert(message);
    if (error) {
      console.error("[contact:insert-failed]", { code: error.code });
      return NextResponse.json(
        { error: "Your message could not be sent. Please try again." },
        { status: 500 }
      );
    }
  }

  try {
    await sendContactNotification(message);
  } catch (error) {
    console.error("[contact:notification-failed]", {
      message: error instanceof Error ? error.message : "unknown",
    });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
