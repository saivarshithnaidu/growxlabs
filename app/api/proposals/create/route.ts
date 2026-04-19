import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const { data: proposal, error } = await supabaseAdmin
      .from("proposals")
      .insert([{
        client_name: data.clientName,
        business_name: data.businessName,
        country: data.country,
        currency: data.currency,
        industry: data.industry,
        problem_description: data.problem,
        pain_point_cost: data.impact,
        selected_package: data.selectedPackage,
        custom_price: data.customPrice ? parseFloat(data.customPrice.replace(/[^0-9.]/g, '')) : null,
        discovery_call_at: data.callDate || null,
        status: "sent",
        valid_until: new Date(Date.now() + (data.validDays || 7) * 24 * 60 * 60 * 1000).toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(proposal);
  } catch (error: any) {
    console.error("Proposal Create Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
