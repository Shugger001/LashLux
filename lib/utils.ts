import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names with conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format GHS currency for Lash Lux. */
export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format minutes as "2h 15m". */
export function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/** Display time from HH:mm or HH:mm:ss. */
export function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m, 0, 0);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Safe JSON parse with fallback. */
export function safeJsonParse<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

/** Generate 30-minute slots between open/close (HH:mm). */
export function generateTimeSlots(
  openTime = "09:00",
  closeTime = "18:00",
  stepMinutes = 30
): string[] {
  const slots: string[] = [];
  const [openH, openM] = openTime.split(":").map(Number);
  const [closeH, closeM] = closeTime.split(":").map(Number);
  let current = openH * 60 + openM;
  const end = closeH * 60 + closeM;

  while (current + stepMinutes <= end) {
    const h = Math.floor(current / 60)
      .toString()
      .padStart(2, "0");
    const m = (current % 60).toString().padStart(2, "0");
    slots.push(`${h}:${m}`);
    current += stepMinutes;
  }

  return slots;
}

/** Build iCal event content for an appointment. */
export function buildICalEvent(input: {
  id: string;
  title: string;
  date: string;
  time: string;
  durationMinutes: number;
  description?: string;
}) {
  const [y, mo, d] = input.date.split("-").map(Number);
  const [h, mi] = input.time.split(":").map(Number);
  const start = new Date(y, mo - 1, d, h, mi);
  const end = new Date(start.getTime() + input.durationMinutes * 60_000);

  const stamp = (dt: Date) =>
    dt
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//LashLux//Appointments//EN",
    "BEGIN:VEVENT",
    `UID:${input.id}@lashlux.com`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${input.title}`,
    `DESCRIPTION:${(input.description ?? "").replace(/\n/g, "\\n")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
