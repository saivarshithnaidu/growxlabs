import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { EnterpriseFinanceService } from "@/services/enterprise-finance";

/** The ledger is admin-only: no session is a 401, any other role a 403. */
async function denyUnlessAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  if (!["ADMIN", "CO_ADMIN"].includes(String(session.user.role))) return NextResponse.json({ error: "You don't have permission to view the ledger." }, { status: 403 });
  return null;
}

export async function GET(request: Request) {
  try {
    const denied = await denyUnlessAdmin();
    if (denied) return denied;

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
    const denied = await denyUnlessAdmin();
    if (denied) return denied;

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
