import { MessagesManager } from "@/components/admin/messages-manager";
import { getAdminContactMessages } from "@/lib/admin-data";

export default async function AdminMessagesPage() {
  const messages = await getAdminContactMessages();
  return <MessagesManager initialMessages={messages} />;
}
