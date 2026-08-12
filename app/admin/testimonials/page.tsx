import { TestimonialsManager } from "@/components/admin/testimonials-manager";
import { getAdminTestimonials } from "@/lib/admin-data";

export default async function TestimonialsPage() {
  const testimonials = await getAdminTestimonials();
  return <TestimonialsManager initialTestimonials={testimonials} />;
}
