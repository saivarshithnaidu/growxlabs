import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    
    // The user considers 'leads' to be their real clients/records for now.
    // Fetching from leads table to ensure 'varshith' and others are visible.
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Map lead fields to match the UI expectations if necessary
    const mappedData = data.map((lead: any) => ({
      ...lead,
      // Ensure specific fields expected by the UI are present
      organization: lead.name, 
      joined: lead.created_at
    }));

    return NextResponse.json(mappedData);
  } catch (error: any) {
    console.error("Critical Clients API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

