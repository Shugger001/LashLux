import { SITE } from "@/lib/constants";

/** Normalize a Ghana/local phone into WhatsApp digits (country code, no +). */
export function toWhatsAppDigits(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("233")) return digits;
  if (digits.startsWith("0")) return `233${digits.slice(1)}`;
  return digits;
}

/** tel: href for native dial/SMS apps. */
export function telHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : undefined;
}

/** WhatsApp chat link to a client number with optional prefilled message. */
export function whatsappToClient(phone: string, message = "") {
  const digits = toWhatsAppDigits(phone);
  if (!digits) return undefined;
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Build a WhatsApp deep link with a prefilled message. */
export function whatsappHref(message: string) {
  return `${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Prefill for booking a named eyelash fixing service. */
export function whatsappBookService(serviceName: string) {
  return whatsappHref(
    `Hi Lash Lux! I'd like to book ${serviceName} eyelash fixing.`
  );
}

/** Prefill after an online booking request. */
export function whatsappBookingFollowUp(input: {
  serviceName: string;
  date: string;
  time: string;
  reference?: string;
}) {
  const ref = input.reference ? ` Reference: ${input.reference}.` : "";
  return whatsappHref(
    `Hi Lash Lux! I just booked ${input.serviceName} for ${input.date} at ${input.time}.${ref}`
  );
}
