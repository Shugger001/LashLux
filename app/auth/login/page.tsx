import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Lash Lux account to view and manage appointments.",
};

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

  return (
    <section className="section-pad">
      <div className="container-page">
        <div className="frame-lux mx-auto max-w-md">
          <div className="frame-lux-inner p-6 sm:p-8">
            <div className="mb-8 text-center">
              <p className="eyebrow">Optional</p>
              <h1 className="mt-4 text-balance font-display text-4xl text-ink">
                Client login
              </h1>
              <p className="mt-2 text-pretty text-sm text-muted-foreground">
                No account needed to book. Sign in only if you already have a
                profile to view past requests.
              </p>
            </div>
            <LoginForm nextPath={nextPath} />
            <p className="mt-6 text-center text-sm text-muted-foreground">
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
          </div>
        </div>
      </div>
    </section>
  );
}
