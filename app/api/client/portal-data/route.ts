import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // In this schema, clients ARE users with the role 'CLIENT'
    const { data: client, error: userError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", session.user.email)
      .single();

    if (userError || !client) {
      throw new Error("Client account not found in system.");
    }

    const [agreements, invoices, projects] = await Promise.all([
      supabaseAdmin.from("agreements").select("*").eq("client_id", client.id).order("created_at", { ascending: false }),
      supabaseAdmin.from("invoices").select("*").eq("client_id", client.id).order("created_at", { ascending: false }),
      supabaseAdmin.from("projects").select("*").eq("client_id", client.id).order("created_at", { ascending: false }),
    ]);

    return NextResponse.json({
      agreements: agreements.data || [],
      invoices: invoices.data || [],
      projects: projects.data || []
    });
  } catch (error: any) {
    console.error("Portal Data Fetch Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

