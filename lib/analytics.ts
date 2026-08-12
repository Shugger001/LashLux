/** Client funnel tracking + optional Sentry capture. No PII in props. */

const ALLOWED_EVENTS = new Set([
  "page_view",
  "cta_click",
  "book_start",
  "book_step",
  "book_submit",
  "book_success",
  "book_fail",
  "contact_submit",
  "contact_success",
  "contact_fail",
  "whatsapp_click",
  "pay_start",
  "pay_success",
  "pay_fail",
]);

export type AnalyticsProps = Record<string, string | number | boolean | undefined>;

/** Fire a privacy-safe funnel event (best-effort). */
export function trackEvent(eventName: string, props: AnalyticsProps = {}) {
  if (typeof window === "undefined") return;
  if (!ALLOWED_EVENTS.has(eventName)) return;

  const path = window.location.pathname;
  const safeProps: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined) continue;
    if (/email|phone|name|message|notes/i.test(key)) continue;
    safeProps[key] = value;
  }

  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventName, path, props: safeProps }),
    keepalive: true,
  }).catch(() => undefined);
}

/** Report an error to Sentry when configured; always logs locally. */
export function captureException(
  error: unknown,
  context?: Record<string, string>
) {
  const message = error instanceof Error ? error.message : String(error);
  console.error("[error]", message, context);

  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn || typeof window === "undefined") return;

  try {
    const match = dsn.match(
      /^https:\/\/([^@]+)@([^/]+)\/(\d+)/
    );
    if (!match) return;
    const [, key, host, projectId] = match;
    const payload = {
      message,
      level: "error",
      tags: context,
      timestamp: Date.now() / 1000,
      platform: "javascript",
    };
    void fetch(`https://${host}/api/${projectId}/store/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Sentry-Auth": `Sentry sentry_version=7, sentry_key=${key}`,
      },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    // never block UX on telemetry
  }
}
