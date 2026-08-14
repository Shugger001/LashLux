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
  /** Exact studio coordinates (Accra / Old Ashongman). */
  latitude: 5.716256,
  longitude: -0.213092,
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=5.7162560%2C-0.2130920",
  mapsEmbedUrl:
    "https://maps.google.com/maps?q=5.7162560%2C-0.2130920&ll=5.7162560%2C-0.2130920&hl=en&z=17&output=embed",
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
  "Reels",
] as const;

export const APPOINTMENT_STATUSES = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
  "no_show",
] as const;

export const FILL_PACKAGES = [
  {
    name: "2-Week Fill",
    blurb: "Refresh fullness within 2 weeks of your full set.",
  },
  {
    name: "3-Week Fill",
    blurb: "A fuller refresh around the 3-week mark.",
  },
] as const;

export const DEFAULT_HOURS = {
  mon: "10:00 AM - 6:00 PM",
  tue: "10:00 AM - 6:00 PM",
  wed: "10:00 AM - 6:00 PM",
  thu: "10:00 AM - 7:00 PM",
  fri: "10:00 AM - 7:00 PM",
  sat: "9:00 AM - 5:00 PM",
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
    description: "Natural & timeless, one extension per natural lash for everyday elegance.",
    price: 250,
    duration: 120,
    category: "Classic",
    image_url: "/services/classic.jpg",
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
    image_url: "/services/hybrid.jpg",
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
    image_url: "/services/volume.jpg",
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
    image_url: "/services/mega-volume.jpg",
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
    image_url: "/services/removal.jpg",
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
    image_url: "/services/care.jpg",
    is_active: true,
    sort_order: 6,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-fill-2",
    name: "2-Week Fill",
    description:
      "Refresh your set within 2 weeks for lasting fullness between full appointments.",
    price: 180,
    duration: 75,
    category: "Specialty",
    image_url: "/services/fill-2week.jpg",
    is_active: true,
    sort_order: 7,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-fill-3",
    name: "3-Week Fill",
    description:
      "Fill package for sets needing a fuller refresh around the 3-week mark.",
    price: 220,
    duration: 90,
    category: "Specialty",
    image_url: "/services/fill-3week.jpg",
    is_active: true,
    sort_order: 8,
    created_at: new Date().toISOString(),
  },
] as const;

export const DEMO_GALLERY = [
  {
    id: "g1",
    image_url: "/gallery/look-01.png",
    poster_url: null,
    title: "Soft Volume Set",
    description: "Client finish with full, lifted lashes",
    category: "Volume",
    is_featured: true,
    media_type: "image" as const,
    created_at: new Date().toISOString(),
  },
  {
    id: "g2",
    image_url: "/gallery/look-02.png",
    poster_url: null,
    title: "Natural Classic Finish",
    description: "Clean classic mapping for everyday glam",
    category: "Classic",
    is_featured: true,
    media_type: "image" as const,
    created_at: new Date().toISOString(),
  },
  {
    id: "g3",
    image_url: "/gallery/reel-01.mp4",
    poster_url: "/gallery/look-01.png",
    title: "Studio Reel",
    description: "Behind the chair eyelash fixing",
    category: "Reels",
    is_featured: true,
    media_type: "video" as const,
    created_at: new Date().toISOString(),
  },
  {
    id: "g4",
    image_url: "/gallery/reel-02.mp4",
    poster_url: "/gallery/look-02.png",
    title: "Lash Mapping Close-up",
    description: "Detail work on a fresh set",
    category: "Reels",
    is_featured: true,
    media_type: "video" as const,
    created_at: new Date().toISOString(),
  },
  {
    id: "g5",
    image_url: "/gallery/reel-03.mp4",
    poster_url: "/gallery/look-01.png",
    title: "Volume Application",
    description: "Handmade fans going on",
    category: "Reels",
    is_featured: true,
    media_type: "video" as const,
    created_at: new Date().toISOString(),
  },
  {
    id: "g6",
    image_url: "/gallery/reel-04.mp4",
    poster_url: "/gallery/look-02.png",
    title: "Finished Look Spin",
    description: "Client reveal after fixing",
    category: "Reels",
    is_featured: false,
    media_type: "video" as const,
    created_at: new Date().toISOString(),
  },
  {
    id: "g7",
    image_url: "/gallery/reel-05.mp4",
    poster_url: "/gallery/look-01.png",
    title: "Hybrid Texture",
    description: "Soft blend of classic and volume",
    category: "Reels",
    is_featured: true,
    media_type: "video" as const,
    created_at: new Date().toISOString(),
  },
  {
    id: "g8",
    image_url: "/gallery/reel-06.mp4",
    poster_url: "/gallery/look-02.png",
    title: "Lash Finish Reel",
    description: "Fresh studio reel showcasing a finished eyelash set",
    category: "Reels",
    is_featured: true,
    media_type: "video" as const,
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
      "Lash Lux is meticulous, my classic set looked perfect from every angle and my eyes still felt comfortable.",
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
    body: "Use a clean spoolie to keep lashes aligned, never from the tips inward.",
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
    a: "Eyelash fixing is the application of semi-permanent lash extensions (classic, hybrid, volume, or mega volume) to enhance your natural lashes with a custom look.",
  },
  {
    q: "How long do fixed lashes last?",
    a: "With proper aftercare, a full set typically looks its best for 2-3 weeks. We recommend fills every 2-3 weeks as your natural lashes shed.",
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
    q: "Do you offer fill packages?",
    a: "Yes. Book a 2-week or 3-week fill to refresh fullness between full sets. Fills work best when you return before the set becomes sparse.",
  },
  {
    q: "Do I need a deposit?",
    a: "When deposits are enabled, a small Paystack payment holds your slot online. The balance is paid at the studio. Otherwise you can request an appointment and confirm by WhatsApp.",
  },
  {
    q: "Can I wear mascara with extensions?",
    a: "We recommend skipping mascara. If needed, use a water-based formula sparingly on the tips only, never oil-based mascara.",
  },
] as const;
