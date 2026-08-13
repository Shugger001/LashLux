import {
  DEMO_GALLERY,
  DEMO_SERVICES,
  DEMO_TESTIMONIALS,
  SITE,
} from "@/lib/constants";
import { MAX_APPOINTMENTS_PER_DAY } from "@/lib/schedule";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type {
  AdminStats,
  Appointment,
  ContactMessage,
  GalleryItem,
  Service,
  SiteSetting,
  Testimonial,
  UserProfile,
} from "@/types";

export interface AdminClient extends UserProfile {
  email: string;
  appointments: Appointment[];
}

export interface AdminSettings {
  businessName: string;
  email: string;
  phone: string;
  address: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  bookingBuffer: number;
  maxBookingDays: number;
  seoTitle: string;
  seoDescription: string;
}

const now = new Date();
const dateFromToday = (offset: number) => {
  const date = new Date(now);
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
};

export const DEMO_APPOINTMENTS: Appointment[] = [
  {
    id: "apt-1",
    user_id: "client-1",
    service_id: "demo-hybrid",
    appointment_date: dateFromToday(0),
    appointment_time: "10:00",
    status: "confirmed",
    notes: "Soft cat-eye mapping",
    client_name: "Amara King",
    client_email: "amara@example.com",
    client_phone: "054 111 0001",
    created_at: dateFromToday(-8),
    updated_at: dateFromToday(-1),
    service: DEMO_SERVICES[1] as Service,
  },
  {
    id: "apt-2",
    user_id: "client-2",
    service_id: "demo-classic",
    appointment_date: dateFromToday(1),
    appointment_time: "13:30",
    status: "pending",
    notes: null,
    client_name: "Jade Morgan",
    client_email: "jade@example.com",
    client_phone: "054 111 0002",
    created_at: dateFromToday(-2),
    updated_at: dateFromToday(-2),
    service: DEMO_SERVICES[0] as Service,
  },
  {
    id: "apt-3",
    user_id: "client-3",
    service_id: "demo-volume",
    appointment_date: dateFromToday(3),
    appointment_time: "15:00",
    status: "confirmed",
    notes: "Wedding trial",
    client_name: "Sofia Rivera",
    client_email: "sofia@example.com",
    client_phone: "054 111 0003",
    created_at: dateFromToday(-12),
    updated_at: dateFromToday(-4),
    service: DEMO_SERVICES[2] as Service,
  },
  {
    id: "apt-4",
    user_id: "client-1",
    service_id: "demo-classic",
    appointment_date: dateFromToday(-12),
    appointment_time: "11:00",
    status: "completed",
    notes: null,
    client_name: "Amara King",
    client_email: "amara@example.com",
    client_phone: "054 111 0001",
    created_at: dateFromToday(-24),
    updated_at: dateFromToday(-12),
    service: DEMO_SERVICES[0] as Service,
  },
  {
    id: "apt-5",
    user_id: "client-4",
    service_id: "demo-removal",
    appointment_date: dateFromToday(-2),
    appointment_time: "09:30",
    status: "cancelled",
    notes: "Reschedule requested",
    client_name: "Nina Taylor",
    client_email: "nina@example.com",
    client_phone: "054 111 0004",
    created_at: dateFromToday(-9),
    updated_at: dateFromToday(-3),
    service: DEMO_SERVICES[4] as Service,
  },
];

export const DEMO_CLIENTS: AdminClient[] = [
  ["client-1", "Amara King", "amara@example.com", "054 111 0001", -90],
  ["client-2", "Jade Morgan", "jade@example.com", "054 111 0002", -32],
  ["client-3", "Sofia Rivera", "sofia@example.com", "054 111 0003", -18],
  ["client-4", "Nina Taylor", "nina@example.com", "054 111 0004", -9],
].map(([id, name, email, phone, offset]) => ({
  id: String(id),
  full_name: String(name),
  email: String(email),
  phone: String(phone),
  role: "client",
  created_at: dateFromToday(Number(offset)),
  updated_at: dateFromToday(Number(offset)),
  appointments: DEMO_APPOINTMENTS.filter((item) => item.user_id === id),
}));

export const DEMO_SETTINGS: AdminSettings = {
  businessName: SITE.name,
  email: SITE.email,
  phone: SITE.phone,
  address: SITE.address,
  instagram: SITE.instagram,
  facebook: SITE.facebook,
  tiktok: SITE.tiktok,
  bookingBuffer: 30,
  maxBookingDays: 60,
  seoTitle: "Lash Lux | Eyelash Fixing & Lash Extensions in Old Ashongman",
  seoDescription:
    "Professional eyelash fixing at Lash Lux, classic, hybrid, volume, and mega volume extensions at Manna Apartment, Old Ashongman.",
};

/** Return all services for administration, including inactive entries. */
export async function getAdminServices(): Promise<Service[]> {
  if (!isSupabaseConfigured()) {
    return process.env.NODE_ENV === "production" ? [] : ([...DEMO_SERVICES] as Service[]);
  }
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("services")
      .select(
        "id, name, description, price, duration, category, image_url, is_active, sort_order, created_at"
      )
      .order("sort_order", { ascending: true });
    if (error) {
      console.error("[admin:services-query]", { message: error.message });
      return [];
    }
    return (data as Service[]) ?? [];
  } catch (error) {
    console.error("[admin:services-failed]", {
      message: error instanceof Error ? error.message : "unknown",
    });
    return [];
  }
}

/** Return gallery entries for administration. */
export async function getAdminGallery(): Promise<GalleryItem[]> {
  if (!isSupabaseConfigured()) {
    return process.env.NODE_ENV === "production" ? [] : ([...DEMO_GALLERY] as GalleryItem[]);
  }
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("gallery")
      .select(
        "id, image_url, title, description, category, is_featured, media_type, poster_url, created_at"
      )
      .order("created_at", { ascending: false });
    if (error) {
      console.error("[admin:gallery-query]", { message: error.message });
      return [];
    }
    return (data as GalleryItem[]) ?? [];
  } catch (error) {
    console.error("[admin:gallery-failed]", {
      message: error instanceof Error ? error.message : "unknown",
    });
    return [];
  }
}

/** Return testimonials, including those awaiting approval. */
export async function getAdminTestimonials(): Promise<Testimonial[]> {
  if (!isSupabaseConfigured()) {
    return process.env.NODE_ENV === "production"
      ? []
      : ([...DEMO_TESTIMONIALS] as Testimonial[]);
  }
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("testimonials")
      .select(
        "id, client_name, client_image, content, rating, service_used, is_approved, created_at"
      )
      .order("created_at", { ascending: false });
    if (error) {
      console.error("[admin:testimonials-query]", { message: error.message });
      return [];
    }
    return (data as Testimonial[]) ?? [];
  } catch (error) {
    console.error("[admin:testimonials-failed]", {
      message: error instanceof Error ? error.message : "unknown",
    });
    return [];
  }
}

/** Return appointments with related service and client profile data. */
export async function getAdminAppointments(): Promise<Appointment[]> {
  if (!isSupabaseConfigured()) return DEMO_APPOINTMENTS;
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("appointments")
      .select(
        "id, user_id, service_id, appointment_date, appointment_time, status, notes, client_name, client_email, client_phone, payment_status, payment_reference, deposit_amount, reminder_sent_at, created_at, updated_at, service:services(id, name, description, price, duration, category, image_url, is_active, sort_order, created_at), user:users(id, full_name, phone, role, created_at, updated_at)"
      )
      .order("appointment_date", { ascending: false })
      .order("appointment_time", { ascending: false });
    if (error) {
      console.error("[admin:appointments-query]", { message: error.message });
      return [];
    }
    return ((data as unknown as Appointment[]) ?? []);
  } catch (error) {
    console.error("[admin:appointments-failed]", {
      message: error instanceof Error ? error.message : "unknown",
    });
    return [];
  }
}

/** Return client profiles and their booking history. */
export async function getAdminClients(): Promise<AdminClient[]> {
  if (!isSupabaseConfigured()) return DEMO_CLIENTS;
  try {
    const admin = createAdminClient();
    const { data: users, error } = await admin
      .from("users")
      .select("id, full_name, phone, role, created_at, updated_at")
      .eq("role", "client")
      .order("created_at", { ascending: false });
    if (error || !users) return [];
    const appointments = await getAdminAppointments();
    return users.map((user) => ({
      ...user,
      email:
        appointments.find((appointment) => appointment.user_id === user.id)
          ?.client_email ?? "",
      appointments: appointments.filter(
        (appointment) => appointment.user_id === user.id
      ),
    })) as AdminClient[];
  } catch {
    return [];
  }
}

/** Return contact form messages for the admin inbox. */
export async function getAdminContactMessages(): Promise<ContactMessage[]> {
  if (!isSupabaseConfigured()) {
    return process.env.NODE_ENV === "production" ? [] : [];
  }
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("contact_messages")
      .select("id, name, email, message, is_read, created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) {
      console.error("[admin:messages-query]", { message: error.message });
      return [];
    }
    return (data as ContactMessage[]) ?? [];
  } catch (error) {
    console.error("[admin:messages-failed]", {
      message: error instanceof Error ? error.message : "unknown",
    });
    return [];
  }
}

/** Unread contact messages count for nav badge. */
export async function getUnreadContactCount(): Promise<number> {
  if (!isSupabaseConfigured()) return 0;
  try {
    const admin = createAdminClient();
    const { count, error } = await admin
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false);
    if (error) {
      console.error("[admin:messages-unread]", { message: error.message });
      return 0;
    }
    return count ?? 0;
  } catch (error) {
    console.error("[admin:messages-unread-failed]", {
      message: error instanceof Error ? error.message : "unknown",
    });
    return 0;
  }
}

/** Count appointments awaiting confirmation (for nav badge). */
export async function getPendingAppointmentCount(): Promise<number> {
  if (!isSupabaseConfigured()) {
    return DEMO_APPOINTMENTS.filter((item) => item.status === "pending").length;
  }
  try {
    const admin = createAdminClient();
    const { count, error } = await admin
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending");
    if (error) {
      console.error("[admin:pending-count]", { message: error.message });
      return 0;
    }
    return count ?? 0;
  } catch (error) {
    console.error("[admin:pending-count-failed]", {
      message: error instanceof Error ? error.message : "unknown",
    });
    return 0;
  }
}

/** Calculate dashboard metrics from current appointment and client data. */
export async function getAdminStats(): Promise<AdminStats> {
  const [appointments, clients] = await Promise.all([
    getAdminAppointments(),
    getAdminClients(),
  ]);
  const completed = appointments.filter((item) => item.status === "completed");
  const serviceCounts = appointments.reduce<Record<string, number>>(
    (counts, item) => {
      const name = item.service?.name ?? "Unknown";
      counts[name] = (counts[name] ?? 0) + 1;
      return counts;
    },
    {}
  );
  const popularService =
    Object.entries(serviceCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "-";
  const weeklyBookings = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (6 - index));
    const iso = date.toISOString().slice(0, 10);
    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      count: appointments.filter((item) => item.created_at.slice(0, 10) === iso)
        .length,
    };
  });

  const todayDate = now.toISOString().slice(0, 10);
  const todayAppointments = appointments
    .filter((item) => item.appointment_date === todayDate)
    .sort((a, b) => a.appointment_time.localeCompare(b.appointment_time));
  const todayActiveCount = todayAppointments.filter(
    (item) => item.status !== "cancelled" && item.status !== "no_show"
  ).length;

  return {
    totalAppointments: appointments.length,
    revenue: completed.reduce(
      (total, item) => total + (item.service?.price ?? 0),
      0
    ),
    newClients: clients.filter(
      (client) =>
        new Date(client.created_at).getTime() >
        now.getTime() - 30 * 24 * 60 * 60 * 1000
    ).length,
    popularService,
    weeklyBookings,
    recentAppointments: [...appointments]
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, 5),
    pendingCount: appointments.filter((item) => item.status === "pending")
      .length,
    todayDate,
    todayAppointments,
    todayActiveCount,
    todayCapacity: MAX_APPOINTMENTS_PER_DAY,
  };
}

/** Return persisted settings mapped onto the admin settings form. */
export async function getAdminSettings(): Promise<AdminSettings> {
  if (!isSupabaseConfigured()) return DEMO_SETTINGS;
  try {
    const admin = createAdminClient();
    const { data: rows, error } = await admin
      .from("site_settings")
      .select("id, key, value, type");
    if (error) {
      console.error("[admin:settings-query]", { message: error.message });
      return DEMO_SETTINGS;
    }
    const values = Object.fromEntries(
      (rows as SiteSetting[] | null)?.map((row) => [row.key, row.value]) ?? []
    );
    return {
      ...DEMO_SETTINGS,
      businessName: values.business_name ?? DEMO_SETTINGS.businessName,
      email: values.business_email ?? DEMO_SETTINGS.email,
      phone: values.business_phone ?? DEMO_SETTINGS.phone,
      address: values.business_address ?? DEMO_SETTINGS.address,
      instagram: values.instagram ?? DEMO_SETTINGS.instagram,
      facebook: values.facebook ?? DEMO_SETTINGS.facebook,
      tiktok: values.tiktok ?? DEMO_SETTINGS.tiktok,
      bookingBuffer: Number(values.booking_buffer ?? DEMO_SETTINGS.bookingBuffer),
      maxBookingDays: Number(
        values.max_booking_days ?? DEMO_SETTINGS.maxBookingDays
      ),
      seoTitle: values.seo_title ?? DEMO_SETTINGS.seoTitle,
      seoDescription: values.seo_description ?? DEMO_SETTINGS.seoDescription,
    };
  } catch (error) {
    console.error("[admin:settings-failed]", {
      message: error instanceof Error ? error.message : "unknown",
    });
    return DEMO_SETTINGS;
  }
}
