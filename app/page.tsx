import type { Metadata } from "next";

import { AboutTeaser } from "@/components/home/about-teaser";
import { FaqSection } from "@/components/home/faq-section";
import { FeaturedServices } from "@/components/home/featured-services";
import { GalleryPreview } from "@/components/home/gallery-preview";
import { HeroSection } from "@/components/home/hero-section";
import { HoursContactCta } from "@/components/home/hours-contact-cta";
import { TestimonialsSlider } from "@/components/home/testimonials-slider";
import { ValuePropsBar } from "@/components/home/value-props-bar";
import { FAQ_ITEMS } from "@/lib/constants";
import { getGallery, getServices, getTestimonials } from "@/lib/data";
import { faqPageJsonLd, localBusinessJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Eyelash Fixing & Lash Extensions in Old Ashongman",
  description:
    "Lash Lux offers professional eyelash fixing in Old Ashongman, classic, hybrid, volume, and mega volume lash extensions. Walk-ins welcome, appointments preferred.",
  path: "/",
});

export default async function HomePage() {
  const [services, gallery, testimonials] = await Promise.all([
    getServices(),
    getGallery(true),
    getTestimonials(),
  ]);

  const businessLd = localBusinessJsonLd();
  const faqLd = faqPageJsonLd(FAQ_ITEMS.slice(0, 6));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <HeroSection />
      <ValuePropsBar />
      <FeaturedServices services={services} />
      <GalleryPreview items={gallery} />
      <TestimonialsSlider items={testimonials} />
      <AboutTeaser />
      <FaqSection />
      <HoursContactCta />
    </>
  );
}
