import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/require-admin";

const itemSchema = z.object({
  image_url: z.string().trim().min(1),
  poster_url: z.string().trim().nullable().optional(),
  title: z.string().trim().min(1).max(100),
  description: z.string().trim().max(500).nullable().optional(),
  category: z.string().trim().min(1).max(40),
  is_featured: z.boolean().optional().default(false),
  media_type: z.enum(["image", "video"]).default("image"),
});

const SELECT =
  "id, image_url, title, description, category, is_featured, media_type, poster_url, created_at";

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

  const parsed = z.array(itemSchema).min(1).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid gallery items." },
      { status: 400 }
    );
  }

  const { data, error } = await auth.admin
    .from("gallery")
    .insert(parsed.data)
    .select(SELECT);
  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "Gallery items could not be added." },
      { status: 500 }
    );
  }
  return NextResponse.json({ items: data }, { status: 201 });
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
      is_featured: z.boolean().optional(),
      title: z.string().trim().min(1).max(100).optional(),
      category: z.string().trim().min(1).max(40).optional(),
    })
    .safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid gallery update." }, { status: 400 });
  }

  const { id, ...fields } = parsed.data;
  const { data, error } = await auth.admin
    .from("gallery")
    .update(fields)
    .eq("id", id)
    .select(SELECT)
    .single();
  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "Gallery item could not be updated." },
      { status: 500 }
    );
  }
  return NextResponse.json({ item: data });
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  if (auth.demo) {
    return NextResponse.json({ error: "Database not connected." }, { status: 503 });
  }

  const id = new URL(request.url).searchParams.get("id");
  if (!id || !z.string().uuid().safeParse(id).success) {
    return NextResponse.json({ error: "A valid item id is required." }, { status: 400 });
  }

  const { error } = await auth.admin.from("gallery").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
