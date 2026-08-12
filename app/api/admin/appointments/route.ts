import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/require-admin";

/** Delete an appointment by id. */
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
    return NextResponse.json(
      { error: "A valid appointment id is required." },
      { status: 400 }
    );
  }

  const { error } = await auth.admin.from("appointments").delete().eq("id", id);
  if (error) {
    console.error("[admin:appointments-delete]", { message: error.message });
    return NextResponse.json(
      { error: error.message ?? "Appointment could not be deleted." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
