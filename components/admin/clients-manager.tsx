"use client";

import { History, Mail, Search, Users } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AdminClient } from "@/lib/admin-data";
import { formatCurrency, formatTime } from "@/lib/utils";

/** Client search, booking history, and promotional email workflow. */
export function ClientsManager({ initialClients }: { initialClients: AdminClient[] }) {
  const [query, setQuery] = useState("");
  const [historyClient, setHistoryClient] = useState<AdminClient | null>(null);
  const [promoClient, setPromoClient] = useState<AdminClient | null>(null);
  const [isSending, setIsSending] = useState(false);

  const clients = useMemo(
    () =>
      initialClients.filter((client) =>
        `${client.full_name} ${client.email} ${client.phone}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [initialClients, query]
  );

  async function sendPromotion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!promoClient?.email) return;
    setIsSending(true);
    const values = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/admin/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: promoClient.email,
          subject: String(values.get("subject") ?? ""),
          body: String(values.get("body") ?? ""),
        }),
      });
      const result = (await response.json()) as { error?: string; skipped?: boolean };
      if (!response.ok) throw new Error(result.error ?? "Email could not be sent");
      toast.success(result.skipped ? "Demo email prepared (email provider not configured)" : "Promotion sent");
      setPromoClient(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Email could not be sent");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Client relationships</p>
        <h1 className="mt-1 text-4xl text-ink">Clients</h1>
        <p className="mt-2 text-muted-foreground">Find clients, review their visits, and send relevant offers.</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <label className="relative block max-w-xl">
            <span className="sr-only">Search clients</span>
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" aria-hidden />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, email, or phone" className="pl-9" />
          </label>
        </CardContent>
      </Card>

      {clients.length === 0 ? (
        <Card><CardContent className="py-16 text-center"><Users className="mx-auto h-8 w-8 text-muted-foreground" /><h2 className="mt-4 font-display text-2xl">No clients found</h2><p className="mt-2 text-sm text-muted-foreground">Try a different name or contact detail.</p></CardContent></Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-secondary/60 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>{["Client", "Contact", "Bookings", "Joined", "Actions"].map((heading) => <th key={heading} className="px-5 py-3 font-medium">{heading}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {clients.map((client) => (
                    <tr key={client.id}>
                      <td className="px-5 py-4 font-medium">{client.full_name ?? "Client"}</td>
                      <td className="px-5 py-4"><span className="block">{client.email || "No email"}</span><span className="text-xs text-muted-foreground">{client.phone}</span></td>
                      <td className="px-5 py-4">{client.appointments.length}</td>
                      <td className="px-5 py-4 text-muted-foreground">{new Date(client.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setHistoryClient(client)}><History /> History</Button>
                          <Button size="sm" disabled={!client.email} onClick={() => setPromoClient(client)}><Mail /> Email</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={Boolean(historyClient)} onOpenChange={(open) => !open && setHistoryClient(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{historyClient?.full_name}&apos;s booking history</DialogTitle>
            <DialogDescription>{historyClient?.appointments.length ?? 0} total appointments</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] space-y-3 overflow-y-auto">
            {historyClient?.appointments.length ? historyClient.appointments.map((appointment) => (
              <div key={appointment.id} className="flex flex-col justify-between gap-2 rounded-lg border border-border p-4 sm:flex-row sm:items-center">
                <div><p className="font-medium">{appointment.service?.name ?? "Lash service"}</p><p className="text-sm text-muted-foreground">{new Date(`${appointment.appointment_date}T12:00:00`).toLocaleDateString()} at {formatTime(appointment.appointment_time)}</p></div>
                <div className="text-sm sm:text-right"><p>{formatCurrency(appointment.service?.price ?? 0)}</p><p className="capitalize text-muted-foreground">{appointment.status}</p></div>
              </div>
            )) : <p className="py-8 text-center text-sm text-muted-foreground">No booking history yet.</p>}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(promoClient)} onOpenChange={(open) => !open && setPromoClient(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email {promoClient?.full_name}</DialogTitle>
            <DialogDescription>Send a relevant studio promotion to {promoClient?.email}.</DialogDescription>
          </DialogHeader>
          <form className="grid gap-4" onSubmit={sendPromotion}>
            <div className="grid gap-2"><Label htmlFor="promo-subject">Subject</Label><Input id="promo-subject" name="subject" required maxLength={120} placeholder="A fresh set for your next occasion" /></div>
            <div className="grid gap-2"><Label htmlFor="promo-body">Message</Label><Textarea id="promo-body" name="body" required minLength={10} maxLength={3000} rows={7} placeholder="Hi — we would love to welcome you back…" /></div>
            <Button type="submit" disabled={isSending}>{isSending ? "Sending…" : "Send promotion"}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
