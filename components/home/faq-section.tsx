import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { FAQ_ITEMS } from "@/lib/constants";

const HOME_FAQ = FAQ_ITEMS.slice(0, 6);

/** Compact FAQ for the homepage — answers booking objections before the final CTA. */
export function FaqSection() {
  return (
    <section className="section-pad border-t border-[#c9a27e]/20 bg-card/60">
      <div className="container-page mx-auto max-w-3xl">
        <FadeIn className="text-center">
          <span className="eyebrow">Questions</span>
          <h2 className="mt-3 font-editorial text-3xl text-ink sm:mt-4 sm:text-5xl">
            Before you book
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
            Quick answers about eyelash fixing, fills, and how appointments work.
          </p>
        </FadeIn>

        <Accordion type="single" collapsible className="mt-7 sm:mt-10">
          {HOME_FAQ.map((item, index) => (
            <AccordionItem key={item.q} value={`home-faq-${index}`}>
              <AccordionTrigger className="text-left text-base">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-base leading-7">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-8 flex flex-col items-center gap-3 sm:mt-10 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/book">Book fixing</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/about">More about the studio</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
