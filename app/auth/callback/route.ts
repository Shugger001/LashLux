import { NextResponse } from "next/server";

import {
  createClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

/** Exchange a Supabase OAuth/email code for a cookie-backed session. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next");
  const safeNext = next?.startsWith("/") && !next.startsWith("//")
    ? next
    : "/";

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(new URL("/auth/login?error=not-configured", url.origin));
  }

  if (code) {
    const { error } = await createClient().auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(safeNext, url.origin));
  }

  return NextResponse.redirect(new URL("/auth/login?error=callback", url.origin));
}
