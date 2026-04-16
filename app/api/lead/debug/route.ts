import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    // Fetch directly using ANON key
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    return NextResponse.json({ 
      source: "Supabase Headless Fetch",
      count: data?.length || 0,
      error: error?.message,
      data: data || []
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message });
  }
}
