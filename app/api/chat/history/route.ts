import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const session_id = searchParams.get("session_id");
    
    if (!session_id) throw new Error("session_id is required");

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .eq("session_id", session_id)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Chat History API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
