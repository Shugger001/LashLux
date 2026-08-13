import { NextResponse } from "next/server";
import { z } from "zod";

import { getAdminContactMessages } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/require-admin";

const patchSchema = z.object({
  id: z.string().uuid(),
  isRead: z.boolean(),
});

/** List contact inbox messages. */
export async function GET() {
  const gate = await requireAdmin();
  if (gate.error) return gate.error;
  if (gate.demo) {
    return NextResponse.json({ messages: [] });
  }

  const messages = await getAdminContactMessages();
  return NextResponse.json({ messages });
}

/** Mark a contact message read/unread. */
export async function PATCH(request: Request) {
  const gate = await requireAdmin();
  if (gate.error) return gate.error;
  if (gate.demo) {
    return NextResponse.json({ success: true, demo: true });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid message update." }, { status: 400 });
  }

  const { error } = await gate.admin
    .from("contact_messages")
    .update({ is_read: parsed.data.isRead })
    .eq("id", parsed.data.id);

  if (error) {
    console.error("[admin:messages-patch]", { message: error.message });
    return NextResponse.json(
      { error: "Message could not be updated." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

/** Delete a contact message. */
export async function DELETE(request: Request) {
  const gate = await requireAdmin();
  if (gate.error) return gate.error;
  if (gate.demo) {
    return NextResponse.json({ success: true, demo: true });
  }

  const id = new URL(request.url).searchParams.get("id");
  if (!id || !z.string().uuid().safeParse(id).success) {
    return NextResponse.json({ error: "Message id required." }, { status: 400 });
  }

  const { error } = await gate.admin
    .from("contact_messages")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[admin:messages-delete]", { message: error.message });
    return NextResponse.json(
      { error: "Message could not be deleted." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
