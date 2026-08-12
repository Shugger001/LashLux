"use client";

import { usePathname } from "next/navigation";

import { SITE } from "@/lib/constants";

/** Fixed WhatsApp chat button for quick booking messages. */
export function WhatsAppFloat() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) {
    return null;
  }

  const href = `${SITE.whatsapp}?text=${encodeURIComponent(
    "Hi Lash Lux! I’d like to book eyelash fixing."
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-4 z-[70] inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_14px_32px_-10px_rgba(37,211,102,0.75)] transition-transform duration-300 ease-out hover:scale-105 focus-ring sm:bottom-6 sm:right-6"
    >
      <svg
        viewBox="0 0 32 32"
        className="h-7 w-7"
        fill="currentColor"
        aria-hidden
      >
        <path d="M19.11 17.53c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.17-1.34-.8-.71-1.34-1.59-1.5-1.86-.16-.27-.02-.41.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.46h-.52c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29s.98 2.66 1.12 2.84c.14.18 1.93 2.95 4.68 4.14.65.28 1.16.45 1.56.57.65.21 1.25.18 1.72.11.52-.08 1.6-.65 1.83-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.32z" />
        <path d="M16.02 3C9.39 3 4 8.38 4 15c0 2.2.6 4.25 1.64 6.02L4 29l8.18-2.14A11.94 11.94 0 0 0 16.02 27C22.65 27 28 21.62 28 15S22.65 3 16.02 3zm0 21.82c-2.02 0-3.9-.55-5.52-1.5l-.4-.24-4.85 1.27 1.3-4.73-.26-.42A9.8 9.8 0 0 1 6.2 15c0-5.42 4.41-9.82 9.82-9.82S25.84 9.58 25.84 15s-4.41 9.82-9.82 9.82z" />
      </svg>
      <span className="sr-only">WhatsApp {SITE.phoneDisplay}</span>
    </a>
  );
}
