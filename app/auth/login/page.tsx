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
              <p className="eyebrow">Welcome back</p>
              <h1 className="mt-4 text-balance font-display text-4xl text-ink">
                Sign in
              </h1>
              <p className="mt-2 text-pretty text-sm text-muted-foreground">
                Access your appointments and profile.
              </p>
            </div>
            <LoginForm nextPath={nextPath} />
          </div>
        </div>
      </div>
    </section>
  );
}
