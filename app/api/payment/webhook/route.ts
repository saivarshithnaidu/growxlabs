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
      const orderId = payment.order_id;

      // 1. Find Invoice by Razorpay Order ID
      const { data: invoice, error: invError } = await supabaseAdmin
        .from("invoices")
        .select("*, clients(*)")
        .eq("razorpay_order_id", orderId)
        .single();

      if (invError || !invoice) throw new Error("Invoice not found");

      // 2. Update Invoice Status
      await supabaseAdmin
        .from("invoices")
        .update({
          status: "paid",
          payment_id: payment.id,
          advance_paid: true
        })
        .eq("id", invoice.id);

      // 3. Create Project Entry
      const { data: project } = await supabaseAdmin
        .from("projects")
        .insert([{
          client_id: invoice.client_id,
          title: `Project: ${invoice.clients.business_name}`,
          status: "active",
          progress: 10
        }])
        .select()
        .single();

      // 4. Trigger Onboarding Email
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

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
