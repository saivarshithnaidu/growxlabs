import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const MOCK_USERS = [
  {
    id: "u1111111-1111-1111-1111-111111111111",
    name: "Alex Rivera",
    email: "alex.rivera@growxlabs.tech",
    role: "Super Admin",
    user_type: "Employee",
    department: "Executive & Platform Admin",
    status: "Active",
    mfa_enabled: true,
    last_login_at: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  {
    id: "u2222222-2222-2222-2222-222222222222",
    name: "Elena Rostova",
    email: "elena.r@growxlabs.tech",
    role: "IT Administrator",
    user_type: "Employee",
    department: "IT & Infrastructure",
    status: "Active",
    mfa_enabled: true,
    last_login_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "u3333333-3333-3333-3333-333333333333",
    name: "David Miller",
    email: "david.m@growxlabs.tech",
    role: "Security Administrator",
    user_type: "Employee",
    department: "Cybersecurity & Compliance",
    status: "Active",
    mfa_enabled: true,
    last_login_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "u4444444-4444-4444-4444-444444444444",
    name: "Marcus Vance",
    email: "marcus@clientapex.com",
    role: "Client",
    user_type: "Client",
    department: "External Portal",
    status: "Active",
    mfa_enabled: false,
    last_login_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }
];

export async function GET() {
  try {
    const { data: users } = await supabaseAdmin.from("admin_users").select("*").order("created_at", { ascending: false });
    if (!users || users.length === 0) {
      return NextResponse.json({ users: MOCK_USERS });
    }
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ users: MOCK_USERS });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, role, department, user_type } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and Email are required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("admin_users")
      .insert([{
        name,
        email,
        status: "Active",
        user_type: user_type || "Employee",
        mfa_enabled: false
      }])
      .select()
      .single();

    if (error) {
      const synthetic = {
        id: crypto.randomUUID(),
        name,
        email,
        role: role || "Employee",
        department: department || "General",
        user_type: user_type || "Employee",
        status: "Active",
        mfa_enabled: false,
        last_login_at: new Date().toISOString()
      };
      return NextResponse.json({ user: synthetic, synthetic: true });
    }

    return NextResponse.json({ user: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");
    const body = await req.json();

    if (!userId) return NextResponse.json({ error: "User ID required" }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from("admin_users")
      .update(body)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ user: { id: userId, ...body }, synthetic: true });
    }

    return NextResponse.json({ user: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
