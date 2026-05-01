import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { RazorpayService } from "@/lib/services/razorpay.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { 
      productId, 
      productType, 
      amount, 
      couponCode, 
      billingDetails 
    } = await req.json();

    const supabase = supabaseAdmin;

    // 1. Save / Update Billing Details
    await supabase.from("billing_details").upsert({
      user_id: session.user.id,
      ...billingDetails,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });

    // 2. Handle Coupon (Double validation on server)
    let finalAmount = amount;
    let discountAmount = 0;
    let couponId = null;

    if (couponCode) {
      const { data: coupon } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", couponCode)
        .eq("is_active", true)
        .single();

      if (coupon && (!coupon.expires_at || new Date(coupon.expires_at) > new Date())) {
        couponId = coupon.id;
        if (coupon.discount_type === "percentage") {
          discountAmount = Math.floor((amount * coupon.discount_value) / 100);
        } else {
          discountAmount = coupon.discount_value;
        }
        finalAmount = Math.max(0, amount - discountAmount);
      }
    }

    // 3. Create Razorpay Order
    // Razorpay amount is in paise
    const razorpayOrder = await RazorpayService.createOrder(
      finalAmount, 
      `order_${Date.now()}`,
      { 
        productId, 
        productType, 
        userEmail: session.user?.email,
        userId: session.user?.id
      }
    );

    // 4. Record Unified Order in Database
    const { data: order, error: orderError } = await supabase.from("orders").insert({
      user_id: session.user.id,
      product_id: productId,
      product_type: productType,
      original_price: amount,
      discount_amount: discountAmount,
      final_amount: finalAmount,
      coupon_id: couponId,
      razorpay_order_id: razorpayOrder.id,
      status: 'pending',
      billing_snapshot: billingDetails
    }).select().single();

    if (orderError) throw orderError;

    return NextResponse.json({ 
       success: true, 
       orderId: razorpayOrder.id,
       amount: finalAmount * 100, // paise
       key: process.env.RAZORPAY_KEY_ID 
    });

  } catch (error: any) {
    console.error("[CREATE_ORDER_ERROR]:", error);
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 });
  }
}
