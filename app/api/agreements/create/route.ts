import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { PDFService } from "@/lib/services/pdf.service";
import { getBaseUrl } from "@/lib/utils";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // 1. Get Client Details
    const { data: client, error: clientError } = await supabaseAdmin
      .from("clients")
      .select("*")
      .eq("id", data.client_id)
      .single();

    if (clientError || !client) throw new Error("Client not found");

    // 2. Create Agreement Record in DB
    const { data: agreement, error: aggError } = await supabaseAdmin
      .from("agreements")
      .insert([{
        client_id: data.client_id,
        service_type: data.service_type,
        project_description: data.project_description,
        total_amount: data.total_amount,
        advance_amount: data.advance_amount,
        balance_amount: Number(data.total_amount) - Number(data.advance_amount),
        start_date: data.start_date || null,
        delivery_date: data.delivery_date || null,
        status: "sent"
      }])
      .select()
      .single();

    if (aggError) throw aggError;

    // 3. Generate PDF
    const pdfUrl = await PDFService.generateAgreement({
      ...agreement,
      client_name: client.name,
      business_name: client.business_name
    });

    // 4. Update Agreement with PDF URL
    await supabaseAdmin
      .from("agreements")
      .update({ pdf_url: pdfUrl })
      .eq("id", agreement.id);

    // 5. Trigger Initial Advance Invoice
    try {
      if (agreement.advance_amount > 0) {
        await fetch(`${getBaseUrl()}/api/invoice/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            client_id: agreement.client_id,
            agreement_id: agreement.id,
            amount: agreement.advance_amount,
            description: `Advance Payment for ${agreement.service_type}`,
            due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
          })
        });
      }
    } catch (invErr) {
      console.error("AUTO-INVOICE FAILED:", invErr);
      // Don't throw, we want the agreement to succeed even if auto-invoice has an issue
    }

    // 6. Send Email via Resend
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://growxlabs.tech";
    await resend.emails.send({
      from: "GrowX Labs Partners <partners@growxlabs.tech>",
      to: client.email,
      subject: `Partnership Agreement: ${data.service_type}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #000;">Hello ${client.name},</h2>
          <p>We've prepared the partnership agreement for your upcoming project with GrowX Labs.</p>
          <p>You can review and accept the agreement directly in your portal, or view the attached PDF.</p>
          <a href="${appUrl}/client/agreement" style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0;">Sign Agreement</a>
        </div>
      `,
      attachments: [{ filename: 'agreement.pdf', path: pdfUrl }]
    });

    return NextResponse.json({ success: true, agreementId: agreement.id, pdfUrl });
  } catch (error: any) {
    console.error("Agreement API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
