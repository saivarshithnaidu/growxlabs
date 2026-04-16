import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    const supabase = await createClient();

    // 1. Validation
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // 2. Check if user exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json({ error: "User already registered" }, { status: 409 });
    }

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create User
    const { data, error } = await supabase.from("users").insert([
      {
        name,
        email,
        password: hashedPassword,
        role: "CLIENT" // Default production role
      }
    ]).select().single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Partner account registered successfully" 
    });

  } catch (error: any) {
    console.error("Signup System Failure:", error);
    return NextResponse.json({ error: "Account initialization failed" }, { status: 500 });
  }
}
