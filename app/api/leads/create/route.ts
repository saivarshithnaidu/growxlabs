import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, id: userId } = session.user as any;
    const body = await req.json();
    
    // Auto-assign to the agent if they are creating it
    const leadData = {
      ...body,
      assigned_to: role === 'crm_agent' ? userId : body.assigned_to || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabaseAdmin
      .from("leads")
      .insert([leadData])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Lead Create Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
