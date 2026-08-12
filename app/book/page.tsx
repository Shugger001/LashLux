import type { Metadata } from "next";
import { Suspense } from "react";

import { BookingWizard } from "@/components/booking/booking-wizard";
import { BookingWizardSkeleton } from "@/components/ui/page-skeletons";
import { getServices } from "@/lib/data";

export const metadata: Metadata = {
  title: "Book Eyelash Fixing",
  description:
    "Book professional eyelash fixing at Lash Lux — classic, hybrid, volume, or mega volume in Old Ashongman.",
};

export default async function BookPage() {
  const services = await getServices();

  return (
    <section className="section-pad">
      <div className="container-page">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="eyebrow">Online booking</p>
          <h1 className="mt-5 text-balance font-display text-5xl text-ink sm:text-6xl">
            Book your eyelash fixing.
          </h1>
          <p className="mt-4 text-pretty text-muted-foreground">
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
