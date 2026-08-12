import type { Metadata } from "next";
import { Droplets, Eye, Moon, Sparkles } from "lucide-react";

import { ServicesCatalog } from "@/components/services/services-catalog";
import { LASH_CARE_TIPS } from "@/lib/constants";
import { getServices } from "@/lib/data";

export const metadata: Metadata = {
  title: "Lash Services",
  description:
    "Explore custom classic, hybrid, volume, lift, and tint services at Lash Lux lash studio.",
};

const careIcons = [Droplets, Sparkles, Eye, Moon];

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <section className="section-pad">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-rose">
              The service menu
            </p>
            <h1 className="mt-3 font-display text-5xl text-ink sm:text-6xl">
              A set made for your eyes.
            </h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              From understated definition to full, fluffy volume, every service
              begins with a consultation and is tailored to your natural lashes.
            </p>
          </div>
          <div className="mt-12">
            <ServicesCatalog services={services} />
          </div>
        </div>
      </section>

      <section className="section-pad border-t border-border bg-secondary/50">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-rose">
              Lash care
            </p>
            <h2 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
              Keep your set looking fresh.
            </h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {LASH_CARE_TIPS.map((tip, index) => {
              const Icon = careIcons[index];
              return (
                <article
                  key={tip.title}
                  className="rounded-xl border border-border bg-card p-6"
                >
                  <Icon className="h-6 w-6 text-rose" aria-hidden />
                  <h3 className="mt-5 font-display text-2xl text-ink">
                    {tip.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {tip.body}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
