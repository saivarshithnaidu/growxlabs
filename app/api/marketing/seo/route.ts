import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const MOCK_KEYWORDS = [
  { id: "1", keyword: "sales CRM tools", search_volume: 8500, difficulty: 64, position: 3, organic_traffic: 940 },
  { id: "2", keyword: "inbound marketing automation", search_volume: 3200, difficulty: 48, position: 2, organic_traffic: 450 },
  { id: "3", keyword: "free lead scraper", search_volume: 12000, difficulty: 72, position: 8, organic_traffic: 680 },
  { id: "4", keyword: "lead qualifying scoring engine", search_volume: 950, difficulty: 25, position: 1, organic_traffic: 180 },
  { id: "5", keyword: "GrowXLabs solutions", search_volume: 2400, difficulty: 5, position: 1, organic_traffic: 1200 }
];

const MOCK_SEO_REPORT = {
  score: 88,
  critical_issues: [
    "Missing Alt text on 4 images on product page",
    "Slow server response time on landing page",
    "Missing Schema markup on blogs list"
  ],
  technical_seo: {
    sitemap: "active",
    robots: "active",
    ssl: "valid",
    indexing: "14 pages indexed"
  },
  page_speed: {
    performance: 78,
    accessibility: 92,
    best_practices: 89,
    seo: 95
  }
};

export async function GET() {
  try {
    const { data: keywords } = await supabaseAdmin.from("seo_keywords").select("*");
    const { data: reports } = await supabaseAdmin.from("seo_reports").select("*").limit(1);

    return NextResponse.json({
      keywords: keywords && keywords.length > 0 ? keywords : MOCK_KEYWORDS,
      report: reports && reports.length > 0 ? reports[0] : MOCK_SEO_REPORT
    });
  } catch (error) {
    return NextResponse.json({
      keywords: MOCK_KEYWORDS,
      report: MOCK_SEO_REPORT
    });
  }
}
