import { NextResponse } from "next/server";

import { sendDepositReceipt } from "@/lib/email";
import {
  verifyPaystackSignature,
  verifyPaystackTransaction,
} from "@/lib/paystack";
import {
  createAdminClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

/** Paystack webhook: mark deposit paid and confirm appointment. */
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!verifyPaystackSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, demo: true });
  }

  let event: {
    event?: string;
    data?: {
      reference?: string;
      status?: string;
      amount?: number;
      metadata?: { appointment_id?: string };
    };
  };

  try {
    event = JSON.parse(rawBody) as typeof event;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (event.event !== "charge.success" || !event.data?.reference) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const reference = event.data.reference;
  const verified = await verifyPaystackTransaction(reference);
  if (!verified || verified.status !== "success") {
    console.error("[paystack:webhook-verify-failed]", { reference });
    return NextResponse.json({ error: "Verify failed" }, { status: 400 });
  }

  const admin = createAdminClient();
  const appointmentId =
    verified.metadata?.appointment_id ?? event.data.metadata?.appointment_id;

  const { data: appointment, error } = await admin
    .from("appointments")
    .select(
      "id, client_name, client_email, appointment_date, appointment_time, deposit_amount, payment_status, service:services(name)"
    )
    .eq(appointmentId ? "id" : "payment_reference", appointmentId ?? reference)
    .maybeSingle();

  if (error || !appointment) {
    console.error("[paystack:webhook-missing-appointment]", {
      reference,
      appointmentId,
    });
    return NextResponse.json({ ok: true, missing: true });
  }

  if (appointment.payment_status === "paid") {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  const expectedPesewas = Math.round(Number(appointment.deposit_amount ?? 0) * 100);
  if (expectedPesewas > 0 && verified.amount !== expectedPesewas) {
    console.error("[paystack:amount-mismatch]", {
      reference,
      expectedPesewas,
      got: verified.amount,
      appointmentId: appointment.id,
    });
    return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
  }

  await admin
    .from("appointments")
    .update({
      payment_status: "paid",
      payment_reference: reference,
      status: "confirmed",
      updated_at: new Date().toISOString(),
    })
    .eq("id", appointment.id);

  const serviceJoin = appointment.service as
    | { name: string }
    | { name: string }[]
    | null;
  const serviceName = Array.isArray(serviceJoin)
    ? serviceJoin[0]?.name ?? "Eyelash fixing"
    : serviceJoin?.name ?? "Eyelash fixing";

  if (appointment.client_email) {
    try {
      await sendDepositReceipt({
        to: appointment.client_email,
        clientName: appointment.client_name ?? "there",
        serviceName,
        date: appointment.appointment_date,
        time: String(appointment.appointment_time).slice(0, 5),
        amountGhs: Number(appointment.deposit_amount ?? 0),
        reference,
      });
    } catch (err) {
      console.error("[paystack:receipt-failed]", {
        appointmentId: appointment.id,
        message: err instanceof Error ? err.message : "unknown",
      });
    }
  }

  console.info("[paystack:deposit-paid]", {
    appointmentId: appointment.id,
    reference,
  });

  return NextResponse.json({ ok: true });
}
