import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      courseId 
    } = await req.json();

    // 1. Verify Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("Signature mismatch. Payment verification failed.");
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    // 2. Grant access to course
    const supabase = await createClient();
    const userId = (session.user as any).id;

    // Support bundles (Logic for 'java-python-bundle')
    const coursesToEnroll = courseId === "java-python-bundle" 
      ? ["java-mastery", "python-mastery"] 
      : [courseId];

    for (const id of coursesToEnroll) {
      // Ensure course exists in metadata table first (Optional but safe)
      // For now we assume they exist as we'll seed them.
      
      const { error } = await supabase
        .from("enrollments")
        .upsert({
          user_id: userId,
          course_id: id,
          status: "active",
          enrolled_at: new Date().toISOString()
        }, {
           onConflict: 'user_id,course_id'
        });

      if (error) {
        console.error(`Enrollment failed for ${id}:`, error);
        // We continue for others if it's a bundle
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[COURSE_VERIFY_ERROR]", error);
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
  }
}
