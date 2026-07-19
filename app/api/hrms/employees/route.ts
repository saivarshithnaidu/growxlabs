import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  try {
    const { data: employees, error } = await supabaseAdmin
      .from("employees")
      .select("*, department:departments(name)")
      .order("full_name", { ascending: true });

    if (error) throw error;
    return NextResponse.json({ employees });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch employees list" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data: emp, error } = await supabaseAdmin
      .from("employees")
      .insert(body)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ employee: emp }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create employee" }, { status: 400 });
  }
}
