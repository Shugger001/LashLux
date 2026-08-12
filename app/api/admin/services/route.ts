import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/require-admin";

const serviceSchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().min(10).max(1000),
  price: z.coerce.number().min(0),
  duration: z.coerce.number().int().min(15).max(360),
  category: z.string().trim().min(2).max(40),
  image_url: z
    .union([
      z.literal(""),
      z.null(),
      z.string().url(),
      z.string().regex(/^\//, "Use a full URL or a site path like /gallery/look-01.png"),
    ])
    .optional()
    .transform((value) => (value ? value : null)),
  is_active: z.boolean().optional(),
  sort_order: z.coerce.number().int().min(1).optional(),
});

const updateSchema = serviceSchema.partial().extend({
  id: z.string().uuid(),
});

const SERVICE_SELECT =
  "id, name, description, price, duration, category, image_url, is_active, sort_order, created_at";

/** Create a service. */
export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  if (auth.demo) {
    return NextResponse.json(
      { error: "Admin writes require a connected database." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = serviceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Check the service details." },
      { status: 400 }
    );
  }

  const { data: maxSort } = await auth.admin
    .from("services")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data, error } = await auth.admin
    .from("services")
    .insert({
      ...parsed.data,
      is_active: parsed.data.is_active ?? true,
      sort_order: parsed.data.sort_order ?? (maxSort?.sort_order ?? 0) + 1,
    })
    .select(SERVICE_SELECT)
    .single();

  if (error || !data) {
    console.error("[admin:services-create]", { message: error?.message });
    return NextResponse.json(
      { error: error?.message ?? "Service could not be created." },
      { status: 500 }
    );
  }

  return NextResponse.json({ service: data }, { status: 201 });
}

/** Update one service (fields and/or active/sort). */
export async function PATCH(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  if (auth.demo) {
    return NextResponse.json(
      { error: "Admin writes require a connected database." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Check the service details." },
      { status: 400 }
    );
  }

  const { id, ...fields } = parsed.data;
  if (Object.keys(fields).length === 0) {
    return NextResponse.json({ error: "No changes provided." }, { status: 400 });
  }

  const { data, error } = await auth.admin
    .from("services")
    .update(fields)
    .eq("id", id)
    .select(SERVICE_SELECT)
    .single();

  if (error || !data) {
    console.error("[admin:services-update]", { message: error?.message });
    return NextResponse.json(
      { error: error?.message ?? "Service could not be updated." },
      { status: 500 }
    );
  }

  return NextResponse.json({ service: data });
}

/** Delete a service by id. */
export async function DELETE(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  if (auth.demo) {
    return NextResponse.json(
      { error: "Admin writes require a connected database." },
      { status: 503 }
    );
  }

  const id = new URL(request.url).searchParams.get("id");
  if (!id || !z.string().uuid().safeParse(id).success) {
    return NextResponse.json({ error: "A valid service id is required." }, { status: 400 });
  }

  const { error } = await auth.admin.from("services").delete().eq("id", id);
  if (error) {
    console.error("[admin:services-delete]", { message: error.message });
    return NextResponse.json(
      {
        error:
          error.message.includes("foreign key")
            ? "This service has bookings and cannot be deleted. Hide it instead."
            : error.message,
      },
      { status: 409 }
    );
  }

  return NextResponse.json({ success: true });
}
