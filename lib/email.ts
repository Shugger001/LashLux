import { Resend } from "resend";

import { SITE } from "@/lib/constants";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/** Send booking confirmation to the client (and optional admin copy). */
export async function sendBookingConfirmation(input: {
  to: string;
  clientName: string;
  serviceName: string;
  date: string;
  time: string;
  notes?: string;
}) {
  const resend = getResend();
  if (!resend) {
    console.info("[email:skipped] booking confirmation", input.to);
    return { skipped: true as const };
  }

  const from = process.env.RESEND_FROM_EMAIL ?? `Lash Lux <bookings@${SITE.url.replace(/^https?:\/\//, "")}>`;
  const clientName = escapeHtml(input.clientName);
  const serviceName = escapeHtml(input.serviceName);
  const date = escapeHtml(input.date);
  const time = escapeHtml(input.time);
  const notes = input.notes ? escapeHtml(input.notes) : "";

  await resend.emails.send({
    from,
    to: input.to,
    subject: `Booking received, ${input.serviceName}`,
    html: `
      <div style="font-family:Georgia,serif;color:#4a3a35;line-height:1.6">
        <h1 style="color:#c17a6b;font-weight:400">You're almost set, ${clientName}</h1>
        <p>We received your request for <strong>${serviceName}</strong>.</p>
        <p><strong>Date:</strong> ${date}<br/>
        <strong>Time:</strong> ${time}</p>
        ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ""}
        <p>We'll confirm shortly. Reply to this email if you need to change anything.</p>
        <p style="color:#8a756c">- ${SITE.name}</p>
      </div>
    `,
  });

  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL ?? SITE.email;
  await resend.emails.send({
    from,
    to: adminEmail,
    subject: `New booking, ${input.serviceName}`,
    html: `<p>${clientName} booked ${serviceName} on ${date} at ${time}.</p>`,
  });

  return { skipped: false as const };
}

/** Contact form notification to the studio. */
export async function sendContactNotification(input: {
  name: string;
  email: string;
  message: string;
}) {
  const resend = getResend();
  if (!resend) {
    console.info("[email:skipped] contact", input.email);
    return { skipped: true as const };
  }

  const from = process.env.RESEND_FROM_EMAIL ?? `Lash Lux <hello@lashlux.com>`;
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL ?? SITE.email;
  const name = escapeHtml(input.name);
  const email = escapeHtml(input.email);
  const message = escapeHtml(input.message).replaceAll("\n", "<br/>");

  await resend.emails.send({
    from,
    to: adminEmail,
    replyTo: input.email,
    subject: `Contact form, ${input.name}`,
    html: `<p><strong>${name}</strong> (${email})</p><p>${message}</p>`,
  });

  return { skipped: false as const };
}

/** Promotional email helper for admin client outreach. */
export async function sendPromoEmail(input: {
  to: string;
  subject: string;
  body: string;
}) {
  const resend = getResend();
  if (!resend) {
    return { skipped: true as const };
  }

  const from = process.env.RESEND_FROM_EMAIL ?? `Lash Lux <hello@lashlux.com>`;
  const safeBody = escapeHtml(input.body).replaceAll("\n", "<br />");

  await resend.emails.send({
    from,
    to: input.to,
    subject: input.subject,
    html: `<div style="font-family:Georgia,serif;color:#4a3a35;line-height:1.6">${safeBody}</div>`,
  });

  return { skipped: false as const };
}
