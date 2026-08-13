type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/**
 * Lightweight in-memory rate limit for abuse-prone API routes.
 * Best-effort on serverless (per instance); still blocks obvious bursts.
 */
export function checkRateLimit(input: {
  key: string;
  limit: number;
  windowMs: number;
}) {
  const now = Date.now();
  const existing = buckets.get(input.key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(input.key, { count: 1, resetAt: now + input.windowMs });
    return { ok: true as const, remaining: input.limit - 1 };
  }

  if (existing.count >= input.limit) {
    return {
      ok: false as const,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { ok: true as const, remaining: input.limit - existing.count };
}

/** Best-effort client IP from common proxy headers. */
export function getRequestIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
