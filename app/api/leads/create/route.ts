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
    
    const now = new Date().toISOString();
    const assignedTo = role === 'crm_agent' ? userId : body.assigned_to || null;
    const creatorName = userName || "Admin";
    const source = body.source || "Admin Manual";

    // Strictly define the data to insert into 'leads' to avoid undefined column errors
    const leadData: any = {
      business_name: body.business_name,
      name: body.name || body.business_name, // Fallback to business_name
      email: body.email || null,
      phone: body.phone || null,
      city: body.city || null,
      status: body.status || 'new',
      assigned_to: assignedTo,
      created_at: now,
      updated_at: now
    };

    // 1. Try to insert with tracking columns
    let { data, error } = await supabaseAdmin
      .from("leads")
      .insert([{
        ...leadData,
        source: source,
        created_by: userId,
        created_by_name: creatorName
      }])
      .select()
      .single();

    // FALLBACK: If columns don't exist, use the 'notes' field
    if (error && (error.message.includes("column") || error.code === '42703')) {
      console.log("Fallback: Tracking columns missing in 'leads' table. Using 'notes' field.");
      const fallbackData = {
        ...leadData,
        notes: `${body.notes || ""}\n[Source: ${source}] [Created By: ${creatorName}]`.trim()
      };
      
      const { data: d2, error: e2 } = await supabaseAdmin
        .from("leads")
        .insert([fallbackData])
        .select()
        .single();
      
      data = d2;
      error = e2;
    }

    if (error) {
      console.error("Lead Create DB Error:", error);
      throw error;
    }

    // 2. Sync with 'crm_leads'
    try {
      await supabaseAdmin.from("crm_leads").insert([{
        business_name: leadData.business_name,
        contact_name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        city: leadData.city,
        status: leadData.status,
        source: source,
        created_by: userId,
        added_manually: true,
        assigned_to: assignedTo
      }]);
    } catch (e) {
      console.error("CRM Sync Error (non-fatal):", e);
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Lead Create Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
