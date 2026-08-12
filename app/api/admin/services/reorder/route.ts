import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/require-admin";

const reorderSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().uuid(),
        sort_order: z.coerce.number().int().min(1),
      })
    )
    .min(1),
});

/** Batch-update service sort order. */
export async function PUT(request: Request) {
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

  const parsed = reorderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid sort order payload." }, { status: 400 });
  }

  const results = await Promise.all(
    parsed.data.items.map((item) =>
      auth.admin
        .from("services")
        .update({ sort_order: item.sort_order })
        .eq("id", item.id)
    )
  );
  const failed = results.find((result) => result.error);
  if (failed?.error) {
    console.error("[admin:services-reorder]", { message: failed.error.message });
    return NextResponse.json(
      { error: "Service order could not be saved." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
