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
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-rose">
            Online booking
          </p>
          <h1 className="mt-3 font-display text-5xl text-ink sm:text-6xl">
            Book your lash session.
          </h1>
          <p className="mt-4 text-muted-foreground">
            Choose a service and preferred time. We will email you once your
            appointment is confirmed.
          </p>
        </div>
        <Suspense fallback={<Skeleton className="mx-auto h-[560px] max-w-3xl" />}>
          <BookingWizard services={services} />
        </Suspense>
      </div>
    </section>
  );
}
