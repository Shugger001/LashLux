"use client";

import { useQuery } from "@tanstack/react-query";

import { generateTimeSlots } from "@/lib/utils";

async function fetchAvailability(date: string, serviceId: string) {
  const params = new URLSearchParams({ date, serviceId });
  const res = await fetch(`/api/availability?${params.toString()}`);
  if (!res.ok) {
    return { slots: generateTimeSlots(), demo: true };
  }
  return res.json() as Promise<{ slots: string[]; demo?: boolean }>;
}

/** Available time slots for a booking date + service. */
export function useAvailability(date: string | null, serviceId: string | null) {
  return useQuery({
    queryKey: ["availability", date, serviceId],
    queryFn: () => fetchAvailability(date!, serviceId!),
    enabled: Boolean(date && serviceId),
  });
}
