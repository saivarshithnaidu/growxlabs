import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const { count, error } = await supabase
      .from("leads")
      .select("*", { count: 'exact', head: true });

    return NextResponse.json({ 
      service: "Diagnostics",
      leads_count: count,
      error: error?.message,
      env_url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "SET" : "MISSING",
      env_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "SET" : "MISSING"
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message });
  }
}
