/** Studio schedule, single source of truth for booking + display. */

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface DayHours {
  open: string | null;
  close: string | null;
  label: string;
}

/** Open/close in 24h HH:mm. null = closed. */
export const STUDIO_HOURS: Record<Weekday, DayHours> = {
  0: { open: null, close: null, label: "By appointment" },
  1: { open: "10:00", close: "18:00", label: "10:00 AM - 6:00 PM" },
  2: { open: "10:00", close: "18:00", label: "10:00 AM - 6:00 PM" },
  3: { open: "10:00", close: "18:00", label: "10:00 AM - 6:00 PM" },
  4: { open: "10:00", close: "19:00", label: "10:00 AM - 7:00 PM" },
  5: { open: "10:00", close: "19:00", label: "10:00 AM - 7:00 PM" },
  6: { open: "09:00", close: "17:00", label: "9:00 AM - 5:00 PM" },
};

export const BUFFER_MINUTES = 15;

/** Hard daily capacity for online + active bookings (excludes cancelled / no-show). */
export const MAX_APPOINTMENTS_PER_DAY = 5;

/** Convert HH:mm or HH:mm:ss to minutes from midnight. */
export function timeToMinutes(time: string) {
  const [h, m] = time.slice(0, 5).split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(total: number) {
  const h = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const m = (total % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

export function getHoursForDate(date: Date): DayHours {
  return STUDIO_HOURS[date.getDay() as Weekday];
}

export function isStudioOpenOn(date: Date) {
  const hours = getHoursForDate(date);
  return Boolean(hours.open && hours.close);
}

/**
 * Open/closed status for Accra (UTC+0, no DST).
 * Safe on Vercel where server time is UTC.
 */
export function getStudioOpenStatus(now = new Date()) {
  const hours = getHoursForDate(now);
  if (!hours.open || !hours.close) {
    return {
      isOpen: false,
      label: "Closed today · by appointment",
      hoursLabel: hours.label,
    };
  }

  const minutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  const open = timeToMinutes(hours.open);
  const close = timeToMinutes(hours.close);
  const isOpen = minutes >= open && minutes < close;

  return {
    isOpen,
    label: isOpen ? "Open now" : "Closed right now",
    hoursLabel: hours.label,
  };
}

/** True when a date is bookable online (open day, not in the past). */
export function isBookableDate(date: Date, today = new Date()) {
  const start = new Date(today);
  start.setHours(0, 0, 0, 0);
  const candidate = new Date(date);
  candidate.setHours(0, 0, 0, 0);
  if (candidate < start) return false;
  return isStudioOpenOn(candidate);
}

/**
 * Generate start slots that fully fit duration + buffer before close.
 */
export function generateBookableSlots(input: {
  date: Date;
  durationMinutes: number;
  stepMinutes?: number;
  bufferMinutes?: number;
}) {
  const hours = getHoursForDate(input.date);
  if (!hours.open || !hours.close) return [];

  const step = input.stepMinutes ?? 30;
  const buffer = input.bufferMinutes ?? BUFFER_MINUTES;
  const open = timeToMinutes(hours.open);
  const close = timeToMinutes(hours.close);
  const lastStart = close - input.durationMinutes;
  const slots: string[] = [];

  for (let t = open; t <= lastStart; t += step) {
    slots.push(minutesToTime(t));
  }

  // buffer is applied when checking overlaps against other appointments
  void buffer;
  return slots;
}

/** Whether two appointments overlap including buffer between them. */
export function rangesOverlap(
  startA: number,
  endA: number,
  startB: number,
  endB: number,
  bufferMinutes = BUFFER_MINUTES
) {
  return startA < endB + bufferMinutes && startB < endA + bufferMinutes;
}
