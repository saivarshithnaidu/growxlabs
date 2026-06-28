import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { Resend } from "resend";

// Helper to validate YYYY-MM-DD date format
const isValidDate = (dateStr: string) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  const d = new Date(dateStr);
  return d instanceof Date && !isNaN(d.getTime());
};

// 1. GET: Fetch booked slots for a specific date
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    if (!date || !isValidDate(date)) {
      return NextResponse.json(
        { error: "A valid date parameter (YYYY-MM-DD) is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("bookings")
      .select("time_slot")
      .eq("booking_date", date)
      .neq("status", "cancelled");

    if (error) {
      console.error("Database query error:", error);
      
      // If table doesn't exist yet, return a clear developer notification
      if (error.message.includes("does not exist") || error.code === "P0001") {
        return NextResponse.json(
          { 
            error: "Database table 'bookings' is missing. Please run the SQL script in your Supabase Dashboard SQL Editor.",
            requiresSetup: true
          },
          { status: 501 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const bookedSlots = data ? data.map((b: any) => b.time_slot) : [];
    return NextResponse.json({ bookedSlots }, { status: 200 });

  } catch (error: any) {
    console.error("GET bookings error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// 2. POST: Insert booking, create Lead, and send Email via Resend
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, date, timeSlot, notes } = body;

    // Validation checks
    if (!name || !email || !date || !timeSlot) {
      return NextResponse.json(
        { error: "Name, email, date, and time slot are required fields" },
        { status: 400 }
      );
    }

    if (!isValidDate(date)) {
      return NextResponse.json(
        { error: "Invalid date format (must be YYYY-MM-DD)" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address format" },
        { status: 400 }
      );
    }

    // Insert booking into bookings table
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("bookings")
      .insert([
        {
          name,
          email,
          booking_date: date,
          time_slot: timeSlot,
          notes: notes || null,
          status: "confirmed"
        }
      ])
      .select()
      .single();

    if (bookingError) {
      console.error("Insert booking error:", bookingError);
      
      // Check for PostgreSQL unique constraint violation (code 23505)
      if (bookingError.code === "23505") {
        return NextResponse.json(
          { error: "This slot is already booked. Please choose another date or time." },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { error: bookingError.message || "Failed to save booking." },
        { status: 500 }
      );
    }

    // Insert booking as a high-intent CRM Lead in leads table
    const leadPayload = {
      name,
      email,
      business_name: name,
      message: `### 🗓️ Strategy Call Booked\n- **Date:** ${date}\n- **Time:** ${timeSlot}\n\n**Notes/Project Brief:**\n${notes || "No notes provided."}`,
      status: "new",
      lead_score: 8, // High rating due to calendar commitment
      source: "Booking Scheduler"
    };

    const { error: leadError } = await supabaseAdmin
      .from("leads")
      .insert([leadPayload]);

    if (leadError) {
      console.error("Failed to insert lead, but booking was saved:", leadError);
    }

    // Send email notification using Resend
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "your_resend_key_here") {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        // Format date nicely (e.g. "Monday, June 29, 2026")
        const formattedDate = new Date(date).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        });

        await resend.emails.send({
          from: "GrowX Labs <onboarding@resend.dev>", // Sandbox sender default
          to: [email],
          subject: "Strategy Call Confirmed | GrowX Labs",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e4e4e7; border-radius: 12px; color: #18181b; background-color: #ffffff;">
              <h2 style="font-size: 24px; font-weight: 800; letter-spacing: -0.05em; margin-bottom: 20px; color: #000;">GrowX Labs</h2>
              <p>Hi <strong>${name}</strong>,</p>
              <p>Your 30-minute Strategy Call with GrowX Labs has been successfully scheduled! We look forward to exploring and building your next AI-powered product.</p>
              
              <div style="background-color: #f4f4f5; border-left: 4px solid #c0f0fb; padding: 20px; border-radius: 6px; margin: 25px 0;">
                <h4 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 700;">Meeting Details:</h4>
                <p style="margin: 0; font-size: 14px;">📅 <strong>Date:</strong> ${formattedDate}</p>
                <p style="margin: 5px 0 0 0; font-size: 14px;">⏰ <strong>Time:</strong> ${timeSlot} (IST)</p>
                <p style="margin: 5px 0 0 0; font-size: 14px;">📍 <strong>Platform:</strong> Google Meet (Invitation link will follow)</p>
              </div>
              
              ${notes ? `<p style="font-size: 14px;"><strong>Your Notes:</strong><br><span style="color: #71717a; font-style: italic;">"${notes}"</span></p>` : ""}
              
              <p style="margin-top: 25px; font-size: 14px;">If you need to reschedule or make adjustments, please reply directly to this email.</p>
              
              <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 30px 0;">
              <p style="color: #a1a1aa; font-size: 12px; text-align: center; margin: 0;">GrowX Labs | High-Performance Digital Systems & AI Infrastructure</p>
            </div>
          `
        });
      } catch (emailErr) {
        console.error("Failed to send booking notification email via Resend:", emailErr);
      }
    }

    return NextResponse.json({ success: true, booking }, { status: 200 });

  } catch (error: any) {
    console.error("POST bookings error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
