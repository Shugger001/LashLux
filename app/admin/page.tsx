import { DashboardOverview } from "@/components/admin/dashboard-overview";
import { getAdminStats } from "@/lib/admin-data";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();
  return <DashboardOverview stats={stats} />;
}
