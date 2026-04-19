import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // 1. Validate ID
    if (!id || id === 'undefined') {
      console.error("API ERROR: Lead ID is undefined");
      return NextResponse.json({ error: "Lead ID is required" }, { status: 400 });
    }

    // Basic UUID validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      console.error("API ERROR: Invalid lead ID format", id);
      return NextResponse.json({ error: "Invalid lead ID format" }, { status: 400 });
    }

    // 2. Parse Body
    const body = await request.json();
    const { status, notes } = body;

    console.log(`API: Updating Lead ${id} -> Status: ${status}`);

    // 3. Update Database
    const { data, error } = await supabaseAdmin
      .from("leads")
      .update({ 
        status, 
        notes,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("DATABASE ERROR:", error);
      throw error;
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Lead Update Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id || id === 'undefined') {
      return NextResponse.json({ error: "Lead ID is required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("leads")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Lead Fetch Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
