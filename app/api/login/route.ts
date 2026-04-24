import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const supabase = await createClient();

    // Authenticate via Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ 
        error: "Invalid email or password. Please try again." 
      }, { status: 401 });
    }

    // Determine Role
    const user = data.user;
    let role = user.user_metadata?.role || "client";
    
    return NextResponse.json({ 
      success: true, 
      role: role,
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: "Authentication system error." }, { status: 500 });
  }
}
