import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getBaseUrl } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const { agreementId, party, signature } = await req.json();

    const updateData: any = {
      status: "signed", // General status
    };

    if (party === "client") {
      updateData.client_signature = signature;
      updateData.client_signed_at = new Date().toISOString();
      updateData.status = "awaiting_admin_signature";
    } else if (party === "admin") {
      updateData.admin_signature = signature;
      updateData.admin_signed_at = new Date().toISOString();
      updateData.status = "fully_signed";
    }

    const { data: agreement, error: updateError } = await supabaseAdmin
      .from("agreements")
      .update(updateData)
      .eq("id", agreementId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Trigger next step: Create initial advance invoice automatically if fully signed
    if (updateData.status === "fully_signed") {
      await fetch(`${getBaseUrl()}/api/invoice/create`, {
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
    }

    return NextResponse.json({ success: true, status: agreement.status });
  } catch (error: any) {
    console.error("Sign API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
