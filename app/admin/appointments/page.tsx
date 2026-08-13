import { AppointmentsManager } from "@/components/admin/appointments-manager";
import { getAdminAppointments } from "@/lib/admin-data";

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams?: { status?: string; date?: string; view?: string };
}) {
  const appointments = await getAdminAppointments();
  return (
    <AppointmentsManager
      initialAppointments={appointments}
      initialStatus={searchParams?.status}
      initialDate={searchParams?.date}
      initialView={searchParams?.view}
    />
  );
}
