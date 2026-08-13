import Link from "next/link";

import { SITE } from "@/lib/constants";

/** Instagram / Snapchat follow CTA used at the top of the site footer. */
export function InstagramStrip() {
  return (
    <div className="border-b border-[#c9a27e]/20 bg-gradient-to-b from-blush/55 to-blush/25">
      <div className="container-page py-8 text-center sm:py-14">
        <p className="eyebrow">Follow the studio</p>
        <h2 className="mt-3 font-editorial text-3xl text-ink sm:mt-5 sm:text-5xl">
          {SITE.instagramHandle}
        </h2>
        <div className="mx-auto mt-3 h-px w-14 bg-gradient-to-r from-transparent via-[#c9a27e] to-transparent sm:mt-5 sm:w-16" />
        <p className="mx-auto mt-3 max-w-lg text-pretty text-sm text-muted-foreground sm:mt-5 sm:text-base">
          Fresh sets, fills, and behind-the-chair moments. Tag us after your visit.
        </p>
        <div className="mt-5 flex flex-col items-center justify-center gap-2.5 sm:mt-8 sm:flex-row sm:gap-3">
          <Link
            href={SITE.instagram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 w-full max-w-xs items-center justify-center rounded-full bg-ink px-8 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-ring sm:h-12 sm:w-auto"
          >
            Open Instagram
          </Link>
          <Link
            href={SITE.snapchatUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 w-full max-w-xs items-center justify-center rounded-full border border-[#c9a27e]/40 bg-white/70 px-8 text-sm font-medium text-ink transition-colors hover:bg-white focus-ring sm:h-12 sm:w-auto"
          >
            Snapchat · {SITE.snapchat}
          </Link>
        </div>
      </div>
    </div>
  );
}
