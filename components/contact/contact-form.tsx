"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import {
  type ContactInput,
  contactSchema,
} from "@/lib/validations";

const TOPICS = [
  {
    id: "full-set",
    label: "Full set",
    message:
      "Hi Lash Lux! I'd like to ask about booking a full set. Preferred look: ",
  },
  {
    id: "fill",
    label: "Fill",
    message:
      "Hi Lash Lux! I'd like to book a fill. My last full set was about ",
  },
  {
    id: "removal",
    label: "Removal",
    message:
      "Hi Lash Lux! I'd like to ask about lash removal. Preferred day/time: ",
  },
  {
    id: "aftercare",
    label: "Aftercare",
    message:
      "Hi Lash Lux! I have a question about aftercare for my current set: ",
  },
] as const;

/** Validated contact form with complete pending, error, and success states. */
export function ContactForm() {
  const [serverError, setServerError] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  const messageValue = watch("message");

  function applyTopic(topic: (typeof TOPICS)[number]) {
    setActiveTopic(topic.id);
    setValue("message", topic.message, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  async function onSubmit(values: ContactInput) {
    setServerError("");
    trackEvent("contact_submit");
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const result = await response.json();
    if (!response.ok) {
      trackEvent("contact_fail");
      setServerError(
        result.error ?? "Your message could not be sent. Please try again."
      );
      return;
    }
    reset();
    setActiveTopic(null);
    setIsSent(true);
    trackEvent("contact_success");
  }

  if (isSent) {
    return (
      <div className="frame-lux" role="status">
        <div className="frame-lux-inner p-8 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-primary" aria-hidden />
          <h2 className="mt-4 font-display text-3xl text-ink">Message received.</h2>
          <p className="mt-2 text-muted-foreground">
            Thank you for reaching out. We will reply within one business day.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link href="/book">Book fixing</Link>
            </Button>
            <Button variant="outline" onClick={() => setIsSent(false)}>
              Send another message
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      className="frame-lux"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="frame-lux-inner space-y-5 p-6 sm:p-8">
        <div>
          <p className="text-sm font-medium text-ink">What is this about?</p>
          <div
            className="mt-3 flex flex-wrap gap-2"
            role="group"
            aria-label="Message topic"
          >
            {TOPICS.map((topic) => (
              <Button
                key={topic.id}
                type="button"
                size="sm"
                variant={activeTopic === topic.id ? "primary" : "outline"}
                aria-pressed={activeTopic === topic.id}
                onClick={() => applyTopic(topic)}
              >
                {topic.label}
              </Button>
            ))}
          </div>
        </div>

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
            aria-describedby={
              errors.message ? "contact-message-error" : "contact-message-count"
            }
            className={cn(messageValue?.length > 1800 && "border-amber-400")}
            {...register("message")}
          />
          <p
            id="contact-message-count"
            className="text-right text-xs text-muted-foreground"
          >
            {messageValue?.length ?? 0}/2000
          </p>
          {errors.message && (
            <p id="contact-message-error" className="text-sm text-destructive">
              {errors.message.message}
            </p>
          )}
        </div>
        {serverError && (
          <p
            className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
            role="alert"
          >
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
      </div>
    </form>
  );
}
