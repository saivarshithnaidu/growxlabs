import { NextResponse } from "next/server";
import { submitLead } from "@/lib/actions/database";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // 1. Basic Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // 2. Submit to Database via Server Action
    await submitLead({ name, email, message });

    // 3. Return Success Response
    return NextResponse.json(
      { message: "Message received successfully. We will be in touch soon!" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Contact API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
