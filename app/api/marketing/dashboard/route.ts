import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req: Request) {
  try {
    // 1. Try to query database values (with try-catch to fallback on mock if tables are not migrated yet)
    let marketingLeadsCount = 0;
    let mqlCount = 0;
    let sqlCount = 0;
    let campaignsCount = 0;
    
    try {
      const { count: leadsCount } = await supabaseAdmin
        .from("marketing_leads")
        .select("*", { count: "exact", head: true });
      
      const { count: mqls } = await supabaseAdmin
        .from("marketing_leads")
        .select("*", { count: "exact", head: true })
        .eq("status", "MQL");

      const { count: sqls } = await supabaseAdmin
        .from("marketing_leads")
        .select("*", { count: "exact", head: true })
        .eq("status", "SQL");

      const { count: camps } = await supabaseAdmin
        .from("campaigns")
        .select("*", { count: "exact", head: true });

      marketingLeadsCount = leadsCount || 0;
      mqlCount = mqls || 0;
      sqlCount = sqls || 0;
      campaignsCount = camps || 0;
    } catch (dbErr) {
      console.log("Database tables for marketing not yet fully active, using synthetic data fallbacks.");
    }

    // Combine database statistics with rich marketing metrics
    const dashboardStats = {
      visitors: 45280,
      newLeads: marketingLeadsCount || 1240,
      mql: mqlCount || 342,
      sql: sqlCount || 128,
      conversionRate: 2.74,
      campaignPerformance: [
        { name: "Google Ads Summer Blast", channel: "Google Ads", clicks: 1240, leads: 92, conversion: 7.42, spent: 1200, roi: 240 },
        { name: "LinkedIn Enterprise Outreach", channel: "LinkedIn Ads", clicks: 450, leads: 48, conversion: 10.6, spent: 2500, roi: 180 },
        { name: "Meta Product Reel Retargeting", channel: "Meta Ads", clicks: 3120, leads: 110, conversion: 3.52, spent: 800, roi: 310 },
        { name: "Drip Nurture Campaign v2", channel: "Email Marketing", clicks: 1890, leads: 342, conversion: 18.1, spent: 50, roi: 1250 }
      ],
      emailOpenRate: 22.4,
      clickRate: 3.8,
      landingPageConversions: 8.5,
      socialEngagement: {
        likes: 12400,
        shares: 3480,
        comments: 1850,
        growth: 14.2
      },
      adSpend: 4500,
      roi: 245,
      cac: 35.5,
      cpl: 8.2,
      leadsBySource: [
        { source: "Google Ads", count: 480, color: "#4285F4" },
        { source: "Meta Ads", count: 320, color: "#1877F2" },
        { source: "LinkedIn Ads", count: 180, color: "#0A66C2" },
        { source: "Email Campaigns", count: 210, color: "#10B981" },
        { source: "Organic Search (SEO)", count: 350, color: "#F59E0B" },
        { source: "Referral / Offline", count: 90, color: "#8B5CF6" }
      ]
    };

    return NextResponse.json(dashboardStats);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
