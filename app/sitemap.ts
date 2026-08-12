import type { MetadataRoute } from "next";

import { SITE } from "@/lib/constants";

/** Public sitemap for marketing and booking pages. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  const now = new Date();
  const routes = [
    "",
    "/services",
    "/gallery",
    "/about",
    "/contact",
    "/book",
  ];

  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" || path === "/book" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/book" || path === "/services" ? 0.9 : 0.7,
  }));
}
