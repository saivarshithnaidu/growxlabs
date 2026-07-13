import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";
import { getToken } from "next-auth/jwt";

export async function POST(req: Request) {
  try {
    // 1. Session authorization
    const token = await getToken({
      req: req as any,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { toEmail, fromName, fromEmail, subject, body, leadId } = await req.json();

    if (!toEmail || !fromName || !fromEmail || !subject || !body) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "your_resend_key_here") {
      return NextResponse.json({ error: "Resend API key is not configured on the server." }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send the dynamic email using Resend (using clean, minimal layout to land in Primary inbox)
    const { data, error: sendError } = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: [toEmail],
      subject: subject,
      text: body, // Plain text is highly favored by Gmail's Primary tab algorithm
      html: body.replace(/\n/g, "<br />") // Very lightweight HTML with no wrapper divs or inline styles
    });

    if (sendError) {
      console.error("Resend API Error:", sendError);
      return NextResponse.json({ error: sendError.message }, { status: 500 });
    }

    // 2. Update lead status in Supabase if leadId is provided
    if (leadId) {
      const supabase = await createClient();
      await supabase
        .from("leads")
        .update({
          status: "contacted",
          outreach_channel: "email",
          follow_up_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days follow up
          notes: `Sent dynamic email via GrowX Server from "${fromName} <${fromEmail}>" on ${new Date().toLocaleDateString()}`
        })
        .eq("id", leadId);
    }

    return NextResponse.json({ success: true, messageId: data?.id });

  } catch (error: any) {
    console.error("Dynamic Outreach API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
