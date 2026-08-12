import { Skeleton } from "@/components/ui/card";

/** Full-page skeleton matching the home hero + section rhythm. */
export function HomePageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading page">
      <section className="hero-flush relative min-h-[100dvh] overflow-hidden">
        <Skeleton className="absolute inset-0 rounded-none" />
        <div className="container-page relative flex min-h-[100dvh] flex-col justify-end pb-16 pt-28 sm:pb-20 lg:pb-24">
          <div className="max-w-2xl space-y-5">
            <div className="flex items-center gap-3">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
            <Skeleton className="h-12 w-64 sm:h-14 sm:w-80" />
            <Skeleton className="h-16 w-full max-w-xl sm:h-20" />
            <Skeleton className="h-4 w-full max-w-lg" />
            <Skeleton className="h-4 w-3/4 max-w-md" />
            <div className="flex flex-wrap gap-3 pt-2">
              <Skeleton className="h-12 w-44 rounded-full" />
              <Skeleton className="h-12 w-32 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad border-y border-[#c9a27e]/15">
        <div className="container-page grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="space-y-3 text-center">
              <Skeleton className="mx-auto h-14 w-14 rounded-full" />
              <Skeleton className="mx-auto h-4 w-28" />
            </div>
          ))}
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <div className="mb-10 max-w-md space-y-3">
            <Skeleton className="h-6 w-36 rounded-full" />
            <Skeleton className="h-10 w-72" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[4/5] w-full rounded-[1.5rem]" />
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/** Generic interior page skeleton (eyebrow + title + content blocks). */
export function ContentPageSkeleton({
  cards = 6,
  columns = "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
}: {
  cards?: number;
  columns?: string;
}) {
  return (
    <section className="section-pad" aria-busy="true" aria-label="Loading page">
      <div className="container-page">
        <div className="mb-12 max-w-2xl space-y-4">
          <Skeleton className="h-6 w-40 rounded-full" />
          <Skeleton className="h-12 w-full max-w-lg sm:h-14" />
          <Skeleton className="h-4 w-full max-w-md" />
          <Skeleton className="h-4 w-3/4 max-w-sm" />
        </div>
        <div className={columns}>
          {Array.from({ length: cards }, (_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[4/5] w-full rounded-[1.25rem]" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Booking wizard skeleton. */
export function BookingWizardSkeleton() {
  return (
    <div className="frame-lux mx-auto max-w-3xl" aria-busy="true" aria-label="Loading booking form">
      <div className="frame-lux-inner space-y-6 p-6 sm:p-8">
        <div className="flex gap-2">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-2 flex-1 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-6 w-48" />
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
        <Skeleton className="ml-auto h-12 w-36 rounded-full" />
      </div>
    </div>
  );
}

/** Full booking page skeleton. */
export function BookingPageSkeleton() {
  return (
    <section className="section-pad" aria-busy="true" aria-label="Loading booking">
      <div className="container-page">
        <div className="mx-auto mb-10 max-w-2xl space-y-4 text-center">
          <Skeleton className="mx-auto h-6 w-36 rounded-full" />
          <Skeleton className="mx-auto h-12 w-full max-w-md sm:h-14" />
          <Skeleton className="mx-auto h-4 w-full max-w-sm" />
        </div>
        <BookingWizardSkeleton />
      </div>
    </section>
  );
}

/** Auth / form page skeleton. */
export function FormPageSkeleton() {
  return (
    <section className="section-pad" aria-busy="true" aria-label="Loading">
      <div className="container-page">
        <div className="frame-lux mx-auto max-w-md">
          <div className="frame-lux-inner space-y-5 p-6 sm:p-8">
            <div className="mx-auto mb-4 max-w-xs space-y-3 text-center">
              <Skeleton className="mx-auto h-6 w-24 rounded-full" />
              <Skeleton className="mx-auto h-10 w-48" />
              <Skeleton className="mx-auto h-4 w-56" />
            </div>
            <Skeleton className="h-11 w-full rounded-md" />
            <Skeleton className="h-11 w-full rounded-md" />
            <Skeleton className="h-12 w-full rounded-full" />
            <Skeleton className="h-12 w-full rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
