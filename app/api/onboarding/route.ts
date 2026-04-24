import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Basic validation
    const required = ['full_name', 'business_name', 'email', 'phone'];
    for (const field of required) {
      if (!data[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    const { data: submission, error } = await supabaseAdmin
      .from("onboarding_submissions")
      .insert([{
        full_name: data.full_name,
        business_name: data.business_name,
        email: data.email,
        phone: data.phone,
        business_type: data.business_type,
        description: data.description,
        target_audience: data.target_audience,
        city: data.city,
        plan: data.plan,
        features: data.features || [],
        budget: data.budget,
        timeline: data.timeline,
        domain: data.domain,
        payment_gateway: data.payment_gateway,
        notes: data.notes,
        signature: data.signature
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, id: submission.id });
  } catch (error: any) {
    console.error("Onboarding API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
