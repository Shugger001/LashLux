import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { buildContentSecurityPolicy } from "@/lib/csp";

/** Refresh auth session, enforce admin routes, and attach a nonce-based CSP. */
export async function updateSession(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = buildContentSecurityPolicy({
    nonce,
    isDev: process.env.NODE_ENV === "development",
  });

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const applyCsp = (response: NextResponse) => {
    response.headers.set("Content-Security-Policy", csp);
    return response;
  };

  let supabaseResponse = NextResponse.next({
    request: { headers: requestHeaders },
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return applyCsp(supabaseResponse);
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request: { headers: requestHeaders },
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute =
    pathname.startsWith("/auth/login") || pathname.startsWith("/auth/signup");

  if (isAdminRoute) {
    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/auth/login";
      redirectUrl.searchParams.set("next", pathname);
      return applyCsp(NextResponse.redirect(redirectUrl));
    }

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role !== "admin") {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/";
      return applyCsp(NextResponse.redirect(redirectUrl));
    }
  }

  if (isAuthRoute && user) {
    const redirectUrl = request.nextUrl.clone();
    const next = request.nextUrl.searchParams.get("next");
    redirectUrl.search = "";
    if (next?.startsWith("/") && !next.startsWith("//")) {
      redirectUrl.pathname = next;
    } else {
      redirectUrl.pathname = "/";
    }
    return applyCsp(NextResponse.redirect(redirectUrl));
  }

  return applyCsp(supabaseResponse);
}
