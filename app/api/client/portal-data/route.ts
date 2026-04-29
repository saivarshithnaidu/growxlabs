import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getServerSession } from "next-auth/next";

export async function GET() {
  const session = await getServerSession(); // In a real app, use auth options
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { data: client } = await supabaseAdmin
      .from("clients")
      .select("id")
      .eq("email", session.user.email)
      .single();

    if (!client) throw new Error("Client not found");

    const [agreements, invoices, projects] = await Promise.all([
      supabaseAdmin.from("agreements").select("*, clients(*)").eq("client_id", client.id).order("created_at", { ascending: false }),
      supabaseAdmin.from("invoices").select("*").eq("client_id", client.id).order("created_at", { ascending: false }),
      supabaseAdmin.from("projects").select("*").eq("client_id", client.id).order("created_at", { ascending: false }),
    ]);

    return NextResponse.json({
      agreements: agreements.data || [],
      invoices: invoices.data || [],
      projects: projects.data || []
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
