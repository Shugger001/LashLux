import type { Metadata } from "next";

import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Create an Account",
  description: "Create a Lash Lux account to keep track of your lash appointments.",
};

export default function SignupPage() {
  return (
    <section className="section-pad">
      <div className="container-page">
        <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-6 shadow-soft sm:p-8">
          <div className="mb-8 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-rose">
              Your Lash Lux profile
            </p>
            <h1 className="mt-3 font-display text-4xl text-ink">
              Create an account
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Keep your booking details in one place.
            </p>
          </div>
          <SignupForm />
        </div>
      </div>
    </section>
  );
}
