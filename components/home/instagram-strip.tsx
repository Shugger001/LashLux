import Link from "next/link";

import { SITE } from "@/lib/constants";

/** Instagram / Snapchat follow CTA used at the top of the site footer. */
export function InstagramStrip() {
  return (
    <div className="border-b border-[#c9a27e]/20 bg-gradient-to-b from-blush/55 to-blush/25">
      <div className="container-page py-12 text-center sm:py-14">
        <p className="eyebrow">Follow the studio</p>
        <h2 className="mt-5 font-editorial text-4xl text-ink sm:text-5xl">
          {SITE.instagramHandle}
        </h2>
        <div className="mx-auto mt-5 h-px w-16 bg-gradient-to-r from-transparent via-[#c9a27e] to-transparent" />
        <p className="mx-auto mt-5 max-w-lg text-pretty text-muted-foreground">
          Fresh sets, fills, and behind-the-chair moments. Tag us after your visit.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={SITE.instagram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-8 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-ring"
          >
            Open Instagram
          </Link>
          <Link
            href={SITE.snapchatUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center justify-center rounded-full border border-[#c9a27e]/40 bg-white/70 px-8 text-sm font-medium text-ink transition-colors hover:bg-white focus-ring"
          >
            Snapchat · {SITE.snapchat}
          </Link>
        </div>
      </div>
    </div>
  );
}
