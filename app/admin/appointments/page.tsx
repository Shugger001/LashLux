import { AppointmentsManager } from "@/components/admin/appointments-manager";
import { getAdminAppointments } from "@/lib/admin-data";

export default async function AppointmentsPage() {
  const appointments = await getAdminAppointments();
  return <AppointmentsManager initialAppointments={appointments} />;
}
