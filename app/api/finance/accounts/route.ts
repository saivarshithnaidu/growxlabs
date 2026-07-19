import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { EnterpriseFinanceService } from "@/services/enterprise-finance";

export async function GET(request: Request) {
  try {
    const [accountsRes, entriesRes, itemsRes] = await Promise.all([
      supabaseAdmin.from("chart_of_accounts").select("*").order("code", { ascending: true }),
      supabaseAdmin.from("journal_entries").select("*").order("entry_date", { ascending: false }),
      supabaseAdmin.from("journal_items").select("*, account:chart_of_accounts(name, code)")
    ]);

    return NextResponse.json({
      accounts: accountsRes.data || [],
      entries: entriesRes.data || [],
      items: itemsRes.data || []
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch accounts data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { entry_date, reference, description, items } = await request.json();
    if (!entry_date || !items || items.length === 0) throw new Error("Missing parameters");

    const entry = await EnterpriseFinanceService.postJournalEntry(
      entry_date,
      reference || `JV-${Date.now().toString().slice(-6)}`,
      description,
      items
    );

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to post journal entry" }, { status: 400 });
  }
}
