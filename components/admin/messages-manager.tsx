"use client";

import { Inbox, Mail, MailOpen, MessageCircle, Phone, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { telHref, whatsappToClient } from "@/lib/whatsapp";
import type { ContactMessage } from "@/types";

/** Searchable contact inbox with read/unread and delete actions. */
export function MessagesManager({
  initialMessages,
}: {
  initialMessages: ContactMessage[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [selectedId, setSelectedId] = useState<string | null>(
    initialMessages[0]?.id ?? null
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return messages.filter((message) => {
      if (filter === "unread" && message.is_read) return false;
      if (filter === "read" && !message.is_read) return false;
      if (!needle) return true;
      return `${message.name} ${message.email} ${message.phone ?? ""} ${message.message}`
        .toLowerCase()
        .includes(needle);
    });
  }, [filter, messages, query]);

  const selected =
    filtered.find((item) => item.id === selectedId) ?? filtered[0] ?? null;

  const selectedCallHref = selected?.phone
    ? telHref(selected.phone)
    : undefined;
  const selectedWhatsAppHref = selected?.phone
    ? whatsappToClient(
        selected.phone,
        `Hi ${selected.name}, thanks for messaging Lash Lux.`
      )
    : undefined;

  const unreadCount = messages.filter((item) => !item.is_read).length;

  async function setReadState(id: string, isRead: boolean) {
    const previous = messages;
    setMessages((items) =>
      items.map((item) => (item.id === id ? { ...item, is_read: isRead } : item))
    );
    try {
      const response = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isRead }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Update failed");
    } catch (error) {
      setMessages(previous);
      toast.error(
        error instanceof Error ? error.message : "Could not update message."
      );
    }
  }

  async function deleteMessage(id: string) {
    if (!window.confirm("Delete this message? This cannot be undone.")) return;
    const previous = messages;
    setMessages((items) => items.filter((item) => item.id !== id));
    if (selectedId === id) setSelectedId(null);
    try {
      const response = await fetch(
        `/api/admin/messages?id=${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          typeof result.error === "string" ? result.error : "Delete failed"
        );
      }
      toast.success("Message deleted");
    } catch (error) {
      setMessages(previous);
      toast.error(
        error instanceof Error ? error.message : "Could not delete message."
      );
    }
  }

  async function openMessage(message: ContactMessage) {
    setSelectedId(message.id);
    if (!message.is_read) {
      await setReadState(message.id, true);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Inbox</p>
        <h1 className="mt-1 text-4xl text-ink">Messages</h1>
        <p className="mt-2 text-muted-foreground">
          Contact form requests from the website.
          {unreadCount > 0 ? ` ${unreadCount} unread.` : " All caught up."}
        </p>
      </div>

      <Card>
        <CardContent className="grid gap-3 p-4 md:grid-cols-[minmax(14rem,1fr)_auto]">
          <label className="relative">
            <span className="sr-only">Search messages</span>
            <Search
              className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, email, phone, or message"
              className="pl-9"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["all", "All"],
                ["unread", "Unread"],
                ["read", "Read"],
              ] as const
            ).map(([value, label]) => (
              <Button
                key={value}
                type="button"
                size="sm"
                variant={filter === value ? "secondary" : "ghost"}
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
              >
                {label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Inbox className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden />
            <h2 className="mt-4 font-display text-2xl">No messages found</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              New contact form submissions will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
          <Card>
            <CardContent className="divide-y divide-border p-0">
              {filtered.map((message) => (
                <button
                  key={message.id}
                  type="button"
                  onClick={() => openMessage(message)}
                  className={cn(
                    "block w-full px-4 py-4 text-left transition-colors focus-ring",
                    selected?.id === message.id
                      ? "bg-secondary/80"
                      : "hover:bg-secondary/40",
                    !message.is_read && "bg-amber-50/50"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-medium text-ink">{message.name}</p>
                    {!message.is_read ? (
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                    ) : null}
                  </div>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {message.phone
                      ? `${message.phone} · ${message.email}`
                      : message.email}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {message.message}
                  </p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    {new Date(message.created_at).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </button>
              ))}
            </CardContent>
          </Card>

          {selected ? (
            <Card>
              <CardContent className="space-y-5 p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-2xl text-ink">
                      {selected.name}
                    </h2>
                    <a
                      href={`mailto:${selected.email}`}
                      className="mt-1 block text-sm text-rose-deep hover:underline"
                    >
                      {selected.email}
                    </a>
                    {selected.phone ? (
                      <p className="mt-1 text-sm text-ink">{selected.phone}</p>
                    ) : null}
                    <p className="mt-2 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                      {new Date(selected.created_at).toLocaleString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCallHref ? (
                      <Button asChild size="sm" variant="outline">
                        <a href={selectedCallHref}>
                          <Phone aria-hidden /> Call
                        </a>
                      </Button>
                    ) : null}
                    {selectedWhatsAppHref ? (
                      <Button asChild size="sm" variant="outline">
                        <a
                          href={selectedWhatsAppHref}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <MessageCircle aria-hidden /> WhatsApp
                        </a>
                      </Button>
                    ) : null}
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setReadState(selected.id, !selected.is_read)
                      }
                    >
                      {selected.is_read ? (
                        <>
                          <Mail aria-hidden /> Mark unread
                        </>
                      ) : (
                        <>
                          <MailOpen aria-hidden /> Mark read
                        </>
                      )}
                    </Button>
                    <Button asChild size="sm">
                      <a
                        href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: your message to Lash Lux`)}`}
                      >
                        Reply
                      </a>
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      aria-label="Delete message"
                      onClick={() => deleteMessage(selected.id)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
                <div className="rounded-xl bg-secondary/60 p-5 text-sm leading-7 text-ink whitespace-pre-wrap">
                  {selected.message}
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      )}
    </div>
  );
}
