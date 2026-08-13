import { FAQ_ITEMS, SITE } from "@/lib/constants";

/** FAQPage structured data for common booking questions. */
export function faqPageJsonLd(items: readonly { q: string; a: string }[] = FAQ_ITEMS) {
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
    image: `${SITE.url}/images/lash-lux-logo.png`,
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
      latitude: 5.703,
      longitude: -0.22,
    },
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
