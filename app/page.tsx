import { AboutTeaser } from "@/components/home/about-teaser";
import { FeaturedServices } from "@/components/home/featured-services";
import { GalleryPreview } from "@/components/home/gallery-preview";
import { HeroSection } from "@/components/home/hero-section";
import { HoursContactCta } from "@/components/home/hours-contact-cta";
import { InstagramStrip } from "@/components/home/instagram-strip";
import { TestimonialsSlider } from "@/components/home/testimonials-slider";
import { ValuePropsBar } from "@/components/home/value-props-bar";
import { getGallery, getServices, getTestimonials } from "@/lib/data";
import { localBusinessJsonLd } from "@/lib/seo";

export default async function HomePage() {
  const [services, gallery, testimonials] = await Promise.all([
    getServices(),
    getGallery(true),
    getTestimonials(),
  ]);

  const jsonLd = localBusinessJsonLd();

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
      <InstagramStrip />
      <HoursContactCta />
    </>
  );
}
