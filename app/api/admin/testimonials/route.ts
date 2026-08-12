import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/require-admin";

const SELECT =
  "id, client_name, client_image, content, rating, service_used, is_approved, created_at";

const upsertSchema = z.object({
  id: z.string().uuid().optional(),
  client_name: z.string().trim().min(2).max(80),
  content: z.string().trim().min(10).max(1000),
  rating: z.coerce.number().int().min(1).max(5),
  service_used: z.string().trim().max(100).optional().nullable(),
  client_image: z.string().trim().optional().nullable(),
  is_approved: z.boolean().optional(),
});

export async function POST(request: Request) {
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

  const parsed = upsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid testimonial." },
      { status: 400 }
    );
  }

  const { id, ...fields } = parsed.data;
  const query = id
    ? auth.admin.from("testimonials").update(fields).eq("id", id)
    : auth.admin.from("testimonials").insert({
        ...fields,
        is_approved: fields.is_approved ?? true,
      });

  const { data, error } = await query.select(SELECT).single();
  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "Testimonial could not be saved." },
      { status: 500 }
    );
  }
  return NextResponse.json({ testimonial: data }, { status: id ? 200 : 201 });
}

export async function PATCH(request: Request) {
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

  const parsed = z
    .object({
      id: z.string().uuid(),
      is_approved: z.boolean().optional(),
    })
    .safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid testimonial update." }, { status: 400 });
  }

  const { id, ...fields } = parsed.data;
  const { data, error } = await auth.admin
    .from("testimonials")
    .update(fields)
    .eq("id", id)
    .select(SELECT)
    .single();
  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "Testimonial could not be updated." },
      { status: 500 }
    );
  }
  return NextResponse.json({ testimonial: data });
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  if (auth.demo) {
    return NextResponse.json({ error: "Database not connected." }, { status: 503 });
  }

  const id = new URL(request.url).searchParams.get("id");
  if (!id || !z.string().uuid().safeParse(id).success) {
    return NextResponse.json({ error: "A valid testimonial id is required." }, { status: 400 });
  }

  const { error } = await auth.admin.from("testimonials").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
