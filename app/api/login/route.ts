import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Hardcoded Admin Credentials for prioritized access
const ADMIN_CREDENTIALS = [
  { email: "admin@growxlabs.tech", password: "VARSHITH973206", name: "Varshith" },
  { email: "coadmin@growxlabs.tech", password: "AKHILESH", name: "Akhilesh" }
];

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const supabase = await createClient();

    // 1. Check Hardcoded Bypass First
    const hardcodedUser = ADMIN_CREDENTIALS.find(u => u.email === email && u.password === password);
    
    if (hardcodedUser) {
      return NextResponse.json({ 
        success: true, 
        role: "admin",
        user: { id: "hardcoded-admin", email: hardcodedUser.email, name: hardcodedUser.name }
      });
    }

    // 2. Fallback to Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ 
        error: "Invalid email or password. Please try again." 
      }, { status: 401 });
    }

    // 3. Determine Role
    const user = data.user;
    let role = "client";
    
    const isAdmin = ADMIN_CREDENTIALS.some(u => u.email === user.email);
    if (isAdmin || user.user_metadata?.role === "admin") {
      role = "admin";
    }

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
