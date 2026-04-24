import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { RazorpayService } from "@/lib/services/razorpay.service";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    const isValid = RazorpayService.verifyWebhookSignature(
      body, 
      signature, 
      process.env.RAZORPAY_WEBHOOK_SECRET!
    );

    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);
    
    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const notes = payment.notes || {};
      const orderId = payment.order_id;

      // --- LOGIC 1: COURSE ENROLLMENT ---
      if (notes.courseId) {
        const courseId = notes.courseId;
        const email = notes.userEmail || payment.email;
        
        console.log(`[WEBHOOK] Processing course enrollment for ${email} -> ${courseId}`);

        // 1. Get User ID by email
        const { data: user, error: userError } = await supabaseAdmin
          .from("users")
          .select("id")
          .eq("email", email)
          .single();

        if (userError || !user) {
          console.error(`[WEBHOOK] User not found for email ${email}`);
          // We can't throw here as it might be an invoice payment too, 
          // but if courseId exists, we should probably handle it.
        } else {
          // 2. Handle Bundles
          const courseIds = courseId === "java-python-bundle" 
            ? ["java-mastery", "python-mastery"] 
            : [courseId];

          for (const id of courseIds) {
            await supabaseAdmin
              .from("enrollments")
              .upsert({
                user_id: user.id,
                course_id: id,
                status: "active",
                purchased_at: new Date().toISOString()
              }, { onConflict: 'user_id,course_id' });
          }
          console.log(`[WEBHOOK] Successfully enrolled ${email} in ${courseIds.join(", ")}`);
        }
      }

      // --- LOGIC 2: INVOICE PAYMENT (Existing) ---
      if (orderId && !notes.courseId) {
        // Find Invoice by Razorpay Order ID
        const { data: invoice, error: invError } = await supabaseAdmin
          .from("invoices")
          .select("*, clients(*)")
          .eq("razorpay_order_id", orderId)
          .single();

        if (invoice) {
          // Update Invoice Status
          await supabaseAdmin
            .from("invoices")
            .update({
              status: "paid",
              payment_id: payment.id,
              advance_paid: true
            })
            .eq("id", invoice.id);

          // Create Project Entry
          await supabaseAdmin
            .from("projects")
            .insert([{
              client_id: invoice.client_id,
              title: `Project: ${invoice.clients.business_name}`,
              status: "active",
              progress: 10
            }]);

          // Trigger Onboarding Email
          await resend.emails.send({
            from: "GrowX Labs <welcome@growxlabs.tech>",
            to: invoice.clients.email,
            subject: "Welcome to GrowX Labs - Next Steps",
            html: `
              <div style="font-family: sans-serif; padding: 20px;">
                <h1 style="color: #000;">Payment Confirmed.</h1>
                <p>Welcome to the family. Your project is now officially ACTIVE.</p>
                <p>Please complete the onboarding form to help us start the engineering phase:</p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/onboarding" style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0;">Start Onboarding</a>
              </div>
            `
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
