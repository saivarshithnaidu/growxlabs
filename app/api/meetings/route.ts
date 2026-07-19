import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  try {
    const { data: meetings, error } = await supabaseAdmin
      .from("meetings")
      .select("*, attendees:meeting_attendees(*)")
      .order("start_time", { ascending: true });
    
    if (error) throw error;
    return NextResponse.json({ meetings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch meetings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { attendees, ...meetingData } = await request.json();
    
    // 1. Insert meeting header
    const { data: meeting, error } = await supabaseAdmin
      .from("meetings")
      .insert(meetingData)
      .select()
      .single();
    
    if (error) throw error;

    // 2. Insert attendees (if any)
    if (Array.isArray(attendees) && attendees.length > 0) {
      const attendeesRecords = attendees.map((att: any) => ({
        meeting_id: meeting.id,
        contact_id: att.contact_id || null,
        team_member_id: att.team_member_id || null,
        status: "invited"
      }));
      await supabaseAdmin.from("meeting_attendees").insert(attendeesRecords);
    }

    return NextResponse.json({ meeting }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to schedule meeting" }, { status: 400 });
  }
}
