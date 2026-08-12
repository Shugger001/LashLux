import { ClientsManager } from "@/components/admin/clients-manager";
import { getAdminClients } from "@/lib/admin-data";

export default async function ClientsPage() {
  const clients = await getAdminClients();
  return <ClientsManager initialClients={clients} />;
}
