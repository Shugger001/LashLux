import type { Metadata } from "next";
import { Suspense } from "react";

import { BookingWizard } from "@/components/booking/booking-wizard";
import { Skeleton } from "@/components/ui/card";
import { getServices } from "@/lib/data";

export const metadata: Metadata = {
  title: "Book a Lash Session",
  description:
    "Choose your Lash Lux lash service, date, and preferred time in a few simple steps.",
};

export default async function BookPage() {
  const services = await getServices();

  return (
    <section className="section-pad">
      <div className="container-page">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="eyebrow">Online booking</p>
          <h1 className="mt-5 text-balance font-display text-5xl text-ink sm:text-6xl">
            Book your lash session.
          </h1>
          <p className="mt-4 text-pretty text-muted-foreground">
            Choose a service and preferred time. Your request stays pending
            until the studio confirms it.
          </p>
        </div>
        <Suspense fallback={<Skeleton className="mx-auto h-[560px] max-w-3xl" />}>
          <BookingWizard services={services} />
        </Suspense>
      </div>
    </section>
  );
}
