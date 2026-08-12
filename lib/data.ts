import {
  DEMO_GALLERY,
  DEMO_SERVICES,
  DEMO_TESTIMONIALS,
} from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";
import type { GalleryItem, Service, Testimonial } from "@/types";

/** Fetch active services, falls back to demo data without Supabase. */
export async function getServices(): Promise<Service[]> {
  if (!isSupabaseConfigured()) {
    return [...DEMO_SERVICES] as Service[];
  }

  try {
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
  } catch {
    return [...DEMO_SERVICES] as Service[];
  }
}

export async function getGallery(featuredOnly = false): Promise<GalleryItem[]> {
  if (!isSupabaseConfigured()) {
    const items = [...DEMO_GALLERY] as GalleryItem[];
    return featuredOnly ? items.filter((g) => g.is_featured) : items;
  }

  try {
    const supabase = createClient();
    let query = supabase
      .from("gallery")
      .select(
        "id, image_url, title, description, category, is_featured, media_type, poster_url, created_at"
      )
      .order("created_at", { ascending: false });

    if (featuredOnly) {
      query = query.eq("is_featured", true);
    }

    const { data, error } = await query;
    if (error || !data?.length) {
      const items = [...DEMO_GALLERY] as GalleryItem[];
      return featuredOnly ? items.filter((g) => g.is_featured) : items;
    }
    return data as GalleryItem[];
  } catch {
    const items = [...DEMO_GALLERY] as GalleryItem[];
    return featuredOnly ? items.filter((g) => g.is_featured) : items;
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isSupabaseConfigured()) {
    return [...DEMO_TESTIMONIALS] as Testimonial[];
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select(
        "id, client_name, client_image, content, rating, service_used, is_approved, created_at"
      )
      .eq("is_approved", true)
      .order("created_at", { ascending: false });

    if (error || !data?.length) {
      return [...DEMO_TESTIMONIALS] as Testimonial[];
    }
    return data as Testimonial[];
  } catch {
    return [...DEMO_TESTIMONIALS] as Testimonial[];
  }
}

export async function getCurrentProfile() {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
      .from("users")
      .select("id, full_name, phone, role, created_at, updated_at")
      .eq("id", user.id)
      .maybeSingle();

    return data ? { ...data, email: user.email } : null;
  } catch {
    return null;
  }
}
