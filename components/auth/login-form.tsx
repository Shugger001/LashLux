"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";
import { type LoginInput, loginSchema } from "@/lib/validations";

/** Email/password and Google sign-in form backed by Supabase Auth. */
export function LoginForm({ nextPath = "/" }: { nextPath?: string }) {
  const router = useRouter();
  const [authError, setAuthError] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const isConfigured = isSupabaseConfigured();
  const safeNextPath =
    nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/";
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginInput) {
    if (!isConfigured) return;
    setAuthError("");
    const { error } = await createClient().auth.signInWithPassword(values);
    if (error) {
      setAuthError(error.message);
      return;
    }
    router.push(safeNextPath);
    router.refresh();
  }

  async function signInWithGoogle() {
    if (!isConfigured) return;
    setAuthError("");
    setIsGoogleLoading(true);
    const origin = window.location.origin;
    const callbackUrl = new URL("/auth/callback", origin);
    callbackUrl.searchParams.set("next", safeNextPath);
    const { error } = await createClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callbackUrl.toString() },
    });
    if (error) {
      setAuthError(error.message);
      setIsGoogleLoading(false);
    }
  }

  if (!isConfigured) {
    return (
      <div className="rounded-xl border border-border bg-secondary p-6 text-center">
        <h2 className="font-display text-2xl text-ink">Sign-in is not available yet.</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Online accounts are still being configured. You can continue to book
          an appointment without signing in.
        </p>
        <Button asChild className="mt-5">
          <Link href="/book">Book a session</Link>
        </Button>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "login-email-error" : undefined}
          {...register("email")}
        />
        {errors.email && <p id="login-email-error" className="text-sm text-destructive">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="login-password">Password</Label>
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "login-password-error" : undefined}
          {...register("password")}
        />
        {errors.password && <p id="login-password-error" className="text-sm text-destructive">{errors.password.message}</p>}
      </div>
      {authError && <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive" role="alert">{authError}</p>}
      <Button className="w-full" size="lg" disabled={isSubmitting || isGoogleLoading}>
        {isSubmitting && <Loader2 className="animate-spin" aria-hidden />}
        {isSubmitting ? "Signing in…" : "Sign in"}
      </Button>
      <div className="flex items-center gap-4" aria-hidden>
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs uppercase tracking-wider text-muted-foreground">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full"
        disabled={isSubmitting || isGoogleLoading}
        onClick={signInWithGoogle}
      >
        {isGoogleLoading && <Loader2 className="animate-spin" aria-hidden />}
        {isGoogleLoading ? "Connecting…" : "Continue with Google"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        New to Lash Lux?{" "}
        <Link
          className="font-medium text-primary hover:underline"
          href={`/auth/signup?next=${encodeURIComponent(safeNextPath)}`}
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}
