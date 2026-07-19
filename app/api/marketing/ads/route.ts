import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const MOCK_AD_ACCOUNTS = [
  {
    id: "ad1",
    platform: "Google Ads",
    account_name: "GrowXLabs Global Search",
    status: "active",
    campaigns: [
      { name: "Brand Keyword Search", budget: 3000, spend: 1850, clicks: 1240, conversions: 92, status: "running" },
      { name: "Competitor Alternatives", budget: 5000, spend: 4100, clicks: 2150, conversions: 110, status: "running" }
    ]
  },
  {
    id: "ad2",
    platform: "Meta Ads",
    account_name: "GrowXLabs Retargeting & Video",
    status: "active",
    campaigns: [
      { name: "Product Demo Reel", budget: 4000, spend: 3200, clicks: 4200, conversions: 185, status: "paused" },
      { name: "C-Level Audience Retargeting", budget: 2000, spend: 850, clicks: 920, conversions: 48, status: "running" }
    ]
  },
  {
    id: "ad3",
    platform: "LinkedIn Ads",
    account_name: "GrowXLabs ABM Enterprise",
    status: "active",
    campaigns: [
      { name: "CTO Ebook Download", budget: 10000, spend: 6800, clicks: 880, conversions: 74, status: "running" }
    ]
  }
];

export async function GET() {
  try {
    const { data: accounts } = await supabaseAdmin.from("ad_accounts").select(`
      *,
      ad_campaigns(*)
    `);

    if (accounts && accounts.length > 0) {
      return NextResponse.json({ adAccounts: accounts });
    }
  } catch (e) {
    console.log("Ad accounts database tables not active");
  }

  return NextResponse.json({ adAccounts: MOCK_AD_ACCOUNTS });
}
