import type { Metadata } from "next";

import { AboutContent } from "@/components/about/about-content";
import { FAQ_ITEMS } from "@/lib/constants";
import { breadcrumbJsonLd, faqPageJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About Lash Lux",
  description:
    "Lash Lux is a professional eyelash fixing studio in Old Ashongman, classic, hybrid, volume, and mega volume extensions with careful hygiene standards.",
  path: "/about",
});

export default function AboutPage() {
  const faqLd = faqPageJsonLd(FAQ_ITEMS);
  const crumbsLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbsLd) }}
      />
      <AboutContent />
    </>
  );
}
