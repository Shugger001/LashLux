"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";
import { type SignupInput, signupSchema } from "@/lib/validations";

/** Supabase account creation form with email confirmation feedback. */
export function SignupForm() {
  const [authError, setAuthError] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const isConfigured = isSupabaseConfigured();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: "", email: "", phone: "", password: "" },
  });

  async function onSubmit(values: SignupInput) {
    if (!isConfigured) return;
    setAuthError("");
    const { error } = await createClient().auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { full_name: values.fullName, phone: values.phone ?? "" },
      },
    });
    if (error) {
      setAuthError(error.message);
      return;
    }
    setIsComplete(true);
  }

  if (!isConfigured) {
    return (
      <div className="rounded-xl border border-border bg-secondary p-6 text-center">
        <h2 className="font-display text-2xl text-ink">Accounts are coming soon.</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          You do not need an account to request an appointment.
        </p>
        <Button asChild className="mt-5"><Link href="/book">Book a session</Link></Button>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="text-center" role="status">
        <CheckCircle2 className="mx-auto h-10 w-10 text-primary" aria-hidden />
        <h2 className="mt-4 font-display text-3xl text-ink">Check your email.</h2>
        <p className="mt-2 text-muted-foreground">
          Follow the confirmation link to finish creating your account.
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <AuthField id="signup-name" label="Full name" error={errors.fullName?.message}>
        <Input id="signup-name" autoComplete="name" aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? "signup-name-error" : undefined} {...register("fullName")} />
      </AuthField>
      <AuthField id="signup-email" label="Email" error={errors.email?.message}>
        <Input id="signup-email" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "signup-email-error" : undefined} {...register("email")} />
      </AuthField>
      <AuthField id="signup-phone" label="Phone (optional)" error={errors.phone?.message}>
        <Input id="signup-phone" type="tel" autoComplete="tel" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "signup-phone-error" : undefined} {...register("phone")} />
      </AuthField>
      <AuthField id="signup-password" label="Password" error={errors.password?.message}>
        <Input id="signup-password" type="password" autoComplete="new-password" aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "signup-password-error" : undefined} {...register("password")} />
      </AuthField>
      {authError && <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive" role="alert">{authError}</p>}
      <Button className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="animate-spin" aria-hidden />}
        {isSubmitting ? "Creating account…" : "Create your account"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link className="font-medium text-primary hover:underline" href="/auth/login">Sign in</Link>
      </p>
    </form>
  );
}

function AuthField({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p id={`${id}-error`} className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
