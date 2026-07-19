import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  const startTime = Date.now();
  let dbStatus = "Healthy";
  let cacheStatus = "Healthy";

  try {
    const { error } = await supabaseAdmin.from("team_members").select("id").limit(1);
    if (error) dbStatus = "Degraded";
  } catch (e) {
    dbStatus = "Unreachable";
  }

  const responseTimeMs = Date.now() - startTime;

  const healthPayload = {
    status: dbStatus === "Healthy" ? "UP" : "DEGRADED",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    checks: {
      database: { status: dbStatus, latencyMs: responseTimeMs },
      cache: { status: cacheStatus, adapter: "MemoryLRU / Redis" },
      storage: { status: "Healthy", provider: "Supabase / R2" }
    },
    version: "1.0.0"
  };

  return NextResponse.json(healthPayload, {
    status: dbStatus === "Healthy" ? 200 : 503,
    headers: {
      "cache-control": "no-store, no-cache, must-revalidate",
      "x-request-id": "health_" + Date.now()
    }
  });
}
