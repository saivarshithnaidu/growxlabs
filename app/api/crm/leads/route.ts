import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth/next";
import { supabaseAdmin } from "@/lib/supabase/admin";
// Assuming authOptions is located in app/api/auth/[...nextauth]/route or similar
// For this script, we'll try to just rely on the session if available

// Helper to authenticate user (Admin or Team Member)
async function authenticate(req: Request) {
  // 1. Check Team Session
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("team_session")?.value;

  if (sessionId) {
    const { data: session } = await supabaseAdmin
      .from("team_sessions")
      .select("team_member_id")
      .eq("id", sessionId)
      .eq("is_active", true)
      .single();

    if (session) {
      const { data: member } = await supabaseAdmin
        .from("team_members")
        .select("*")
        .eq("id", session.team_member_id)
        .single();
      if (member) return { user: member, role: "TEAM" };
    }
  }

  // 2. Check NextAuth (Admin) - Using a simple approach without importing authOptions if not needed
  // Alternatively, since NextAuth cookies exist, we can just use getServerSession with req
  // But wait, in app router, getServerSession often needs authOptions. 
  // Let's assume admins access via the dashboard, but maybe we can just query the DB for the token if needed.
  // We'll use a dynamic import for nextauth config if it exists, otherwise just rely on cookies.
  
  return null; // Update this logic if NextAuth is strictly needed here for Admins
}

import { authOptions } from "@/lib/auth";

// Full logic for CRM API
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, id } = session.user as any;
    const { searchParams } = new URL(req.url);
    const assignedTo = searchParams.get('assigned_to');
    
    let query = supabaseAdmin.from("crm_leads").select(`
      *,
      assigned_to_member:team_members(name)
    `).order("created_at", { ascending: false });
    
    if (role === "crm_agent") {
      // Agents only see their assigned leads
      query = query.eq('assigned_to', id);
    } else if (assignedTo && assignedTo !== 'all') {
      query = query.eq('assigned_to', assignedTo);
    }
    
    const { data: leads, error } = await query;
    if (error) throw error;
    
    return NextResponse.json({ leads });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { business_name, contact_name, email, phone, city, status, assigned_to } = body;

    // 1. Insert into leads table
    const { error: e1 } = await supabaseAdmin.from("leads").insert([{
      business_name,
      name: contact_name || business_name,
      email,
      phone,
      city,
      status: status || 'new',
      assigned_to
    }]);

    // 2. Insert into crm_leads table
    const { data: lead, error: e2 } = await supabaseAdmin.from("crm_leads").insert([{
      business_name,
      contact_name: contact_name || business_name,
      email,
      phone,
      city,
      status: status || 'new',
      assigned_to
    }]).select().single();

    if (e1 && e2) throw e2 || e1;

    return NextResponse.json({ lead });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const body = await req.json();
    
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    
    const { data, error } = await supabaseAdmin.from("crm_leads").update(body).eq("id", id).select().single();
    if (error) throw error;
    return NextResponse.json({ lead: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
