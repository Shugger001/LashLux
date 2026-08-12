import { NextResponse } from "next/server";

import { getAdminStats } from "@/lib/admin-data";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

/** Return dashboard metrics to authenticated administrators. */
export async function GET() {
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }
  return NextResponse.json(await getAdminStats());
}
