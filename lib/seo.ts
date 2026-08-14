import type { Metadata } from "next";

import { FAQ_ITEMS, SITE } from "@/lib/constants";
import type { Service } from "@/types";

const DEFAULT_OG_IMAGE = {
  url: "/images/hero-lashes.jpg",
  width: 1600,
  height: 1067,
  alt: "Lash Lux eyelash fixing studio in Old Ashongman",
} as const;

/** Absolute public URL for a site path. */
export function absoluteUrl(path = "/") {
  if (!path || path === "/") return SITE.url;
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Consistent title, description, canonical, and social metadata per page. */
export function pageMetadata(input: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(input.path);
  const imageUrl = input.image ?? DEFAULT_OG_IMAGE.url;
  const socialTitle = `${input.title} | ${SITE.name}`;

  return {
    // Use absolute titles so brand always appears (template was dropping on home).
    title: { absolute: socialTitle },
    description: input.description,
    alternates: { canonical: url },
    robots: input.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: socialTitle,
      description: input.description,
      url,
      siteName: SITE.name,
      type: "website",
      locale: "en_GH",
      images: [
        {
          url: imageUrl,
          width: DEFAULT_OG_IMAGE.width,
          height: DEFAULT_OG_IMAGE.height,
          alt: `${input.title} — ${SITE.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: input.description,
      images: [imageUrl],
    },
  };
}

/** FAQPage structured data for common booking questions. */
export function faqPageJsonLd(
  items: readonly { q: string; a: string }[] = FAQ_ITEMS
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

/** OfferCatalog structured data for the services menu. */
export function serviceCatalogJsonLd(services: Service[]) {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: `${SITE.name} eyelash fixing menu`,
    itemListElement: services.map((service, index) => ({
      "@type": "Offer",
      position: index + 1,
      name: service.name,
      description: service.description,
      price: String(service.price),
      priceCurrency: "GHS",
      url: absoluteUrl(`/book?service=${encodeURIComponent(service.id)}`),
      itemOffered: {
        "@type": "Service",
        name: service.name,
        description: service.description,
        provider: {
          "@type": "BeautySalon",
          name: SITE.name,
        },
      },
    })),
  };
}

/** BreadcrumbList for deeper public pages. */
export function breadcrumbJsonLd(
  items: readonly { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** LocalBusiness + BeautySalon structured data for Google. */
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["BeautySalon", "LocalBusiness"],
    name: SITE.name,
    description: `${SITE.businessType}. ${SITE.tagline}`,
    url: SITE.url,
    telephone: `+233${SITE.phone.replace(/^0/, "")}`,
    email: SITE.email,
    image: absoluteUrl("/images/lash-lux-logo.png"),
    priceRange: "GH₵",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Manna Apartment",
      addressLocality: "Old Ashongman",
      addressRegion: "Greater Accra",
      addressCountry: "GH",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.latitude,
      longitude: SITE.longitude,
    },
    hasMap: SITE.mapsUrl,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday"],
        opens: "10:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Thursday", "Friday"],
        opens: "10:00",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "17:00",
      },
    ],
    sameAs: [SITE.instagram, SITE.snapchatUrl, SITE.facebook, SITE.tiktok],
    makesOffer: {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Eyelash fixing & lash extensions",
        description:
          "Classic, hybrid, volume, and mega volume eyelash fixing in Old Ashongman.",
      },
    },
  };
}
