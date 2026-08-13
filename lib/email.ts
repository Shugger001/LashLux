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

/** Notify the studio about a new booking request (client email no longer collected). */
export async function sendBookingConfirmation(input: {
  clientName: string;
  clientPhone: string;
  serviceName: string;
  date: string;
  time: string;
  notes?: string;
  to?: string;
}) {
  const resend = getResend();
  if (!resend) {
    console.info("[email:skipped] booking confirmation", input.clientPhone);
    return { skipped: true as const };
  }

  const from = process.env.RESEND_FROM_EMAIL ?? `Lash Lux <bookings@${SITE.url.replace(/^https?:\/\//, "")}>`;
  const clientName = escapeHtml(input.clientName);
  const clientPhone = escapeHtml(input.clientPhone);
  const serviceName = escapeHtml(input.serviceName);
  const date = escapeHtml(input.date);
  const time = escapeHtml(input.time);
  const notes = input.notes ? escapeHtml(input.notes) : "";

  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL ?? SITE.email;
  await resend.emails.send({
    from,
    to: adminEmail,
    subject: `New booking, ${input.serviceName}`,
    html: `
      <div style="font-family:Georgia,serif;color:#4a3a35;line-height:1.6">
        <p><strong>${clientName}</strong> booked <strong>${serviceName}</strong>.</p>
        <p><strong>Date:</strong> ${date}<br/>
        <strong>Time:</strong> ${time}<br/>
        <strong>Phone / WhatsApp:</strong> ${clientPhone}</p>
        ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ""}
      </div>
    `,
  });

  if (input.to) {
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
          <p>We'll confirm shortly by WhatsApp or phone.</p>
          <p style="color:#8a756c">- ${SITE.name}</p>
        </div>
      `,
    });
  }

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

/** Notify client when an appointment status changes. */
export async function sendStatusUpdateEmail(input: {
  to: string;
  clientName: string;
  serviceName: string;
  date: string;
  time: string;
  status: string;
}) {
  const resend = getResend();
  if (!resend) {
    console.info("[email:skipped] status update", input.to, input.status);
    return { skipped: true as const };
  }

  const from =
    process.env.RESEND_FROM_EMAIL ?? `Lash Lux <bookings@${SITE.url.replace(/^https?:\/\//, "")}>`;
  const clientName = escapeHtml(input.clientName);
  const serviceName = escapeHtml(input.serviceName);
  const date = escapeHtml(input.date);
  const time = escapeHtml(input.time);
  const status = escapeHtml(input.status);

  const headlines: Record<string, string> = {
    confirmed: "Your appointment is confirmed",
    completed: "Thanks for visiting Lash Lux",
    cancelled: "Your appointment was cancelled",
    no_show: "We missed you today",
    pending: "Your appointment is pending",
  };

  const bodies: Record<string, string> = {
    confirmed: "We look forward to your eyelash fixing session. Reply if you need to reschedule.",
    completed: "We hope you love your set. Book a fill in 2-3 weeks to keep them full.",
    cancelled: "This booking is cancelled. Message us on WhatsApp anytime to rebook.",
    no_show: "Your slot passed without a visit. Reply to rebook when you're ready.",
    pending: "We received your request and will confirm shortly.",
  };

  await resend.emails.send({
    from,
    to: input.to,
    subject: `${headlines[input.status] ?? "Appointment update"}, ${input.serviceName}`,
    html: `
      <div style="font-family:Georgia,serif;color:#4a3a35;line-height:1.6">
        <h1 style="color:#c17a6b;font-weight:400">${headlines[input.status] ?? "Appointment update"}</h1>
        <p>Hi ${clientName},</p>
        <p>${bodies[input.status] ?? `Your booking status is now <strong>${status}</strong>.`}</p>
        <p><strong>Service:</strong> ${serviceName}<br/>
        <strong>Date:</strong> ${date}<br/>
        <strong>Time:</strong> ${time}</p>
        <p style="color:#8a756c">- ${SITE.name}</p>
      </div>
    `,
  });

  return { skipped: false as const };
}

/** 24-hour appointment reminder for confirmed bookings. */
export async function sendBookingReminder(input: {
  to: string;
  clientName: string;
  serviceName: string;
  date: string;
  time: string;
  manageHref?: string;
  reference?: string;
}) {
  const resend = getResend();
  if (!resend) {
    console.info("[email:skipped] reminder", input.to);
    return { skipped: true as const };
  }

  const from =
    process.env.RESEND_FROM_EMAIL ?? `Lash Lux <bookings@${SITE.url.replace(/^https?:\/\//, "")}>`;
  const clientName = escapeHtml(input.clientName);
  const serviceName = escapeHtml(input.serviceName);
  const date = escapeHtml(input.date);
  const time = escapeHtml(input.time);
  const reference = input.reference ? escapeHtml(input.reference) : "";
  const manageHref = input.manageHref ?? SITE.whatsapp;

  const { error } = await resend.emails.send({
    from,
    to: input.to,
    subject: `Reminder: ${input.serviceName} tomorrow at ${input.time}`,
    html: `
      <div style="font-family:Georgia,serif;color:#4a3a35;line-height:1.6;max-width:560px">
        <h1 style="color:#c17a6b;font-weight:400;font-size:28px">See you tomorrow, ${clientName}</h1>
        <p>This is your reminder for <strong>${serviceName}</strong> at ${SITE.name}.</p>
        <p>
          <strong>When:</strong> ${date} at ${time}<br/>
          <strong>Where:</strong> ${escapeHtml(SITE.address)}<br/>
          <strong>Phone:</strong> ${escapeHtml(SITE.phoneDisplay)}
          ${reference ? `<br/><strong>Reference:</strong> ${reference}` : ""}
        </p>
        <p>Arrive with clean, makeup-free lashes so we can start on time.</p>
        <p style="margin:24px 0">
          <a href="${escapeHtml(manageHref)}" style="display:inline-block;background:#c17a6b;color:#fff7f4;text-decoration:none;padding:12px 18px;border-radius:999px">
            WhatsApp if you need to reschedule
          </a>
        </p>
        <p style="color:#8a756c">- ${SITE.name}</p>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message ?? "Reminder email failed");
  }

  return { skipped: false as const };
}

/** Deposit payment confirmation. */
export async function sendDepositReceipt(input: {
  to: string;
  clientName: string;
  serviceName: string;
  date: string;
  time: string;
  amountGhs: number;
  reference: string;
}) {
  const resend = getResend();
  if (!resend) {
    return { skipped: true as const };
  }

  const from =
    process.env.RESEND_FROM_EMAIL ?? `Lash Lux <bookings@${SITE.url.replace(/^https?:\/\//, "")}>`;

  await resend.emails.send({
    from,
    to: input.to,
    subject: `Deposit received, ${input.serviceName}`,
    html: `
      <div style="font-family:Georgia,serif;color:#4a3a35;line-height:1.6">
        <h1 style="color:#c17a6b;font-weight:400">Deposit confirmed</h1>
        <p>Hi ${escapeHtml(input.clientName)}, your deposit of <strong>GH₵${input.amountGhs}</strong> is received.</p>
        <p><strong>Service:</strong> ${escapeHtml(input.serviceName)}<br/>
        <strong>Date:</strong> ${escapeHtml(input.date)} at ${escapeHtml(input.time)}<br/>
        <strong>Reference:</strong> ${escapeHtml(input.reference)}</p>
        <p>Your appointment is confirmed. See you at ${escapeHtml(SITE.address)}.</p>
        <p style="color:#8a756c">- ${SITE.name}</p>
      </div>
    `,
  });

  return { skipped: false as const };
}
