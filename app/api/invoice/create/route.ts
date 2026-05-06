import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { PDFService } from "@/lib/services/pdf.service";
import { RazorpayService } from "@/lib/services/razorpay.service";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // 1. Create Invoice in DB
    const { data: invoice, error: invError } = await supabaseAdmin
      .from("invoices")
      .insert([{
        client_name: data.client_name,
        client_email: data.client_email,
        client_phone: data.client_phone,
        business_name: data.business_name,
        project_name: data.project_name,
        invoice_number: data.invoice_number,
        amount: data.amount,
        subtotal: data.subtotal,
        currency: data.currency,
        balance_due: data.balance_due ?? data.amount, // Use provided balance or default to total
        status: data.status || "pending",
        due_date: data.due_date,
        items: data.items,
        notes: data.notes,
        payment_type: data.payment_type,
        razorpay_link: data.razorpay_link
      }])
      .select()
      .single();

    if (invError) throw invError;

    // 2. Generate PDF (Optional backend fallback, though dashboard uses window.print() for primary)
    try {
        const pdfUrl = await PDFService.generateInvoice({
          ...invoice,
          invoice_id: invoice.invoice_number || invoice.id.slice(0, 8).toUpperCase()
        });

        // 3. Update Invoice with PDF
        await supabaseAdmin
          .from("invoices")
          .update({ pdf_url: pdfUrl })
          .eq("id", invoice.id);
          
        invoice.pdf_url = pdfUrl;
    } catch (pdfErr) {
        console.warn("PDF Generation failed, but invoice saved:", pdfErr);
    }

    return NextResponse.json({ 
      success: true, 
      invoiceId: invoice.id,
      invoice: invoice
    });
  } catch (error: any) {
    console.error("Invoice API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
