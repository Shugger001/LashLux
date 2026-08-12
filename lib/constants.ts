/** Site-wide constants for Lash Lux. */

function resolveSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return "http://localhost:3000";
  try {
    return new URL(raw).toString().replace(/\/$/, "");
  } catch {
    return "http://localhost:3000";
  }
}

export const SITE = {
  name: "Lash Lux",
  nameCompact: "LASHLUX",
  tagline: "Luxury in every lash.",
  slogan: "Enhance. Elevate. Empower.",
  promise: "Healthy lashes, happy you.",
  badge: "Confidence starts with your lashes.",
  businessType: "Professional eyelash fixing & lash extensions",
  policy: "Walk-ins welcome | Appointments preferred",
  url: resolveSiteUrl(),
  email: "hello@lashlux.com",
  phone: "0547986899",
  phoneDisplay: "054 798 6899",
  whatsapp: "https://wa.me/233547986899",
  address: "Manna Apartment, Old Ashongman",
  instagram: "https://instagram.com/lashlux_",
  instagramHandle: "@lashlux_",
  snapchat: "c_tamidu",
  snapchatUrl: "https://www.snapchat.com/add/c_tamidu",
  facebook: "https://facebook.com/lashlux",
  tiktok: "https://tiktok.com/@lashlux_",
} as const;

export const VALUE_PROPS = [
  { key: "quality", label: "Premium quality", icon: "shield" },
  { key: "gentle", label: "Gentle on lashes", icon: "leaf" },
  { key: "lasting", label: "Long-lasting results", icon: "clock" },
  { key: "custom", label: "Custom looks", icon: "heart" },
] as const;

export const SERVICE_CATEGORIES = [
  "All",
  "Classic",
  "Hybrid",
  "Volume",
  "Specialty",
] as const;

export const GALLERY_CATEGORIES = [
  "All",
  "Classic",
  "Hybrid",
  "Volume",
  "Specialty",
] as const;

export const APPOINTMENT_STATUSES = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
] as const;

export const DEFAULT_HOURS = {
  mon: "10:00 AM – 6:00 PM",
  tue: "10:00 AM – 6:00 PM",
  wed: "10:00 AM – 6:00 PM",
  thu: "10:00 AM – 7:00 PM",
  fri: "10:00 AM – 7:00 PM",
  sat: "9:00 AM – 5:00 PM",
  sun: "By appointment",
} as const;

export const DAY_LABELS: Record<keyof typeof DEFAULT_HOURS, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

/** Fallback demo services aligned with the official Lash Lux flyer. */
export const DEMO_SERVICES = [
  {
    id: "demo-classic",
    name: "Classic Lashes",
    description: "Natural & timeless — one extension per natural lash for everyday elegance.",
    price: 250,
    duration: 120,
    category: "Classic",
    image_url:
      "https://images.unsplash.com/photo-1583003879471-c8e003cdc6ea?w=800&q=80",
    is_active: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-hybrid",
    name: "Hybrid Lashes",
    description: "The perfect blend of natural & volume for soft dimension.",
    price: 300,
    duration: 135,
    category: "Hybrid",
    image_url:
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=80",
    is_active: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-volume",
    name: "Volume Lashes",
    description: "Fuller & fluffier handmade fans for elevated glam.",
    price: 350,
    duration: 150,
    category: "Volume",
    image_url:
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&q=80",
    is_active: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-mega",
    name: "Mega Volume Lashes",
    description: "Bold & dramatic density for maximum impact.",
    price: 450,
    duration: 180,
    category: "Volume",
    image_url:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80",
    is_active: true,
    sort_order: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-removal",
    name: "Lash Removal",
    description: "Safe & gentle professional removal that protects your natural lashes.",
    price: 80,
    duration: 30,
    category: "Specialty",
    image_url:
      "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&q=80",
    is_active: true,
    sort_order: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-care",
    name: "Lash Care Products",
    description: "Keep your lashes luxe with curated aftercare essentials.",
    price: 60,
    duration: 15,
    category: "Specialty",
    image_url:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80",
    is_active: true,
    sort_order: 6,
    created_at: new Date().toISOString(),
  },
] as const;

export const DEMO_GALLERY = [
  {
    id: "g1",
    image_url:
      "https://images.unsplash.com/photo-1583003879471-c8e003cdc6ea?w=1000&q=80",
    title: "Classic Soft Set",
    description: "Natural & timeless",
    category: "Classic",
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "g2",
    image_url:
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=1000&q=80",
    title: "Hybrid Glow",
    description: "Natural meets volume",
    category: "Hybrid",
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "g3",
    image_url:
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=1000&q=80",
    title: "Volume Drama",
    description: "Fuller & fluffier",
    category: "Volume",
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "g4",
    image_url:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1000&q=80",
    title: "Mega Night Out",
    description: "Bold & dramatic",
    category: "Volume",
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "g5",
    image_url:
      "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=1000&q=80",
    title: "Clean Removal Finish",
    description: "Safe & gentle",
    category: "Specialty",
    is_featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "g6",
    image_url:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1000&q=80",
    title: "Luxe Aftercare",
    description: "Keep them luxe",
    category: "Specialty",
    is_featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "g7",
    image_url:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1000&q=80",
    title: "Bridal Classic",
    description: "Soft bridal set",
    category: "Classic",
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "g8",
    image_url:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1000&q=80",
    title: "Cat-Eye Hybrid",
    description: "Elongated hybrid look",
    category: "Hybrid",
    is_featured: false,
    created_at: new Date().toISOString(),
  },
] as const;

export const DEMO_TESTIMONIALS = [
  {
    id: "t1",
    client_name: "Amara K.",
    client_image: null,
    content:
      "The most natural volume set I have ever worn. Soft, fluffy, and lasted beautifully through a full wedding weekend.",
    rating: 5,
    service_used: "Volume Lashes",
    is_approved: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "t2",
    client_name: "Jade M.",
    client_image: null,
    content:
      "Lash Lux is meticulous — my classic set looked perfect from every angle and my eyes still felt comfortable.",
    rating: 5,
    service_used: "Classic Lashes",
    is_approved: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "t3",
    client_name: "Sofia R.",
    client_image: null,
    content:
      "Hybrid lashes gave me the exact balance of glam and everyday wear I wanted. Booking was seamless.",
    rating: 5,
    service_used: "Hybrid Lashes",
    is_approved: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "t4",
    client_name: "Nina T.",
    client_image: null,
    content:
      "Clean studio, gentle technique, and she listened to exactly what I wanted. Instantly booked my fill.",
    rating: 5,
    service_used: "Mega Volume Lashes",
    is_approved: true,
    created_at: new Date().toISOString(),
  },
] as const;

export const LASH_CARE_TIPS = [
  {
    title: "Keep them dry for 24 hours",
    body: "Avoid steam, swimming, and heavy sweating so adhesive can fully cure.",
  },
  {
    title: "Brush gently daily",
    body: "Use a clean spoolie to keep lashes aligned — never from the tips inward.",
  },
  {
    title: "Skip oil-based products",
    body: "Oil near the lash line breaks down adhesive and shortens retention.",
  },
  {
    title: "Sleep on your back when you can",
    body: "Side sleeping compresses fans. A silk pillowcase helps on busy weeks.",
  },
] as const;

export const FAQ_ITEMS = [
  {
    q: "What is eyelash fixing?",
    a: "Eyelash fixing is the application of semi-permanent lash extensions — classic, hybrid, volume, or mega volume — to enhance your natural lashes with a custom look.",
  },
  {
    q: "How long do fixed lashes last?",
    a: "With proper aftercare, a full set typically looks its best for 2–3 weeks. We recommend fills every 2–3 weeks as your natural lashes shed.",
  },
  {
    q: "Will fixing damage my natural lashes?",
    a: "When applied correctly with the right weight and isolation, extensions should not damage natural lashes. We never overload a single lash and use premium adhesives.",
  },
  {
    q: "How should I prepare for my appointment?",
    a: "Arrive with clean, makeup-free lashes. Come ready to relax for the full service duration so we can map and apply your set carefully.",
  },
  {
    q: "Do you accept walk-ins?",
    a: "Walk-ins are welcome when the schedule allows, but appointments are preferred so we can give you a full, unhurried fixing session.",
  },
  {
    q: "Can I wear mascara with extensions?",
    a: "We recommend skipping mascara. If needed, use a water-based formula sparingly on the tips only — never oil-based mascara.",
  },
] as const;
