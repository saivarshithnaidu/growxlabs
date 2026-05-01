import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { RazorpayService } from "@/lib/services/razorpay.service";

const COURSE_PRICES: Record<string, number> = {
  "ai-engineering": 1999,
  "java-mastery": 799,
  "python-mastery": 499,
  "nextjs-fullstack": 899,
  "java-python-bundle": 999
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await req.json();

    const price = COURSE_PRICES[courseId];
    if (!price) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }

    // Use RazorpayService to create order
    // Receipt ID can be courseId + timestamp
    const receipt = `course_${courseId}_${Date.now()}`;
    console.log("[PURCHASE] Creating order for:", { courseId, price, receipt, userId: session.user.email });
    
    const order = await RazorpayService.createOrder(price, receipt, { courseId, userEmail: session.user.email });

    return NextResponse.json({
      orderId: order.id,
      amount: price * 100, // in paise
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error: any) {
    console.error("[COURSE_PURCHASE_ERROR]", error);
    return NextResponse.json({ 
      error: error.message || "Failed to create order",
      details: error.description || null 
    }, { status: 500 });
  }
}
