import { NextResponse } from "next/server";
import { denyUnlessFinanceAdmin } from "@/lib/finance/admin-guard";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { EnterpriseFinanceService } from "@/services/enterprise-finance";

export async function GET(request: Request) {
  try {
    const denied = await denyUnlessFinanceAdmin();
    if (denied) return denied;

    const { data: invoices, error } = await supabaseAdmin
      .from("invoices")
      .select("*, company:companies(name)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ invoices });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch invoices" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const denied = await denyUnlessFinanceAdmin();
    if (denied) return denied;

    const { quotation_id, due_date } = await request.json();
    if (!quotation_id || !due_date) throw new Error("Missing parameters");

    const invoice = await EnterpriseFinanceService.convertQuotationToInvoice(quotation_id, due_date);
    return NextResponse.json({ invoice }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to build invoice" }, { status: 400 });
  }
}
