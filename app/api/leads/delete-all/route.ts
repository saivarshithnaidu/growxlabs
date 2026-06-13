import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role } = session.user as any;
    if (role !== "ADMIN" && role !== "CO_ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
    }

    console.log("[API] Clearing all leads");
    // Delete all rows in the leads table
    const { error } = await supabaseAdmin
      .from("leads")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000"); // Standard way in Supabase to match all rows

    if (error) {
      console.error("[DATABASE DELETE ALL ERROR]:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[API DELETE ALL ERROR]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
