import { NextResponse } from "next/server";
import { z } from "zod";

import { sendPromoEmail } from "@/lib/email";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

const promoSchema = z
  .object({
    to: z.string().trim().email().max(254),
    subject: z.string().trim().min(3).max(120),
    body: z.string().trim().min(10).max(3000),
  })
  .strict();

async function isAdminRequest() {
  if (!isSupabaseConfigured()) return true;
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  return data?.role === "admin";
}

/** Send a validated promotional email from an authenticated admin session. */
export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const parsed = promoSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid email details" },
      { status: 400 }
    );
  }
  try {
    const result = await sendPromoEmail(parsed.data);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "The email provider could not send this message." },
      { status: 502 }
    );
  }
}
