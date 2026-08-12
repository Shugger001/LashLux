import { NextResponse } from "next/server";

import {
  createClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { testimonialSchema } from "@/lib/validations";

/** Accept a public testimonial for moderation before publication. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const parsed = testimonialSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Check your testimonial." },
      { status: 400 }
    );
  }

  const testimonial = {
    client_name: parsed.data.client_name.trim(),
    content: parsed.data.content.trim(),
    rating: parsed.data.rating,
    service_used: parsed.data.service_used?.trim() || null,
    is_approved: false,
  };

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: true, demo: true }, { status: 201 });
  }

  const { error } = await createClient().from("testimonials").insert(testimonial);
  if (error) {
    console.error("[testimonial:insert-failed]", { code: error.code });
    return NextResponse.json(
      { error: "Your testimonial could not be submitted." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
