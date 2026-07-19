import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { EnterpriseFinanceService } from "@/services/enterprise-finance";

export async function GET(request: Request) {
  try {
    const { data: expenses, error } = await supabaseAdmin
      .from("expenses")
      .select("*")
      .order("log_date", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ expenses });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch expenses" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data: expense, error } = await supabaseAdmin
      .from("expenses")
      .insert(body)
      .select()
      .single();

    if (error) throw error;

    // Double entry posting for approved expense: Debit expense account code, Credit Cash account code (1010)
    let accountCode = "5030"; // default travel
    if (body.category === "Cloud Infrastructure") accountCode = "5020";
    else if (body.category === "Salaries") accountCode = "5010";

    await EnterpriseFinanceService.postJournalEntry(
      body.log_date,
      `EXP-${expense.id.slice(-6)}`,
      `Approved expense log: ${body.category}`,
      [
        { account_code: accountCode, debit: Number(body.amount), credit: 0 },
        { account_code: "1010", debit: 0, credit: Number(body.amount) }
      ]
    );

    return NextResponse.json({ expense }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to log expense" }, { status: 400 });
  }
}
