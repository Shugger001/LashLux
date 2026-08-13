import type { Metadata } from "next";
import { Suspense } from "react";

import { BookingWizard } from "@/components/booking/booking-wizard";
import { BookingWizardSkeleton } from "@/components/ui/page-skeletons";
import { getServices } from "@/lib/data";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Book Eyelash Fixing",
  description:
    "Book professional eyelash fixing at Lash Lux, classic, hybrid, volume, or mega volume in Old Ashongman.",
  path: "/book",
});

export default async function BookPage() {
  const services = await getServices();
  const crumbsLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Book", path: "/book" },
  ]);

  return (
    <section className="section-pad">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbsLd) }}
      />
      <div className="container-page">
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
          <p className="eyebrow">Online booking</p>
          <h1 className="mt-4 text-balance font-editorial text-4xl text-ink sm:mt-5 sm:text-6xl">
            Book your eyelash fixing.
          </h1>
          <div className="mx-auto mt-5 h-px w-16 bg-gradient-to-r from-transparent via-[#c9a27e] to-transparent" />
          <p className="mt-4 text-pretty text-sm text-muted-foreground sm:text-base">
            Choose a lash set and preferred time. Your request stays pending
            until we confirm it.
          </p>
        </div>
        <Suspense fallback={<BookingWizardSkeleton />}>
          <BookingWizard services={services} />
        </Suspense>
      </div>
    </section>
  );
}
