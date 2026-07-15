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

    return NextResponse.json({ error: "Method Not Allowed: Lead clearing is permanently disabled for safety." }, { status: 405 });
  } catch (error: any) {
    console.error("[API DELETE ALL ERROR]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
