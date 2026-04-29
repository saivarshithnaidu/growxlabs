import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function PATCH(req: Request) {
  try {
    const { id, ...data } = await req.json();

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const updateData: any = {
      service_type: data.projectName,
      project_description: data.projectDescription,
      total_amount: data.totalValue,
      advance_amount: data.advanceAmount,
      balance_amount: Number(data.totalValue) - Number(data.advanceAmount),
      start_date: data.startDate,
      delivery_date: data.deliveryDate,
      address: data.clientAddress,
      gst_number: data.gstNumber,
      selected_plan: data.selectedPlan,
      agreement_date: data.agreementDate
    };

    const { error } = await supabaseAdmin
      .from("agreements")
      .update(updateData)
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
