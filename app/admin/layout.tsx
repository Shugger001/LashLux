import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/admin-shell";
import {
  getPendingAppointmentCount,
  getUnreadContactCount,
} from "@/lib/admin-data";

export const metadata: Metadata = {
  title: "Studio Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [pendingCount, unreadMessages] = await Promise.all([
    getPendingAppointmentCount(),
    getUnreadContactCount(),
  ]);
  return (
    <AdminShell pendingCount={pendingCount} unreadMessages={unreadMessages}>
      {children}
    </AdminShell>
  );
}
