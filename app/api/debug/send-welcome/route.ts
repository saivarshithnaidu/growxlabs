import { NextResponse } from "next/server";
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    const templatePath = path.join(process.cwd(), 'public', 'templates', 'welcome_email.html');
    const html = fs.readFileSync(templatePath, 'utf8');

    const { data, error } = await resend.emails.send({
      from: 'GrowXLabsTech <onboarding@growxlabs.tech>',
      to: 'saivarshith8284@gmail.com',
      subject: 'Welcome to GrowXLabsTech 🚀',
      html: html.replace('[Client Name]', 'Sai Varshith').replace('[Project Name]', 'Your Project'),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
