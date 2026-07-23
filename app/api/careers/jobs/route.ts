import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const { data: jobs, error } = await supabaseAdmin
      .from("recruitment_jobs")
      .select("id, title, description, salary_range, requirements, created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    // Fallback default jobs list if database table is empty or missing rows
    const fallbackJobs = [
      {
        id: "sdr-intern",
        title: "Sales Development Representative (SDR)",
        description: "Drive outbound B2B sales by researching prospects, initiating conversations on LinkedIn/Email, qualifying leads, and scheduling discovery calls.",
        salary_range: "Performance-Based Incentives",
        requirements: ["Communication", "Outreach", "LinkedIn", "B2B Sales"]
      }
    ];

    const results = jobs && jobs.length > 0 ? jobs : fallbackJobs;

    return NextResponse.json({ jobs: results });
  } catch (error: any) {
    console.error("Public jobs fetch error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch jobs" }, { status: 500 });
  }
}
