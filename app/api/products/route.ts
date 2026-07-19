import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let query = supabaseAdmin.from("products").select("*");
    if (category) query = query.eq("category", category);

    const { data: products, error } = await query.order("name", { ascending: true });
    if (error) throw error;

    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch product catalog" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data: product, error } = await supabaseAdmin
      .from("products")
      .insert(body)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to add product" }, { status: 400 });
  }
}
