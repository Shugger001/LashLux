import type { Metadata } from "next";

import { AboutContent } from "@/components/about/about-content";

export const metadata: Metadata = {
  title: "About the Studio",
  description:
    "Our story and learn about the careful technique, hygiene standards, and premium products behind every custom lash set.",
};

export default function AboutPage() {
  return <AboutContent />;
}
