import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/require-admin";

const settingsSchema = z.object({
  businessName: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().min(7),
  address: z.string().trim().min(5),
  instagram: z.string().trim().optional().default(""),
  facebook: z.string().trim().optional().default(""),
  tiktok: z.string().trim().optional().default(""),
  bookingBuffer: z.coerce.number().int().min(0),
  maxBookingDays: z.coerce.number().int().min(1),
  seoTitle: z.string().trim().min(10),
  seoDescription: z.string().trim().min(40),
});

const SETTING_KEYS = {
  businessName: "business_name",
  email: "business_email",
  phone: "business_phone",
  address: "business_address",
  instagram: "instagram",
  facebook: "facebook",
  tiktok: "tiktok",
  bookingBuffer: "booking_buffer",
  maxBookingDays: "max_booking_days",
  seoTitle: "seo_title",
  seoDescription: "seo_description",
} as const;

export async function PUT(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  if (auth.demo) {
    return NextResponse.json({ error: "Database not connected." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid settings." },
      { status: 400 }
    );
  }

  const rows = Object.entries(parsed.data).map(([field, value]) => ({
    key: SETTING_KEYS[field as keyof typeof SETTING_KEYS],
    value: String(value),
    type: "text" as const,
  }));

  const { error } = await auth.admin
    .from("site_settings")
    .upsert(rows, { onConflict: "key" });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, settings: parsed.data });
}
