import { SITE } from "@/lib/constants";

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
