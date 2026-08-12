import { NextResponse } from "next/server";

import {
  createAdminClient,
  createClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

type AdminClient = ReturnType<typeof createAdminClient>;

/** Verify the current session belongs to an admin. Uses service role for the role check. */
export async function requireAdmin(): Promise<
  | { admin: AdminClient; userId: string; demo?: undefined; error?: undefined }
  | { demo: true; admin?: undefined; userId?: undefined; error?: undefined }
  | { error: NextResponse; admin?: undefined; userId?: undefined; demo?: undefined }
> {
  if (!isSupabaseConfigured()) {
    return { demo: true };
  }

  const session = createClient();
  const {
    data: { user },
  } = await session.auth.getUser();
  if (!user) {
    return {
      error: NextResponse.json({ error: "Sign in required." }, { status: 401 }),
    };
  }

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    return {
      error: NextResponse.json({ error: "Admin access required." }, { status: 403 }),
    };
  }

  return { admin, userId: user.id };
}
