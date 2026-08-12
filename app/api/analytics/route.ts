import { NextResponse } from "next/server";
import { z } from "zod";

import {
  createAdminClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

const schema = z.object({
  eventName: z
    .string()
    .min(1)
    .max(64)
    .regex(/^[a-z0-9_]+$/),
  path: z.string().max(200).optional(),
  props: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
});

const ALLOWED = new Set([
  "page_view",
  "cta_click",
  "book_start",
  "book_step",
  "book_submit",
  "book_success",
  "book_fail",
  "contact_submit",
  "contact_success",
  "contact_fail",
  "whatsapp_click",
  "pay_start",
  "pay_success",
  "pay_fail",
]);

/** Privacy-safe funnel event ingest. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success || !ALLOWED.has(parsed.data.eventName)) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ ok: true, demo: true });
  }

  try {
    const admin = createAdminClient();
    const props = parsed.data.props ?? {};
    const scrubbed: Record<string, string | number | boolean> = {};
    for (const [key, value] of Object.entries(props)) {
      if (/email|phone|name|message|notes/i.test(key)) continue;
      scrubbed[key] = value;
    }
    await admin.from("analytics_events").insert({
      event_name: parsed.data.eventName,
      path: parsed.data.path?.slice(0, 200) ?? null,
      props: scrubbed,
    });
  } catch (error) {
    console.error("[analytics:insert-failed]", {
      message: error instanceof Error ? error.message : "unknown",
    });
  }

  return NextResponse.json({ ok: true });
}
