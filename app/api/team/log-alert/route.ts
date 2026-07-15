import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId, name: userName } = session.user as any;
    const { pathname } = await req.json();

    if (!pathname) {
      return NextResponse.json({ error: "Pathname is required" }, { status: 400 });
    }

    // Insert alert entry into lead_activities
    const { error } = await supabaseAdmin.from("lead_activities").insert([{
      team_member_id: userId,
      activity_type: "ALERT",
      notes: `${userName || "Agent"} attempted to access unauthorized page: ${pathname}`,
      created_at: new Date().toISOString()
    }]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
