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

const FALLBACK_IMAGE = "/services/volume.jpg";

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

      <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-6 lg:grid-cols-3 lg:gap-8">
        {filtered.map((service) => (
          <FadeIn key={service.id}>
          <article className="frame-lux group h-full">
            <div className="frame-lux-inner flex h-full flex-col overflow-hidden">
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
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
              />
            </button>
            <div className="flex flex-1 flex-col p-3 sm:p-6">
              <div className="flex items-start justify-between gap-2 sm:gap-4">
                <div className="min-w-0">
                  <p className="eyebrow text-[10px] sm:text-xs">
                    {service.category}
                  </p>
                  <h2 className="mt-1 font-editorial text-lg leading-tight text-ink sm:mt-2 sm:text-3xl">
                    {service.name}
                  </h2>
                </div>
                <p className="shrink-0 font-display text-sm font-semibold text-rose-deep sm:text-base">
                  {formatCurrency(Number(service.price))}
                </p>
              </div>
              <p className="mt-2 hidden text-sm leading-6 text-muted-foreground sm:mt-3 sm:line-clamp-2 sm:block">
                {service.description}
              </p>
              <p className="mt-2 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-[#c9a27e] sm:mt-4 sm:gap-2 sm:text-[11px] sm:tracking-[0.14em]">
                <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden />
                {formatDuration(service.duration)}
              </p>
              <div className="mt-auto flex flex-col gap-2 pt-3 sm:mt-6 sm:flex-row sm:gap-3 sm:pt-0">
                <Button asChild size="sm" className="w-full sm:flex-1 sm:text-sm">
                  <Link href={`/book?service=${encodeURIComponent(service.id)}`}>
                    Book now
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="hidden sm:flex sm:flex-1">
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
                  size="sm"
                  variant="outline"
                  className="w-full sm:w-auto"
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
