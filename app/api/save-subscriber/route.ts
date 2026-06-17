import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    if (!emailPattern.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    const { error: supabaseError } = await supabaseAdmin
      .from("wish_subscribers")
      .upsert({ name, email }, { onConflict: "email" });

    if (supabaseError) {
      console.error("Wish subscriber Supabase error:", supabaseError);
      return NextResponse.json({ error: "Could not save subscriber." }, { status: 500 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (resendApiKey && audienceId) {
      const resend = new Resend(resendApiKey);
      const { error: createContactError } = await resend.contacts.create({
        audienceId,
        email,
        firstName: name,
        unsubscribed: false,
      });

      if (createContactError) {
        const { error: updateContactError } = await resend.contacts.update({
          audienceId,
          email,
          firstName: name,
          unsubscribed: false,
        });

        if (updateContactError) {
          console.error("Wish subscriber Resend error:", updateContactError);
          return NextResponse.json({ error: "Could not add subscriber to audience." }, { status: 502 });
        }
      }
    } else {
      console.warn("RESEND_API_KEY or RESEND_AUDIENCE_ID is missing. Subscriber saved without Resend sync.");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Wish subscriber API error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
