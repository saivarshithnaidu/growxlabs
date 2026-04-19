import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase/admin";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { proposalId } = await req.json();

    const { data: proposal, error } = await supabaseAdmin
      .from("proposals")
      .select("*")
      .eq("id", proposalId)
      .single();

    if (error || !proposal) throw new Error("Proposal not found");

    // In a real scenario, we'd need the client email. 
    // For now, we'll try to find a client by name or default to a safe place.
    const { data: client } = await supabaseAdmin
      .from("clients")
      .select("email")
      .eq("business_name", proposal.business_name)
      .single();

    const targetEmail = client?.email || "valuable-prospect@growxlabs.tech";

    await resend.emails.send({
      from: "GrowX Labs Partnerships <partners@growxlabs.tech>",
      to: targetEmail,
      subject: `Project Proposal: ${proposal.business_name} x GrowX Labs`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #0D1B4B;">GrowX Labs | Proposal</h2>
          <p>Hello ${proposal.client_name},</p>
          <p>It was a pleasure discussing your vision for <strong>${proposal.business_name}</strong>.</p>
          <p>We've prepared a comprehensive technical proposal to solve your digital bottlenecks and accelerate your growth.</p>
          <br />
          <p><strong>Package Recommended:</strong> ${proposal.selected_package.toUpperCase()}</p>
          <p><strong>Validity:</strong> 7 Days</p>
          <br />
          <p>You can review the full breakdown and next steps in the attached proposal.</p>
          <p>Looking forward to building something extraordinary together.</p>
          <br />
          <p>Best Regards,</p>
          <p><strong>Varshith Pujala</strong><br />GrowX Labs Engineering</p>
        </div>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Proposal Send Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
