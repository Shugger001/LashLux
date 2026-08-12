import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Heart, ShieldCheck, Sparkles } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { FAQ_ITEMS } from "@/lib/constants";

const hygieneStandards = [
  "Single-use disposables for every client",
  "Tools disinfected between every appointment",
  "Medical-grade adhesive and fresh lash palettes",
  "Clean, prepared work surface before you arrive",
];

/** Studio story, standards, products, and frequently asked questions. */
export function AboutContent() {
  return (
    <>
      <section className="section-pad">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Professional eyelash fixing</p>
            <h1 className="mt-5 text-balance font-display text-5xl text-ink sm:text-6xl">
              Expert lash sets, gently applied.
            </h1>
            <p className="mt-6 text-pretty text-lg leading-8 text-muted-foreground">
              Lash Lux specializes in eyelash fixing — classic, hybrid, volume, and
              mega volume extensions tailored to your eye shape and lifestyle.
            </p>
            <p className="mt-4 leading-7 text-muted-foreground">
              Every appointment starts with a consultation for comfort, retention,
              and a look that still feels like you. Full sets, fills, and safe
              removals available at Manna Apartment, Old Ashongman.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/book">Book eyelash fixing</Link>
            </Button>
          </div>
          <div className="frame-lux">
          <div className="frame-lux-inner relative aspect-[4/5] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1000&q=85"
              alt="A calm, professional beauty studio"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
          </div>
        </div>
      </section>

      <section className="section-pad border-y border-border bg-secondary/50">
        <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <ShieldCheck className="h-8 w-8 text-rose" aria-hidden />
            <p className="eyebrow mt-5">Studio standards</p>
            <h2 className="mt-4 text-balance font-display text-4xl text-ink sm:text-5xl">
              Your comfort comes first.
            </h2>
            <p className="mt-4 text-muted-foreground">
              A clean, careful environment protects your eyes, natural lashes,
              and peace of mind.
            </p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {hygieneStandards.map((standard) => (
              <li
                key={standard}
                className="frame-lux"
              >
                <div className="frame-lux-inner flex h-full w-full gap-3 p-5">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-rose" aria-hidden />
                <span>{standard}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page text-center">
          <p className="eyebrow">Products we trust</p>
          <h2 className="mt-5 text-balance font-display text-4xl text-ink sm:text-5xl">
            Premium from prep to finish.
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              [Sparkles, "London Lash Pro", "Professional lashes and adhesive"],
              [Heart, "Borboleta Beauty", "Lightweight, soft-touch fibers"],
              [ShieldCheck, "Elleebana", "Trusted lift and tint systems"],
            ].map(([Icon, name, detail]) => {
              const BrandIcon = Icon as typeof Sparkles;
              return (
                <article key={name as string} className="frame-lux">
                  <div className="frame-lux-inner h-full p-6">
                  <BrandIcon className="mx-auto h-6 w-6 text-rose" aria-hidden />
                  <h3 className="mt-4 font-display text-2xl text-ink">{name as string}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{detail as string}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-pad border-t border-border bg-card">
        <div className="container-page mx-auto max-w-3xl">
          <p className="eyebrow">Questions, answered</p>
          <h2 className="mt-5 text-balance text-center font-display text-4xl text-ink sm:text-5xl">
            Before your appointment.
          </h2>
          <Accordion type="single" collapsible className="mt-10">
            {FAQ_ITEMS.map((item, index) => (
              <AccordionItem key={item.q} value={`faq-${index}`}>
                <AccordionTrigger className="text-base">{item.q}</AccordionTrigger>
                <AccordionContent className="text-base leading-7">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  );
}
