import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    
    const { code, discount_type, discount_value, min_purchase, expires_at } = body;

    if (!code || !discount_type || !discount_value) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("coupons")
      .insert([
        {
          code: code.toUpperCase(),
          discount_type,
          discount_value: parseInt(discount_value),
          min_purchase: parseInt(min_purchase || 0),
          expires_at: expires_at ? new Date(expires_at).toISOString() : null,
          is_active: true
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Coupon Creation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const { error } = await supabase
      .from("coupons")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const { id, is_active } = body;

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const { data, error } = await supabase
      .from("coupons")
      .update({ is_active })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
