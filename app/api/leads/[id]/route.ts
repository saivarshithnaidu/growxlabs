import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

const VALID_LEAD_COLUMNS = [
  'business_name', 'name', 'email', 'phone', 'website_url', 
  'has_website', 'instagram_followers', 'linkedin_url', 
  'google_rating', 'lead_score', 'status', 'city', 'notes', 
  'assigned_to'
];

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // 1. Validate ID (Basic presence check, Supabase handles UUID typing)
    if (!id) {
      return NextResponse.json({ error: "Lead ID is required" }, { status: 400 });
    }

    const body = await req.json();
    
    // 2. Filter data to only include valid columns to prevent Supabase 400 errors
    // This allows the frontend to send draft/computed fields without crashing the update
    const updateData: Record<string, any> = {};
    
    Object.keys(body).forEach(key => {
      if (VALID_LEAD_COLUMNS.includes(key)) {
        updateData[key] = body[key];
      }
    });

    if (Object.keys(updateData).length === 0) {
      console.warn(`[API] No valid columns to update for lead ${id}`, body);
      // We still update updated_at if anything was sent even if no valid columns matched
      // to acknowledge the heartbeat/attempt
    }

    console.log(`[API] Updating Lead ${id} with filtered data:`, updateData);
    
    // 3. Update Database
    const { data, error } = await supabaseAdmin
      .from("leads")
      .update({ 
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[DATABASE ERROR DEBUG]:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return NextResponse.json({ 
        error: `Database Error: ${error.message}`,
        details: error.details,
        code: error.code
      }, { status: 500 });
    }

    console.log(`[API] Successfully updated lead ${id}`);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("[API CATCH ERROR]:", error);
    return NextResponse.json({ error: `Server Error: ${message}` }, { status: 500 });
  }
}
