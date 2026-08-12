import type { Metadata } from "next";
import Link from "next/link";

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
              <p className="eyebrow">Optional</p>
              <h1 className="mt-4 text-balance font-display text-4xl text-ink">
                Save your details
              </h1>
              <p className="mt-2 text-pretty text-sm text-muted-foreground">
                You can book eyelash fixing without creating an account. A
                profile is only for saving booking history.
              </p>
            </div>
            <SignupForm nextPath={nextPath} />
            <p className="mt-6 text-center text-sm text-muted-foreground">
              <Link href="/book" className="font-medium text-rose-deep hover:underline">
                Book without an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
