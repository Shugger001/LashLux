import { NextResponse } from "next/server";

import { sendDepositReceipt } from "@/lib/email";
import { SITE } from "@/lib/constants";
import { verifyPaystackTransaction } from "@/lib/paystack";
import {
  createAdminClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

/** Browser return URL after Paystack checkout. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const reference = url.searchParams.get("reference") ?? url.searchParams.get("trxref");

  if (!reference) {
    return NextResponse.redirect(`${SITE.url}/book?pay=missing`);
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(`${SITE.url}/book?pay=demo&ref=${reference}`);
  }

  const verified = await verifyPaystackTransaction(reference);
  if (!verified || verified.status !== "success") {
    return NextResponse.redirect(`${SITE.url}/book?pay=failed&ref=${reference}`);
  }

  const admin = createAdminClient();
  const appointmentId = verified.metadata?.appointment_id;

  const { data: appointment } = await admin
    .from("appointments")
    .select(
      "id, client_name, client_email, appointment_date, appointment_time, deposit_amount, payment_status, service:services(name)"
    )
    .eq(appointmentId ? "id" : "payment_reference", appointmentId ?? reference)
    .maybeSingle();

  if (!appointment) {
    return NextResponse.redirect(`${SITE.url}/book?pay=missing&ref=${reference}`);
  }

  if (appointment.payment_status !== "paid") {
    const expectedPesewas = Math.round(Number(appointment.deposit_amount ?? 0) * 100);
    if (expectedPesewas > 0 && verified.amount !== expectedPesewas) {
      return NextResponse.redirect(`${SITE.url}/book?pay=failed&ref=${reference}`);
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
      } catch {
        // webhook may also send; ignore duplicate failures
      }
    }
  }

  return NextResponse.redirect(
    `${SITE.url}/book?pay=success&id=${appointment.id}&ref=${reference}`
  );
}
