import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { DEFAULT_BRAND_KIT, normaliseBrandKit } from "@/components/editor/brand/brandKit";

/** The workspace's carousel brand kit, one record in system_settings shared by every carousel. */
const KEY = "carousel_brand_kit";

async function denyUnlessAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  if (!["ADMIN", "CO_ADMIN"].includes(String(session.user.role))) return NextResponse.json({ error: "Admin permission required." }, { status: 403 });
  return null;
}

export async function GET() {
  const denied = await denyUnlessAdmin();
  if (denied) return denied;
  const { data, error } = await supabaseAdmin.from("system_settings").select("setting_value, updated_at").eq("setting_key", KEY).maybeSingle();
  if (error) return NextResponse.json({ kit: DEFAULT_BRAND_KIT, saved: false, error: error.message });
  return NextResponse.json({ kit: data ? normaliseBrandKit(data.setting_value) : DEFAULT_BRAND_KIT, saved: Boolean(data), updatedAt: data?.updated_at ?? null });
}

export async function PUT(request: Request) {
  const denied = await denyUnlessAdmin();
  if (denied) return denied;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const kit = normaliseBrandKit((body as { kit?: unknown })?.kit);
  const { error } = await supabaseAdmin
    .from("system_settings")
    .upsert({ setting_key: KEY, setting_value: kit, category: "Editor", updated_at: new Date().toISOString() }, { onConflict: "setting_key" });
  if (error) return NextResponse.json({ error: `Couldn't save the brand kit: ${error.message}` }, { status: 500 });
  return NextResponse.json({ kit, saved: true });
}
