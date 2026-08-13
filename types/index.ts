/** Shared domain types for Lash Lux. */

export type UserRole = "client" | "admin";

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

export type PaymentStatus =
  | "none"
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

export type SettingType = "text" | "json" | "boolean";

export interface UserProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  image_url: string | null;
  is_active: boolean;
  sort_order?: number;
  created_at: string;
}

export interface Appointment {
  id: string;
  user_id: string | null;
  service_id: string;
  appointment_date: string;
  appointment_time: string;
  status: AppointmentStatus;
  notes: string | null;
  client_name?: string | null;
  client_email?: string | null;
  client_phone?: string | null;
  payment_status?: PaymentStatus;
  payment_reference?: string | null;
  deposit_amount?: number;
  reminder_sent_at?: string | null;
  created_at: string;
  updated_at: string;
  service?: Service | null;
  user?: UserProfile | null;
}

export interface BlockedTime {
  id: string;
  block_date: string;
  start_time: string | null;
  end_time: string | null;
  reason: string;
  created_at: string;
}

export type GalleryMediaType = "image" | "video";

export interface GalleryItem {
  id: string;
  image_url: string;
  title: string;
  description: string | null;
  category: string;
  is_featured: boolean;
  media_type?: GalleryMediaType;
  poster_url?: string | null;
  created_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_image: string | null;
  content: string;
  rating: number;
  service_used: string | null;
  is_approved: boolean;
  created_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  type: SettingType;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface BusinessHours {
  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
  sat: string;
  sun: string;
}

export interface BookingFormData {
  serviceId: string;
  date: string;
  time: string;
  fullName: string;
  phone: string;
  notes?: string;
}

export interface AdminStats {
  totalAppointments: number;
  revenue: number;
  newClients: number;
  popularService: string;
  weeklyBookings: { day: string; count: number }[];
  recentAppointments: Appointment[];
  pendingCount: number;
  todayDate: string;
  todayAppointments: Appointment[];
  todayActiveCount: number;
  todayCapacity: number;
}
