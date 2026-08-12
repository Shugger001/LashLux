import { NextResponse } from "next/server";
import { z } from "zod";

import {
  createAdminClient,
  createClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

const createSchema = z.object({
  blockDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .nullable()
    .optional(),
  endTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .nullable()
    .optional(),
  reason: z.string().trim().max(200).optional().default(""),
  allDay: z.boolean().optional().default(false),
});

async function requireAdmin() {
  if (!isSupabaseConfigured()) return { demo: true as const };
  const session = createClient();
  const {
    data: { user },
  } = await session.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role !== "admin") {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { admin };
}

/** List upcoming blocked times. */
export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ blocks: [] });
  }
  const admin = createAdminClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await admin
    .from("blocked_times")
    .select("*")
    .gte("block_date", today)
    .order("block_date", { ascending: true })
    .limit(100);
  if (error) {
    return NextResponse.json({ error: "Could not load blocks" }, { status: 500 });
  }
  return NextResponse.json({ blocks: data ?? [] });
}

/** Create a blocked day or time range. */
export async function POST(request: Request) {
  const auth = await requireAdmin();
  if ("error" in auth && auth.error) return auth.error;
  if ("demo" in auth) {
    return NextResponse.json({ success: true, demo: true, id: `demo-${crypto.randomUUID()}` });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid block" }, { status: 400 });
  }

  const allDay = parsed.data.allDay || (!parsed.data.startTime && !parsed.data.endTime);
  if (!allDay && (!parsed.data.startTime || !parsed.data.endTime)) {
    return NextResponse.json(
      { error: "Provide start and end time, or mark all day." },
      { status: 400 }
    );
  }

  const { data, error } = await auth.admin
    .from("blocked_times")
    .insert({
      block_date: parsed.data.blockDate,
      start_time: allDay ? null : parsed.data.startTime,
      end_time: allDay ? null : parsed.data.endTime,
      reason: parsed.data.reason ?? "",
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: "Could not save block" }, { status: 500 });
  }

  return NextResponse.json({ success: true, block: data }, { status: 201 });
}

/** Delete a blocked time. */
export async function DELETE(request: Request) {
  const auth = await requireAdmin();
  if ("error" in auth && auth.error) return auth.error;
  if ("demo" in auth) {
    return NextResponse.json({ success: true, demo: true });
  }

  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const { error } = await auth.admin.from("blocked_times").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: "Could not delete block" }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
