import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const VALID_LEAD_COLUMNS = [
  'business_name', 'name', 'email', 'phone', 'website_url', 
  'has_website', 'instagram_followers', 'linkedin_url', 
  'google_rating', 'lead_score', 'status', 'city', 'notes', 
  'assigned_to'
];

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, id: userId } = session.user as any;
    const { id } = await params;
    
    // 1. Validate ID (Basic presence check, Supabase handles UUID typing)
    if (!id) {
      return NextResponse.json({ error: "Lead ID is required" }, { status: 400 });
    }

    // 1.5 Security Check for CRM Agents
    if (role === 'crm_agent') {
      const { data: lead } = await supabaseAdmin
        .from("leads")
        .select("assigned_to")
        .eq("id", id)
        .single();
      
      if (!lead || lead.assigned_to !== userId) {
        return NextResponse.json({ error: "Access Denied: You can only update leads assigned to you." }, { status: 403 });
      }
    }

    const body = await req.json();
    
    // 2. Filter data
    const updateData: Record<string, any> = {};
    
    Object.keys(body).forEach(key => {
      // Prevent CRM Agents from changing the assignment
      if (role === 'crm_agent' && key === 'assigned_to') return;
      
      if (VALID_LEAD_COLUMNS.includes(key)) {
        updateData[key] = body[key];
      }
    });

    if (Object.keys(updateData).length === 0) {
      console.warn(`[API] No valid columns to update for lead ${id}`, body);
      // We still update updated_at if anything was sent even if no valid columns matched
      // to acknowledge the heartbeat/attempt
    }

    console.log(`[API] Updating Lead ${id} with filtered data:`, updateData);
    
    // 3. Update Database
    const { data, error } = await supabaseAdmin
      .from("leads")
      .update({ 
        ...updateData
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[DATABASE ERROR DEBUG]:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return NextResponse.json({ 
        error: `Database Error: ${error.message}`,
        details: error.details,
        code: error.code
      }, { status: 500 });
    }

    console.log(`[API] Successfully updated lead ${id}`);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("[API CATCH ERROR]:", error);
    return NextResponse.json({ error: `Server Error: ${message}` }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role } = session.user as any;
    if (role !== "ADMIN" && role !== "CO_ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Lead ID is required" }, { status: 400 });
    }

    console.log(`[API] Deleting Lead ${id}`);
    const { error } = await supabaseAdmin
      .from("leads")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[DATABASE DELETE ERROR]:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[API DELETE ERROR]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Lead ID is required" }, { status: 400 });
    }

    const { data: lead, error } = await supabaseAdmin
      .from("leads")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json(lead);
  } catch (error: any) {
    console.error("[API GET ERROR]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

