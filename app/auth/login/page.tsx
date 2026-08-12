import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Lash Lux account to view and manage appointments.",
};

export default function LoginPage() {
  return (
    <section className="section-pad">
      <div className="container-page">
        <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-6 shadow-soft sm:p-8">
          <div className="mb-8 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-rose">
              Welcome back
            </p>
            <h1 className="mt-3 font-display text-4xl text-ink">Sign in</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Access your appointments and profile.
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </section>
  );
}
