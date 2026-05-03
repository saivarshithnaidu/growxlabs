import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, id: userId, name: userName } = session.user as any;
    const body = await req.json();
    
    // Auto-assign to the agent if they are creating it
    const leadData: any = {
      ...body,
      assigned_to: role === 'crm_agent' ? userId : body.assigned_to || null,
      source: body.source || "Admin Manual",
      created_by: userId,
      created_by_name: userName || "Admin",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // 1. Insert into 'leads' table (Main Pipeline)
    let { data, error } = await supabaseAdmin
      .from("leads")
      .insert([leadData])
      .select()
      .single();

    // FALLBACK: If columns 'source' or 'created_by' don't exist yet, try without them but add to notes
    if (error && (error.message.includes("column") || error.code === '42703')) {
      console.log("Fallback: Tracking columns missing in 'leads' table. Using 'notes' field instead.");
      const fallbackData = {
        ...body,
        assigned_to: leadData.assigned_to,
        notes: `${body.notes || ""}\n[Source: ${leadData.source}] [Created By: ${leadData.created_by_name}]`.trim(),
        created_at: leadData.created_at,
        updated_at: leadData.updated_at
      };
      
      const { data: d2, error: e2 } = await supabaseAdmin
        .from("leads")
        .insert([fallbackData])
        .select()
        .single();
      
      data = d2;
      error = e2;
    }

    if (error) throw error;

    // 2. Insert into 'crm_leads' table (CRM) for redundancy/sync
    // 'crm_leads' is known to have these columns from supabase_crm_patch.sql
    await supabaseAdmin.from("crm_leads").insert([{
      business_name: leadData.business_name,
      contact_name: leadData.name || leadData.business_name,
      email: leadData.email,
      phone: leadData.phone,
      city: leadData.city,
      status: leadData.status || 'new',
      source: leadData.source,
      created_by: userId,
      added_manually: true,
      assigned_to: leadData.assigned_to
    }]);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Lead Create Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
