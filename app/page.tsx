import { AboutTeaser } from "@/components/home/about-teaser";
import { FeaturedServices } from "@/components/home/featured-services";
import { GalleryPreview } from "@/components/home/gallery-preview";
import { HeroSection } from "@/components/home/hero-section";
import { HoursContactCta } from "@/components/home/hours-contact-cta";
import { TestimonialsSlider } from "@/components/home/testimonials-slider";
import { ValuePropsBar } from "@/components/home/value-props-bar";
import { SITE } from "@/lib/constants";
import { getGallery, getServices, getTestimonials } from "@/lib/data";

export default async function HomePage() {
  const [services, gallery, testimonials] = await Promise.all([
    getServices(),
    getGallery(true),
    getTestimonials(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: SITE.name,
    description: SITE.tagline,
    url: SITE.url,
    telephone: SITE.phone,
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Manna Apartment",
      addressLocality: "Old Ashongman",
      addressCountry: "GH",
    },
    sameAs: [SITE.instagram, SITE.whatsapp],
    image:
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=1200&q=80",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <ValuePropsBar />
      <FeaturedServices services={services} />
      <GalleryPreview items={gallery} />
      <TestimonialsSlider items={testimonials} />
      <AboutTeaser />
      <HoursContactCta />
    </>
  );
}
