import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { code, amount } = await req.json();
    const supabase = await createClient();

    const { data: coupon, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", code)
      .eq("is_active", true)
      .single();

    if (error || !coupon) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 400 });
    }

    // Check expiry
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
    }

    // Check minimum purchase
    if (amount < (coupon.min_purchase || 0)) {
       return NextResponse.json({ error: `Minimum purchase of ₹${coupon.min_purchase} required` }, { status: 400 });
    }

    let discount = 0;
    if (coupon.discount_type === "percentage") {
      discount = Math.floor((amount * coupon.discount_value) / 100);
    } else {
      discount = coupon.discount_value;
    }

    const finalAmount = Math.max(0, amount - discount);

    return NextResponse.json({ 
      success: true, 
      couponId: coupon.id,
      discount,
      finalAmount
    });

  } catch (error: any) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
