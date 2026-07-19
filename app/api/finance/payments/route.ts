import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { EnterpriseFinanceService } from "@/services/enterprise-finance";

export async function GET(request: Request) {
  try {
    const { data: payments, error } = await supabaseAdmin
      .from("payments")
      .select("*, invoice:invoices(invoice_number, company:companies(name))")
      .order("payment_date", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ payments });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch payments" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { invoice_id, amount, payment_method, transaction_id } = await request.json();
    if (!invoice_id || !amount || !payment_method) throw new Error("Missing parameters");

    const payment = await EnterpriseFinanceService.recordPayment(
      invoice_id,
      Number(amount),
      payment_method,
      transaction_id || `TX-${Date.now()}`
    );

    return NextResponse.json({ payment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to record payment" }, { status: 400 });
  }
}
