import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getBaseUrl } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const { agreementId } = await req.json();

    const { data: agreement, error: updateError } = await supabaseAdmin
      .from("agreements")
      .update({
        status: "signed",
        signed_at: new Date().toISOString()
      })
      .eq("id", agreementId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Trigger next step: Create initial advance invoice automatically
    // This maintains the "Core Flow" requested by the user
    const res = await fetch(`${getBaseUrl()}/api/invoice/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: agreement.client_id,
        agreement_id: agreement.id,
        amount: agreement.advance_amount,
        description: `Advance Payment (50%) for ${agreement.service_type}`,
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      })
    });

    return NextResponse.json({ success: true, signed_at: agreement.signed_at });
  } catch (error: any) {
    console.error("Sign API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
