import { BlockedTimesManager } from "@/components/admin/blocked-times-manager";
import {
  createAdminClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import type { BlockedTime } from "@/types";

export default async function AdminBlockedTimesPage() {
  let blocks: BlockedTime[] = [];

  if (isSupabaseConfigured()) {
    try {
      const admin = createAdminClient();
      const today = new Date().toISOString().slice(0, 10);
      const { data } = await admin
        .from("blocked_times")
        .select("*")
        .gte("block_date", today)
        .order("block_date", { ascending: true })
        .limit(100);
      blocks = (data as BlockedTime[]) ?? [];
    } catch {
      blocks = [];
    }
  }

  return <BlockedTimesManager initialBlocks={blocks} />;
}
