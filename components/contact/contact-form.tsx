"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  type ContactInput,
  contactSchema,
} from "@/lib/validations";

/** Validated contact form with complete pending, error, and success states. */
export function ContactForm() {
  const [serverError, setServerError] = useState("");
  const [isSent, setIsSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  async function onSubmit(values: ContactInput) {
    setServerError("");
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const result = await response.json();
    if (!response.ok) {
      setServerError(result.error ?? "Your message could not be sent. Please try again.");
      return;
    }
    reset();
    setIsSent(true);
  }

  if (isSent) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center" role="status">
        <CheckCircle2 className="mx-auto h-10 w-10 text-primary" aria-hidden />
        <h2 className="mt-4 font-display text-3xl text-ink">Message received.</h2>
        <p className="mt-2 text-muted-foreground">
          Thank you for reaching out. We will reply within one business day.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => setIsSent(false)}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-soft sm:p-8"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor="contact-name">Name</Label>
        <Input
          id="contact-name"
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          {...register("name")}
        />
        {errors.name && (
          <p id="contact-name-error" className="text-sm text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-email">Email</Label>
        <Input
          id="contact-email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          {...register("email")}
        />
        {errors.email && (
          <p id="contact-email-error" className="text-sm text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-message">How can we help?</Label>
        <Textarea
          id="contact-message"
          maxLength={2000}
          placeholder="Tell us about your question, preferred service, or event date."
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          {...register("message")}
        />
        {errors.message && (
          <p id="contact-message-error" className="text-sm text-destructive">
            {errors.message.message}
          </p>
        )}
      </div>
      {serverError && (
        <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive" role="alert">
          {serverError}
        </p>
      )}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
      >
        {isSubmitting && <Loader2 className="animate-spin" aria-hidden />}
        {isSubmitting ? "Sending…" : "Send your message"}
      </Button>
    </form>
  );
}
