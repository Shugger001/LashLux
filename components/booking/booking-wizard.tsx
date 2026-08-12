"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronLeft, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trackEvent, captureException } from "@/lib/analytics";
import { isBookableDate } from "@/lib/schedule";
import {
  type BookingDetailsInput,
  bookingDetailsSchema,
} from "@/lib/validations";
import { cn, formatCurrency, formatDuration, formatTime } from "@/lib/utils";
import { whatsappBookingFollowUp } from "@/lib/whatsapp";
import type { Service } from "@/types";

const STEP_LABELS = ["Service", "Date", "Time", "Details", "Notes", "Confirmed"];
const DEPOSIT_ENABLED =
  process.env.NEXT_PUBLIC_DEPOSIT_ENABLED === "true" &&
  Boolean(process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY);
const DEPOSIT_AMOUNT = Number(process.env.NEXT_PUBLIC_DEPOSIT_AMOUNT_GHS ?? "50");

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Six-step booking flow that submits a validated appointment request. */
export function BookingWizard({ services }: { services: Service[] }) {
  const searchParams = useSearchParams();
  const requestedServiceId = searchParams.get("service");
  const payStatus = searchParams.get("pay");
  const preselected = services.some((item) => item.id === requestedServiceId)
    ? requestedServiceId
    : "";
  const [step, setStep] = useState(() => {
    if (payStatus === "success") return 6;
    if (preselected) return 2;
    return 1;
  });
  const [serviceId, setServiceId] = useState(preselected ?? "");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [dayUnavailableReason, setDayUnavailableReason] = useState<
    "full" | "closed" | "empty" | null
  >(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState(searchParams.get("id") ?? "");
  const [emailSent, setEmailSent] = useState(false);
  const [paidConfirmed, setPaidConfirmed] = useState(payStatus === "success");
  const selectedService = services.find((item) => item.id === serviceId);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<BookingDetailsInput>({
    resolver: zodResolver(bookingDetailsSchema),
    defaultValues: { fullName: "", email: "", phone: "", notes: "" },
  });

  useEffect(() => {
    trackEvent("book_start");
    if (payStatus === "success") {
      setStep(6);
      setPaidConfirmed(true);
      trackEvent("pay_success");
      toast.success("Deposit received. Your appointment is confirmed.");
    } else if (payStatus === "failed") {
      trackEvent("pay_fail");
      toast.error("Payment did not complete. You can request again or WhatsApp us.");
    }
  }, [payStatus]);

  useEffect(() => {
    if (step !== 3 || !date || !serviceId) return;
    const controller = new AbortController();
    setIsLoadingSlots(true);
    setTime("");
    setDayUnavailableReason(null);
    fetch(
      `/api/availability?date=${encodeURIComponent(toDateKey(date))}&serviceId=${encodeURIComponent(serviceId)}`,
      { signal: controller.signal }
    )
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Unable to load times");
        const nextSlots = Array.isArray(result.slots) ? result.slots : [];
        setSlots(nextSlots);
        if (nextSlots.length) {
          setDayUnavailableReason(null);
        } else if (result.full) {
          setDayUnavailableReason("full");
        } else if (result.closed) {
          setDayUnavailableReason("closed");
        } else {
          setDayUnavailableReason("empty");
        }
      })
      .catch((error: Error) => {
        if (error.name !== "AbortError") {
          setSlots([]);
          setDayUnavailableReason("empty");
          toast.error(error.message);
        }
      })
      .finally(() => setIsLoadingSlots(false));
    return () => controller.abort();
  }, [date, serviceId, step]);

  const progress = useMemo(() => `${Math.round((step / 6) * 100)}%`, [step]);

  function continueFromDetails() {
    trackEvent("book_step", { step: 4 });
    setStep(5);
  }

  async function submitBooking() {
    if (!selectedService || !date || !time) return;
    setIsSubmitting(true);
    trackEvent("book_submit");
    try {
      const details = getValues();
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          date: toDateKey(date),
          time,
          fullName: details.fullName,
          email: details.email,
          phone: details.phone,
          notes: notes.trim() || undefined,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Booking could not be sent");

      if (result.authorizationUrl) {
        trackEvent("pay_start", { amount: result.depositAmount ?? DEPOSIT_AMOUNT });
        window.location.href = result.authorizationUrl as string;
        return;
      }

      setBookingId(result.id ?? "");
      setEmailSent(result.emailSent === true);
      trackEvent("book_success");
      setStep(6);
    } catch (error) {
      trackEvent("book_fail");
      captureException(error, { route: "book" });
      toast.error(
        error instanceof Error ? error.message : "Booking could not be sent"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const confirmationDate = date?.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const whatsappHref = whatsappBookingFollowUp({
    serviceName: selectedService?.name ?? "eyelash fixing",
    date: confirmationDate ?? "",
    time: time ? formatTime(time) : "",
    reference: bookingId || undefined,
  });

  return (
    <div className="frame-lux mx-auto max-w-3xl">
      <div className="frame-lux-inner overflow-hidden">
      <div className="border-b border-[#c9a27e]/20 bg-gradient-to-r from-blush/40 via-white to-transparent p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium tracking-wide text-rose-deep">
            Step {step} of 6 · {STEP_LABELS[step - 1]}
          </p>
          {selectedService && step < 6 && (
            <p className="text-sm text-muted-foreground">
              {formatDuration(selectedService.duration)}
            </p>
          )}
        </div>
        <div
          className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#c9a27e]/15"
          role="progressbar"
          aria-label="Booking progress"
          aria-valuemin={1}
          aria-valuemax={6}
          aria-valuenow={step}
        >
          <div
            className="h-full rounded-full bg-rose-gold transition-[width] duration-500 transition-lux"
            style={{ width: progress }}
          />
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {step === 1 && (
          <section aria-labelledby="service-step-title">
            <h2 id="service-step-title" className="font-editorial text-3xl text-ink sm:text-4xl">
              Choose your service
            </h2>
            <p className="mt-2 text-muted-foreground">
              Select the look you would like to book.
            </p>
            {!services.length ? (
              <p className="mt-6 rounded-xl bg-secondary p-6 text-center text-muted-foreground">
                Services are temporarily unavailable. Please WhatsApp us to book,
                or try again shortly.
              </p>
            ) : null}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {services.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  className={cn(
                    "rounded-2xl border p-5 text-left transition-all duration-300 transition-lux focus-ring",
                    serviceId === service.id
                      ? "border-[#c9a27e] bg-blush/40 shadow-soft"
                      : "border-[#c9a27e]/25 hover:border-[#c9a27e]/60 hover:bg-white/70"
                  )}
                  aria-pressed={serviceId === service.id}
                  onClick={() => setServiceId(service.id)}
                >
                  <span className="font-display text-xl text-ink sm:text-2xl">
                    {service.name}
                  </span>
                  <span className="mt-2 flex justify-between gap-3 text-sm text-muted-foreground">
                    <span>{formatDuration(service.duration)}</span>
                    <span className="font-medium text-rose-deep">
                      {formatCurrency(Number(service.price))}
                    </span>
                  </span>
                </button>
              ))}
            </div>
            <Button
              className="mt-8 w-full"
              size="lg"
              disabled={!serviceId}
              onClick={() => setStep(2)}
            >
              Choose a date
            </Button>
          </section>
        )}

        {step === 2 && (
          <section aria-labelledby="date-step-title">
            <h2 id="date-step-title" className="font-display text-3xl text-ink">
              Choose a date
            </h2>
            <p className="mt-2 text-muted-foreground">
              Monday-Saturday are open for online booking. Sundays are by
              appointment and are not bookable online.
            </p>
            <div className="mt-6 flex justify-center rounded-xl border border-border p-4">
              <DayPicker
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(day) => !isBookableDate(day)}
                className="mx-auto"
              />
            </div>
            <WizardActions
              onBack={() => setStep(1)}
              onNext={() => {
                setSlots([]);
                setTime("");
                setIsLoadingSlots(true);
                setStep(3);
              }}
              nextLabel="Choose a time"
              nextDisabled={!date}
            />
          </section>
        )}

        {step === 3 && (
          <section aria-labelledby="time-step-title">
            <h2 id="time-step-title" className="font-display text-3xl text-ink">
              Choose a time
            </h2>
            <p className="mt-2 text-muted-foreground">
              Available start times for {date?.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
              .
            </p>
            {isLoadingSlots ? (
              <div className="flex min-h-40 items-center justify-center" role="status">
                <Loader2 className="h-6 w-6 animate-spin text-rose" aria-hidden />
                <span className="sr-only">Loading available times</span>
              </div>
            ) : slots.length ? (
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {slots.map((slot) => (
                  <Button
                    key={slot}
                    type="button"
                    variant={time === slot ? "primary" : "outline"}
                    aria-pressed={time === slot}
                    onClick={() => setTime(slot)}
                  >
                    {formatTime(slot)}
                  </Button>
                ))}
              </div>
            ) : (
              <p className="mt-6 rounded-xl bg-secondary p-6 text-center text-muted-foreground">
                {dayUnavailableReason === "full"
                  ? "This day is fully booked (5 appointments). Please choose another day."
                  : dayUnavailableReason === "closed"
                    ? "The studio is closed on this date. Please choose another day."
                    : "No times remain for this date. Please choose another day."}
              </p>
            )}
            <WizardActions
              onBack={() => setStep(2)}
              onNext={() => setStep(4)}
              nextLabel="Add your details"
              nextDisabled={!time}
            />
          </section>
        )}

        {step === 4 && (
          <section aria-labelledby="details-step-title">
            <h2 id="details-step-title" className="font-display text-3xl text-ink">
              Your details
            </h2>
            <p className="mt-2 text-muted-foreground">
              We will use these details to confirm your appointment.
            </p>
            <form className="mt-6 space-y-5" onSubmit={handleSubmit(continueFromDetails)}>
              <FormField
                id="fullName"
                label="Full name"
                error={errors.fullName?.message}
              >
                <Input
                  id="fullName"
                  autoComplete="name"
                  aria-invalid={Boolean(errors.fullName)}
                  aria-describedby={errors.fullName ? "fullName-error" : undefined}
                  {...register("fullName")}
                />
              </FormField>
              <FormField id="email" label="Email" error={errors.email?.message}>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  {...register("email")}
                />
              </FormField>
              <FormField id="phone" label="Phone" error={errors.phone?.message}>
                <Input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  {...register("phone")}
                />
              </FormField>
              <div className="flex gap-3 pt-3">
                <Button type="button" variant="outline" onClick={() => setStep(3)}>
                  <ChevronLeft aria-hidden /> Back
                </Button>
                <Button type="submit" className="flex-1">
                  Add notes
                </Button>
              </div>
            </form>
          </section>
        )}

        {step === 5 && selectedService && date && (
          <section aria-labelledby="notes-step-title">
            <h2 id="notes-step-title" className="font-display text-3xl text-ink">
              Notes and review
            </h2>
            <div className="mt-6 rounded-xl bg-secondary p-5 text-sm">
              <p className="font-medium text-ink">{selectedService.name}</p>
              <p className="mt-2 text-muted-foreground">
                {date.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                at {formatTime(time)}
              </p>
            </div>
            <div className="mt-6 space-y-2">
              <Label htmlFor="notes">Anything we should know? (optional)</Label>
              <Textarea
                id="notes"
                maxLength={500}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Sensitivities, desired style, or questions for your artist"
              />
              <p className="text-right text-xs text-muted-foreground">
                {notes.length}/500
              </p>
            </div>
            <div className="mt-8 flex gap-3">
              <Button variant="outline" onClick={() => setStep(4)}>
                <ChevronLeft aria-hidden /> Back
              </Button>
              <Button
                className="flex-1"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                onClick={submitBooking}
              >
                {isSubmitting && <Loader2 className="animate-spin" aria-hidden />}
                {isSubmitting
                  ? DEPOSIT_ENABLED
                    ? "Starting payment…"
                    : "Sending request…"
                  : DEPOSIT_ENABLED
                    ? `Pay GH₵${Number.isFinite(DEPOSIT_AMOUNT) ? DEPOSIT_AMOUNT : 50} deposit`
                    : "Request appointment"}
              </Button>
            </div>
            {DEPOSIT_ENABLED && (
              <p className="mt-3 text-center text-xs text-muted-foreground">
                A small deposit holds your slot. Balance is paid at the studio.
              </p>
            )}
          </section>
        )}

        {step === 6 && (
          <section className="py-8 text-center" aria-labelledby="confirmed-title">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check className="h-7 w-7" aria-hidden />
            </span>
            <h2 id="confirmed-title" className="mt-6 font-display text-4xl text-ink">
              {paidConfirmed ? "You're confirmed." : "Your request is in."}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              {paidConfirmed
                ? "Deposit received. We look forward to your eyelash fixing session."
                : "Your appointment request is pending confirmation."}
            </p>
            {selectedService && confirmationDate && time && (
              <dl className="mx-auto mt-6 max-w-md rounded-xl bg-secondary p-5 text-left text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Service</dt>
                  <dd className="font-medium text-ink">{selectedService.name}</dd>
                </div>
                <div className="mt-3 flex justify-between gap-4">
                  <dt className="text-muted-foreground">Date</dt>
                  <dd className="text-right font-medium text-ink">
                    {confirmationDate}
                  </dd>
                </div>
                <div className="mt-3 flex justify-between gap-4">
                  <dt className="text-muted-foreground">Time</dt>
                  <dd className="font-medium text-ink">{formatTime(time)}</dd>
                </div>
              </dl>
            )}
            <p className="mx-auto mt-5 max-w-md text-sm text-muted-foreground">
              {paidConfirmed
                ? "A receipt was emailed when payment completed. Message us on WhatsApp if you need to reschedule."
                : emailSent
                  ? "We sent your request details by email. We will follow up once the appointment is confirmed."
                  : "We will confirm your appointment via WhatsApp or phone."}
            </p>
            {bookingId && (
              <p className="mt-4 text-xs text-muted-foreground">
                Reference: {bookingId}
              </p>
            )}
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackEvent("whatsapp_click", { source: "book_confirm" })}
                >
                  Message us on WhatsApp
                </a>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">Return home</Link>
              </Button>
            </div>
          </section>
        )}
      </div>
      </div>
    </div>
  );
}

function WizardActions({
  onBack,
  onNext,
  nextLabel,
  nextDisabled,
}: {
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
  nextDisabled?: boolean;
}) {
  return (
    <div className="mt-8 flex gap-3">
      <Button type="button" variant="outline" onClick={onBack}>
        <ChevronLeft aria-hidden /> Back
      </Button>
      <Button
        type="button"
        className="flex-1"
        onClick={onNext}
        disabled={nextDisabled}
      >
        {nextLabel}
      </Button>
    </div>
  );
}

function FormField({
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
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
