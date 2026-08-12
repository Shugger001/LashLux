"use client";

import {
  CalendarDays,
  CalendarOff,
  ChevronLeft,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  Scissors,
  Settings,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/appointments", label: "Appointments", icon: CalendarDays },
  { href: "/admin/blocked-times", label: "Blocked times", icon: CalendarOff },
  { href: "/admin/services", label: "Services", icon: Scissors },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  {
    href: "/admin/testimonials",
    label: "Testimonials",
    icon: MessageSquareQuote,
  },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
] as const;

/** Responsive navigation shell shared by every admin route. */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => setIsDrawerOpen(false), [pathname]);

  async function handleLogout() {
    if (!isSupabaseConfigured()) {
      toast.success("Demo session ended");
      router.push("/");
      return;
    }
    const { error } = await createClient().auth.signOut();
    if (error) {
      toast.error("Could not sign out. Please try again.");
      return;
    }
    router.push("/auth/login");
    router.refresh();
  }

  const navigation = (
    <>
      <div className="flex h-20 items-center justify-between px-6">
        <Link href="/admin" className="rounded-sm focus-ring">
          <span className="block font-display text-3xl text-ink">Lash Lux</span>
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Eyelash fixing admin
          </span>
        </Link>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Close navigation"
          onClick={() => setIsDrawerOpen(false)}
        >
          <X />
        </Button>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Admin">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === item.href
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors focus-ring",
                isActive
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-2 p-4">
        <Button asChild variant="ghost" className="w-full justify-start">
          <Link href="/">
            <ChevronLeft aria-hidden />
            View website
          </Link>
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut aria-hidden />
          Log out
        </Button>
      </div>
    </>
  );

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
        <Image
          src="/images/hero-lashes.jpg"
          alt=""
          fill
          priority
          className="object-cover object-[center_28%] opacity-[0.18] sm:object-[center_32%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/92 to-background" />
      </div>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-card/95 backdrop-blur-md lg:flex">
        {navigation}
      </aside>

      {isDrawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/45"
            aria-label="Close navigation"
            onClick={() => setIsDrawerOpen(false)}
          />
          <aside className="relative flex h-full w-[min(18rem,85vw)] flex-col bg-card shadow-2xl">
            {navigation}
          </aside>
        </div>
      ) : null}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-border bg-background/95 px-4 backdrop-blur-md sm:px-6 lg:hidden">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Open navigation"
            aria-expanded={isDrawerOpen}
            onClick={() => setIsDrawerOpen(true)}
          >
            <Menu />
          </Button>
          <span className="ml-3 font-display text-2xl text-ink">Lash Lux Admin</span>
        </header>
        <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
