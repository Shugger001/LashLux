/** Build a per-request Content-Security-Policy value. */

export function buildContentSecurityPolicy(input: {
  nonce: string;
  isDev: boolean;
}) {
  const { nonce, isDev } = input;

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "object-src 'none'",
    // Nonce + strict-dynamic replace unsafe-inline / unsafe-eval in production.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""} https://va.vercel-scripts.com`,
    // Tailwind and a few inline styles still need unsafe-inline for style.
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https://images.unsplash.com https://*.supabase.co",
    "font-src 'self' data: https://fonts.gstatic.com",
    "media-src 'self' blob:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.paystack.co https://checkout.paystack.com https://va.vercel-scripts.com https://vitals.vercel-insights.com https://*.ingest.sentry.io",
    "frame-src 'self' https://checkout.paystack.com https://*.paystack.com https://accounts.google.com",
    "upgrade-insecure-requests",
  ]
    .join("; ")
    .replace(/\s{2,}/g, " ")
    .trim();
}
