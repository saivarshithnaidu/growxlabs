import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // 1. Validation
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // 2. Initialize Admin Client inside the request to ensure fresh env vars
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("SUPABASE CONFIG MISSING: Ensure URL and SERVICE_ROLE_KEY are set in Vercel.");
      return NextResponse.json({ error: "Server configuration error. Please contact support." }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // 3. Check if user exists (Bypassing RLS)
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (checkError) {
      console.error("Signup Check Error:", checkError);
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }

    if (existingUser) {
      return NextResponse.json({ error: "User already registered" }, { status: 409 });
    }

    // 4. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Create User (Bypassing RLS)
    const { error: insertError } = await supabaseAdmin.from("users").insert([
      {
        name,
        email,
        password: hashedPassword,
        role: "CLIENT"
      }
    ]);

    if (insertError) {
      console.error("Signup Insert Error:", insertError);
      // If we still get RLS error here, the SERVICE_ROLE_KEY is definitely invalid for this project
      return NextResponse.json({ 
        error: insertError.message.includes("row-level security") 
          ? "System permission error. The admin key provided is invalid." 
          : insertError.message 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Partner account registered successfully" 
    });

  } catch (error: any) {
    console.error("Signup Critical Failure:", error);
    return NextResponse.json({ error: "Account initialization failed" }, { status: 500 });
  }
}

