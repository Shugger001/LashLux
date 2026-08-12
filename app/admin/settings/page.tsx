import { SettingsForm } from "@/components/admin/settings-form";
import { getAdminSettings } from "@/lib/admin-data";

export default async function SettingsPage() {
  const settings = await getAdminSettings();
  return <SettingsForm initialSettings={settings} />;
}
