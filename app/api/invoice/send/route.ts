import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase/admin";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { invoiceId, email } = await req.json();

    const { data: invoice, error } = await supabaseAdmin
      .from("invoices")
      .select("*, users(*)")
      .eq("id", invoiceId)
      .single();

    if (error || !invoice) {
      console.error("Fetch invoice error:", error);
      throw new Error("Invoice not found");
    }

    const targetEmail = email || (invoice.users ? invoice.users.email : null);
    if (!targetEmail) throw new Error("No destination email address found");

    await resend.emails.send({
      from: "GrowX Labs Billing <billing@growxlabs.tech>",
      to: targetEmail,
      subject: `Invoice ${invoice.invoice_number || invoice.id.slice(0, 8).toUpperCase()} from GrowX Labs`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #0D1B4B;">Invoice from GrowX Labs</h2>
          <p>Hello ${invoice.users ? invoice.users.name : 'Client'},</p>
          <p>An invoice has been generated for your project: <strong>${invoice.description || 'Project Services'}</strong>.</p>
          <p><strong>Amount Due: $${Number(invoice.amount).toLocaleString()}</strong></p>
          <p><strong>Due Date: ${invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'N/A'}</strong></p>
          <br />
          <a href="${invoice.pdf_url}" style="background: #0D1B4B; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin-right: 10px;">View Invoice PDF</a>
          <br />
          <p>Status: ${invoice.status.toUpperCase()}</p>
          <p>Thank you for choosing GrowX Labs.</p>
        </div>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Email Send Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
