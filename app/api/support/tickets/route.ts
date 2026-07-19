import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const MOCK_TICKETS = [
  {
    id: "t1111111-1111-1111-1111-111111111111",
    ticket_number: "TICK-9082",
    title: "SSO Integration failing on staging server",
    description: "OAuth 2.0 redirect URL returns 403 Forbidden after identity provider authentication.",
    customer_name: "Sarah Jenkins",
    customer_email: "s.jenkins@apexenterprise.com",
    company_name: "Apex Enterprise",
    priority: "Urgent",
    severity: "Major",
    category: "Authentication",
    assigned_agent: "David Miller (Technical Engineer)",
    status: "In Progress",
    source: "Portal",
    due_date: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    resolution: null,
    root_cause: null,
    sla_breached: false,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "t2222222-2222-2222-2222-222222222222",
    ticket_number: "TICK-9083",
    title: "Request for custom API rate limit increase",
    description: "We are expanding our data sync frequency to every 5 minutes and require 10,000 req/min.",
    customer_name: "Michael Chang",
    customer_email: "m.chang@luminalabs.io",
    company_name: "Lumina Labs",
    priority: "Medium",
    severity: "Minor",
    category: "API & Webhooks",
    assigned_agent: "Elena Rostova (Support Agent)",
    status: "Waiting For Customer",
    source: "Email",
    due_date: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(),
    resolution: null,
    root_cause: null,
    sla_breached: false,
    created_at: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "t3333333-3333-3333-3333-333333333333",
    ticket_number: "TICK-9084",
    title: "Billing invoice export PDF encoding issue",
    description: "Special characters in company name appear corrupted in exported invoices.",
    customer_name: "Carlos Rivera",
    customer_email: "carlos@vanguardtech.co",
    company_name: "Vanguard Tech",
    priority: "Low",
    severity: "Cosmetic",
    category: "Billing",
    assigned_agent: "Sarah Jenkins (CSM)",
    status: "Resolved",
    source: "Live Chat",
    due_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    resolution: "Patched PDF rendering font set to UTF-8.",
    root_cause: "Missing font glyph fallback in PDF generator.",
    sla_breached: false,
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
  }
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status");

    let query = supabaseAdmin.from("tickets").select(`
      *,
      support_agents(name)
    `).order("created_at", { ascending: false });

    if (statusFilter && statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    const { data: tickets, error } = await query;

    if (error || !tickets || tickets.length === 0) {
      return NextResponse.json({ tickets: MOCK_TICKETS });
    }

    return NextResponse.json({ tickets });
  } catch (error: any) {
    return NextResponse.json({ tickets: MOCK_TICKETS });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, customer_name, customer_email, company_name, priority, severity, category, source } = body;

    if (!title || !customer_email) {
      return NextResponse.json({ error: "Title and Customer Email are required" }, { status: 400 });
    }

    const ticketNumber = "TICK-" + Math.floor(1000 + Math.random() * 9000);

    const { data, error } = await supabaseAdmin
      .from("tickets")
      .insert([{
        ticket_number: ticketNumber,
        title,
        description,
        customer_name: customer_name || customer_email.split("@")[0],
        customer_email,
        company_name,
        priority: priority || "Medium",
        severity: severity || "Minor",
        source: source || "Portal",
        status: "New",
        due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }])
      .select()
      .single();

    if (error) {
      const syntheticTicket = {
        id: crypto.randomUUID(),
        ticket_number: ticketNumber,
        title,
        description,
        customer_name: customer_name || customer_email.split("@")[0],
        customer_email,
        company_name: company_name || "Individual",
        priority: priority || "Medium",
        severity: severity || "Minor",
        source: source || "Portal",
        status: "New",
        due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString()
      };
      return NextResponse.json({ ticket: syntheticTicket, synthetic: true });
    }

    return NextResponse.json({ ticket: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();

    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from("tickets")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ ticket: { id, ...body }, synthetic: true });
    }

    return NextResponse.json({ ticket: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
