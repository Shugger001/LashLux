"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AdminSettings } from "@/lib/admin-data";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const SETTING_KEYS: Record<keyof AdminSettings, string> = {
  businessName: "business_name",
  email: "business_email",
  phone: "business_phone",
  address: "business_address",
  instagram: "instagram",
  facebook: "facebook",
  tiktok: "tiktok",
  bookingBuffer: "booking_buffer",
  maxBookingDays: "max_booking_days",
  seoTitle: "seo_title",
  seoDescription: "seo_description",
};

/** Editable business, booking, social, and search settings. */
export function SettingsForm({ initialSettings }: { initialSettings: AdminSettings }) {
  const [isSaving, setIsSaving] = useState(false);

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    const values = new FormData(event.currentTarget);
    const settings: AdminSettings = {
      businessName: String(values.get("businessName") ?? "").trim(),
      email: String(values.get("email") ?? "").trim(),
      phone: String(values.get("phone") ?? "").trim(),
      address: String(values.get("address") ?? "").trim(),
      instagram: String(values.get("instagram") ?? "").trim(),
      facebook: String(values.get("facebook") ?? "").trim(),
      tiktok: String(values.get("tiktok") ?? "").trim(),
      bookingBuffer: Number(values.get("bookingBuffer")),
      maxBookingDays: Number(values.get("maxBookingDays")),
      seoTitle: String(values.get("seoTitle") ?? "").trim(),
      seoDescription: String(values.get("seoDescription") ?? "").trim(),
    };
    if (
      !settings.businessName ||
      !settings.email ||
      !settings.phone ||
      !settings.address ||
      settings.bookingBuffer < 0 ||
      settings.maxBookingDays < 1 ||
      settings.seoTitle.length < 10 ||
      settings.seoDescription.length < 40
    ) {
      toast.error("Complete required fields with valid booking and SEO values.");
      setIsSaving(false);
      return;
    }
    if (isSupabaseConfigured()) {
      const rows = Object.entries(settings).map(([field, value]) => ({
        key: SETTING_KEYS[field as keyof AdminSettings],
        value: String(value),
        type: typeof value === "number" ? "text" : "text",
      }));
      const { error } = await createClient()
        .from("site_settings")
        .upsert(rows, { onConflict: "key" });
      if (error) {
        toast.error("Settings could not be saved.");
        setIsSaving(false);
        return;
      }
    }
    setIsSaving(false);
    toast.success(isSupabaseConfigured() ? "Studio settings saved" : "Demo settings saved for this preview");
  }

  return (
    <form className="space-y-6" onSubmit={saveSettings}>
      <div>
        <p className="text-sm font-medium text-primary">Studio configuration</p>
        <h1 className="mt-1 text-4xl text-ink">Settings</h1>
        <p className="mt-2 text-muted-foreground">Keep business details, booking rules, and search copy current.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Business information</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Field id="businessName" label="Business name" defaultValue={initialSettings.businessName} required />
          <Field id="email" label="Business email" type="email" defaultValue={initialSettings.email} required />
          <Field id="phone" label="Phone" type="tel" defaultValue={initialSettings.phone} required />
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="address">Studio address</Label>
            <Input id="address" name="address" defaultValue={initialSettings.address} required maxLength={200} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Social profiles</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <Field id="instagram" label="Instagram URL" type="url" defaultValue={initialSettings.instagram} />
          <Field id="facebook" label="Facebook URL" type="url" defaultValue={initialSettings.facebook} />
          <Field id="tiktok" label="TikTok URL" type="url" defaultValue={initialSettings.tiktok} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Booking rules</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Field id="bookingBuffer" label="Buffer between appointments (minutes)" type="number" min={0} step={5} defaultValue={initialSettings.bookingBuffer} required />
          <Field id="maxBookingDays" label="Maximum advance booking (days)" type="number" min={1} max={365} defaultValue={initialSettings.maxBookingDays} required />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Search appearance</CardTitle></CardHeader>
        <CardContent className="grid gap-4">
          <Field id="seoTitle" label="SEO title" defaultValue={initialSettings.seoTitle} required maxLength={70} />
          <div className="grid gap-2">
            <Label htmlFor="seoDescription">SEO description</Label>
            <Textarea id="seoDescription" name="seoDescription" required minLength={40} maxLength={170} rows={4} defaultValue={initialSettings.seoDescription} />
            <p className="text-xs text-muted-foreground">Aim for 140–160 clear, specific characters.</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving}>{isSaving ? "Saving…" : "Save settings"}</Button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  ...props
}: {
  id: keyof AdminSettings;
  label: string;
} & React.ComponentProps<typeof Input>) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} {...props} />
    </div>
  );
}
