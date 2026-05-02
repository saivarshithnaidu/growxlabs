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

    const { role, id: userId } = session.user as any;
    const body = await req.json();
    const { leads } = body;

    if (!Array.isArray(leads)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    // Process leads: assign to agent if needed
    const processedLeads = leads
      .filter(l => l.business_name || l.name || l.contact_name) // Skip completely empty rows
      .map(lead => {
        const bName = lead.business_name || lead.company || lead.name || "Unknown Business";
        const cName = lead.name || lead.contact_name || lead.founder || bName; // Fallback to business name if no person name
        
        return {
          business_name: bName,
          name: cName,
          contact_name: cName,
          email: lead.email || null,
          phone: lead.phone || null,
          city: lead.city || null,
          status: lead.status || "new",
          assigned_to: role === 'crm_agent' ? userId : lead.assigned_to || null,
          created_at: new Date().toISOString()
        };
      });

    if (processedLeads.length === 0) {
      return NextResponse.json({ error: "No valid leads found in file. Ensure columns match Business Name, Email, or Phone." }, { status: 400 });
    }

    console.log(`[IMPORT] Attempting to insert ${processedLeads.length} leads`);

    // Insert into 'leads' table
    const { error: e1 } = await supabaseAdmin.from("leads").insert(processedLeads.map(l => ({
      business_name: l.business_name,
      name: l.name,
      email: l.email,
      phone: l.phone,
      city: l.city,
      status: l.status,
      assigned_to: l.assigned_to,
      created_at: l.created_at
    })));

    // Insert into 'crm_leads' table
    const { error: e2 } = await supabaseAdmin.from("crm_leads").insert(processedLeads.map(l => ({
      business_name: l.business_name,
      contact_name: l.contact_name,
      email: l.email,
      phone: l.phone,
      city: l.city,
      status: l.status,
      assigned_to: l.assigned_to,
      created_at: l.created_at
    })));

    if (e1 || e2) {
      const err = e2 || e1;
      console.error("[DATABASE ERROR]:", { e1, e2 });
      return NextResponse.json({ 
        error: `Database Error: ${err?.message}`,
        details: err?.details
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, count: processedLeads.length });
  } catch (error: any) {
    console.error("Import Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
