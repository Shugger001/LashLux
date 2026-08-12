import "server-only";

import crypto from "crypto";

import { SITE } from "@/lib/constants";

export function isPaystackConfigured() {
  return Boolean(
    process.env.PAYSTACK_SECRET_KEY &&
      process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
  );
}

export function getDepositAmountGhs() {
  const raw = Number(process.env.DEPOSIT_AMOUNT_GHS ?? "50");
  if (!Number.isFinite(raw) || raw <= 0) return 50;
  return Math.round(raw);
}

export function isDepositRequired() {
  return (
    process.env.NEXT_PUBLIC_DEPOSIT_ENABLED === "true" && isPaystackConfigured()
  );
}

/** Initialize a Paystack transaction for an appointment deposit (pesewas). */
export async function initializePaystackDeposit(input: {
  email: string;
  amountGhs: number;
  reference: string;
  appointmentId: string;
  callbackUrl: string;
}) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) throw new Error("Paystack is not configured.");

  const response = await fetch(
    "https://api.paystack.co/transaction/initialize",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: input.email,
        amount: Math.round(input.amountGhs * 100),
        currency: "GHS",
        reference: input.reference,
        callback_url: input.callbackUrl,
        metadata: {
          appointment_id: input.appointmentId,
          studio: SITE.name,
          type: "booking_deposit",
        },
      }),
    }
  );

  const json = (await response.json()) as {
    status: boolean;
    message?: string;
    data?: { authorization_url: string; access_code: string; reference: string };
  };

  if (!response.ok || !json.status || !json.data) {
    throw new Error(json.message ?? "Could not start Paystack payment.");
  }

  return json.data;
}

/** Verify a Paystack transaction by reference. */
export async function verifyPaystackTransaction(reference: string) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) throw new Error("Paystack is not configured.");

  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: { Authorization: `Bearer ${secret}` },
      cache: "no-store",
    }
  );
  const json = (await response.json()) as {
    status: boolean;
    data?: {
      status: string;
      amount: number;
      currency: string;
      reference: string;
      metadata?: { appointment_id?: string };
    };
  };
  if (!response.ok || !json.status || !json.data) {
    return null;
  }
  return json.data;
}

/** Validate Paystack webhook signature. */
export function verifyPaystackSignature(rawBody: string, signature: string | null) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret || !signature) return false;
  const hash = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
  return hash === signature;
}
