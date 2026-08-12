"use client";

import { useQuery } from "@tanstack/react-query";

import { DEMO_SERVICES } from "@/lib/constants";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/client";
import type { Service } from "@/types";

async function fetchServices(): Promise<Service[]> {
  if (!isSupabaseConfigured()) {
    return [...DEMO_SERVICES] as Service[];
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("services")
    .select(
      "id, name, description, price, duration, category, image_url, is_active, sort_order, created_at"
    )
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    return [...DEMO_SERVICES] as Service[];
  }

  return data as Service[];
}

/** Client-side services query with TanStack Query caching. */
export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });
}
