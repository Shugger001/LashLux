import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Sign In",
  description: "Sign in to your Lash Lux account to view and manage appointments.",
  path: "/auth/login",
  noIndex: true,
});

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { next?: string };
}) {
  const requestedNext = searchParams?.next;
  const nextPath =
    requestedNext?.startsWith("/") && !requestedNext.startsWith("//")
      ? requestedNext
      : "/";
  const isAdminLogin = nextPath === "/admin" || nextPath.startsWith("/admin/");

  return (
    <section className="section-pad">
      <div className="container-page">
        <div className="frame-lux mx-auto max-w-md">
          <div className="frame-lux-inner p-6 sm:p-8">
            <div className="mb-8 text-center">
              <p className="eyebrow">{isAdminLogin ? "Studio access" : "Account"}</p>
              <h1 className="mt-4 text-balance font-display text-4xl text-ink">
                {isAdminLogin ? "Admin login" : "Sign in"}
              </h1>
              <p className="mt-3 text-pretty text-sm leading-6 text-ink/75">
                {isAdminLogin
                  ? "Sign in with your studio email and password to manage bookings, services, and settings."
                  : "Sign in to view your booking requests. You can still book as a guest without an account."}
              </p>
            </div>
            <LoginForm nextPath={nextPath} />
            {!isAdminLogin ? (
              <p className="mt-6 text-center text-sm text-ink/70">
                Prefer WhatsApp?{" "}
                <a
                  href="https://wa.me/233547986899?text=Hi%20Lash%20Lux!%20I%E2%80%99d%20like%20to%20book%20eyelash%20fixing."
                  className="font-medium text-rose-deep hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Message us to book
                </a>
              </p>
            ) : (
              <p className="mt-6 text-center text-sm text-ink/70">
                Need help accessing the dashboard? Contact the studio owner.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
