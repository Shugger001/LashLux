import type { Metadata } from "next";

import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Create an Account",
  description: "Create a Lash Lux account to keep track of your lash appointments.",
};

export default function SignupPage({
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
              <p className="eyebrow">Your Lash Lux profile</p>
              <h1 className="mt-4 text-balance font-display text-4xl text-ink">
                Create an account
              </h1>
              <p className="mt-2 text-pretty text-sm text-muted-foreground">
                Keep your booking details in one place.
              </p>
            </div>
            <SignupForm nextPath={nextPath} />
          </div>
        </div>
      </div>
    </section>
  );
}
