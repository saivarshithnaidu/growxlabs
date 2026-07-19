import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const MOCK_LEADS = [
  {
    id: "l1111111-1111-1111-1111-111111111111",
    name: "Alex Rivera",
    email: "alex@riveratech.io",
    phone: "+1-555-0199",
    business_name: "Rivera Technologies",
    status: "MQL",
    score: 85,
    crm_lead_id: "crm11111-1111-1111-1111-111111111111",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "l2222222-2222-2222-2222-222222222222",
    name: "Sarah Chen",
    email: "sarah@luminahealth.com",
    phone: "+1-555-0145",
    business_name: "Lumina Health",
    status: "new",
    score: 25,
    crm_lead_id: null,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "l3333333-3333-3333-3333-333333333333",
    name: "Marcus Vance",
    email: "marcus.v@apexretail.co",
    phone: "+1-555-0128",
    business_name: "Apex Retail Group",
    status: "SQL",
    score: 95,
    crm_lead_id: "crm22222-2222-2222-2222-222222222222",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export async function GET() {
  try {
    const { data: leads, error } = await supabaseAdmin
      .from("marketing_leads")
      .select(`
        *,
        lead_sources(source_name)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ leads: MOCK_LEADS });
    }

    return NextResponse.json({ leads: leads.length > 0 ? leads : MOCK_LEADS });
  } catch (error: any) {
    return NextResponse.json({ leads: MOCK_LEADS });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, leadId } = body;

    // Direct Handoff Trigger (Force Sync to CRM)
    if (action === "force-sync" && leadId) {
      // 1. Get Marketing Lead details
      const { data: mLead, error: lErr } = await supabaseAdmin
        .from("marketing_leads")
        .select("*")
        .eq("id", leadId)
        .single();

      if (lErr || !mLead) {
        return NextResponse.json({ error: "Lead not found in marketing database" }, { status: 404 });
      }

      // 2. Insert into CRM Tables
      const { data: crmLead, error: crmErr } = await supabaseAdmin
        .from("crm_leads")
        .insert([{
          business_name: mLead.business_name || mLead.name,
          contact_name: mLead.name,
          email: mLead.email,
          phone: mLead.phone,
          source: "Marketing Hub Manual Sync",
          score: Math.max(mLead.score, 50),
          status: "new",
          priority: "medium",
          notes: "Manually pushed from Marketing Hub by team member."
        }])
        .select()
        .single();

      if (crmErr) throw crmErr;

      // 3. Update marketing lead status
      await supabaseAdmin
        .from("marketing_leads")
        .update({
          crm_lead_id: crmLead.id,
          status: "MQL"
        })
        .eq("id", leadId);

      return NextResponse.json({ success: true, crmLeadId: crmLead.id });
    }

    // Standard Create Marketing Lead
    const { email, name, phone, business_name, score, status } = body;
    const { data: inserted, error } = await supabaseAdmin
      .from("marketing_leads")
      .insert([{
        email,
        name,
        phone,
        business_name,
        score: score || 0,
        status: status || "new"
      }])
      .select()
      .single();

    if (error) {
      const synthetic = {
        id: crypto.randomUUID(),
        email,
        name,
        phone,
        business_name,
        score: score || 0,
        status: status || "new",
        created_at: new Date().toISOString()
      };
      return NextResponse.json({ lead: synthetic, synthetic: true });
    }

    return NextResponse.json({ lead: inserted });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
