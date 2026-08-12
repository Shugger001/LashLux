"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import { formatCurrency, formatDuration } from "@/lib/utils";
import { whatsappBookService } from "@/lib/whatsapp";
import type { Service } from "@/types";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&q=80";

/** Filterable catalog of lash services with accessible detail dialogs. */
export function ServicesCatalog({ services }: { services: Service[] }) {
  const [category, setCategory] = useState<(typeof SERVICE_CATEGORIES)[number]>(
    "All"
  );
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const filtered =
    category === "All"
      ? services
      : services.filter((service) => service.category === category);

  return (
    <>
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Filter services by category"
      >
        {SERVICE_CATEGORIES.map((item) => (
          <Button
            key={item}
            type="button"
            variant={category === item ? "primary" : "outline"}
            size="sm"
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
          >
            {item}
          </Button>
        ))}
      </div>

      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((service) => (
          <FadeIn key={service.id}>
          <article className="frame-lux group h-full">
            <div className="frame-lux-inner h-full overflow-hidden">
            <button
              type="button"
              className="relative block aspect-[4/3] w-full overflow-hidden focus-ring"
              onClick={() => setSelectedService(service)}
              aria-label={`View details for ${service.name}`}
            >
              <Image
                src={service.image_url ?? FALLBACK_IMAGE}
                alt={service.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </button>
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">
                    {service.category}
                  </p>
                  <h2 className="mt-2 font-editorial text-3xl text-ink">
                    {service.name}
                  </h2>
                </div>
                <p className="font-display text-base font-semibold text-rose-deep">
                  {formatCurrency(Number(service.price))}
                </p>
              </div>
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
                {service.description}
              </p>
              <p className="mt-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-[#c9a27e]">
                <Clock className="h-3.5 w-3.5" aria-hidden />
                {formatDuration(service.duration)}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="flex-1">
                  <Link href={`/book?service=${encodeURIComponent(service.id)}`}>
                    Book now
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <a
                    href={whatsappBookService(service.name)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() =>
                      trackEvent("whatsapp_click", { source: "services", service: service.name })
                    }
                  >
                    WhatsApp
                  </a>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedService(service)}
                >
                  Details
                </Button>
              </div>
            </div>
            </div>
          </article>
          </FadeIn>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="frame-lux mt-10">
          <p className="frame-lux-inner p-8 text-center text-muted-foreground">
            No services are available in this category yet.
          </p>
        </div>
      )}

      <Dialog
        open={Boolean(selectedService)}
        onOpenChange={(open) => !open && setSelectedService(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-2xl">
          {selectedService && (
            <>
              <div className="relative aspect-[16/9] overflow-hidden sm:rounded-t-xl">
                <Image
                  src={selectedService.image_url ?? FALLBACK_IMAGE}
                  alt={selectedService.name}
                  fill
                  className="object-cover"
                  sizes="672px"
                />
              </div>
              <div className="p-6 sm:p-8">
                <DialogHeader>
                  <p className="eyebrow">
                    {selectedService.category}
                  </p>
                  <DialogTitle className="text-4xl text-ink">
                    {selectedService.name}
                  </DialogTitle>
                  <DialogDescription className="pt-2 text-base leading-7">
                    {selectedService.description}
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-6 flex items-center justify-between border-y border-border py-4">
                  <span>{formatDuration(selectedService.duration)}</span>
                  <span className="font-medium text-rose">
                    {formatCurrency(Number(selectedService.price))}
                  </span>
                </div>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg" className="flex-1">
                    <Link
                      href={`/book?service=${encodeURIComponent(selectedService.id)}`}
                    >
                      Book this service
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="flex-1">
                    <a
                      href={whatsappBookService(selectedService.name)}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() =>
                        trackEvent("whatsapp_click", {
                          source: "services_dialog",
                          service: selectedService.name,
                        })
                      }
                    >
                      WhatsApp to book
                    </a>
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
