import { ServicesManager } from "@/components/admin/services-manager";
import { getAdminServices } from "@/lib/admin-data";

export default async function ServicesPage() {
  const services = await getAdminServices();
  return <ServicesManager initialServices={services} />;
}
