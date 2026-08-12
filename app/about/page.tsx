import type { Metadata } from "next";

import { AboutContent } from "@/components/about/about-content";

export const metadata: Metadata = {
  title: "About Lash Lux",
  description:
    "Lash Lux is a professional eyelash fixing studio in Old Ashongman — classic, hybrid, volume, and mega volume extensions with careful hygiene standards.",
};

export default function AboutPage() {
  return <AboutContent />;
}
