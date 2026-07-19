import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const MOCK_CAMPAIGNS = [
  {
    id: "c1111111-1111-1111-1111-111111111111",
    name: "Enterprise Tech Summit 2026",
    objective: "Event Registrations",
    budget: 8000,
    spent: 6200,
    owner_id: null,
    audience: "CTOs and VPs of Engineering",
    channels: ["LinkedIn Ads", "Email Marketing"],
    status: "active",
    start_date: "2026-06-01",
    end_date: "2026-08-30",
    roi: 185,
    created_at: new Date().toISOString()
  },
  {
    id: "c2222222-2222-2222-2222-222222222222",
    name: "GrowXLabs Platform Launch",
    objective: "Brand Awareness",
    budget: 15000,
    spent: 14800,
    owner_id: null,
    audience: "Startup Founders & Developers",
    channels: ["Google Ads", "Meta Ads", "Twitter/X"],
    status: "completed",
    start_date: "2026-01-10",
    end_date: "2026-03-15",
    roi: 320,
    created_at: new Date().toISOString()
  },
  {
    id: "c3333333-3333-3333-3333-333333333333",
    name: "Automated Drip Outreach Q3",
    objective: "Lead Nurturing",
    budget: 1000,
    spent: 150,
    owner_id: null,
    audience: "Inbound Trial Signups",
    channels: ["Email Marketing", "WhatsApp"],
    status: "active",
    start_date: "2026-07-01",
    end_date: "2026-09-30",
    roi: 480,
    created_at: new Date().toISOString()
  }
];

export async function GET() {
  try {
    const { data: campaigns, error } = await supabaseAdmin
      .from("campaigns")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ campaigns: MOCK_CAMPAIGNS });
    }

    return NextResponse.json({ campaigns: campaigns.length > 0 ? campaigns : MOCK_CAMPAIGNS });
  } catch (error: any) {
    return NextResponse.json({ campaigns: MOCK_CAMPAIGNS });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, objective, budget, spent, owner_id, audience, channels, status, start_date, end_date, roi } = body;

    const { data, error } = await supabaseAdmin
      .from("campaigns")
      .insert([{
        name,
        objective,
        budget: budget || 0,
        spent: spent || 0,
        owner_id,
        audience,
        channels: channels || [],
        status: status || "draft",
        start_date,
        end_date,
        roi: roi || 0
      }])
      .select()
      .single();

    if (error) {
      // Return synthetic data as success fallback for frontend previewing
      const syntheticCampaign = {
        id: crypto.randomUUID(),
        name,
        objective,
        budget: budget || 0,
        spent: spent || 0,
        owner_id,
        audience,
        channels: channels || [],
        status: status || "draft",
        start_date: start_date || new Date().toISOString().split("T")[0],
        end_date: end_date || new Date().toISOString().split("T")[0],
        roi: roi || 0,
        created_at: new Date().toISOString()
      };
      return NextResponse.json({ campaign: syntheticCampaign, synthetic: true });
    }

    return NextResponse.json({ campaign: data });
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
      .from("campaigns")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ campaign: { id, ...body }, synthetic: true });
    }

    return NextResponse.json({ campaign: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
