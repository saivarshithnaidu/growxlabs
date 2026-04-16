import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { session_id, role, message } = await req.json();
    const supabase = await createClient();

    const { error } = await supabase.from("chats").insert([{
      session_id,
      role,
      message
    }]);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Chat Save API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
