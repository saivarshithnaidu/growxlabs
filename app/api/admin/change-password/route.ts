import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import bcrypt from "bcryptjs";
import { getToken } from "next-auth/jwt";

export async function POST(req: Request) {
  try {
    const token = await getToken({
      req: req as any,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters." },
        { status: 400 }
      );
    }

    // Fetch team member by email
    const { data: member, error: fetchError } = await supabaseAdmin
      .from("team_members")
      .select("id, password_hash")
      .eq("email", token.email)
      .single();

    if (fetchError || !member) {
      return NextResponse.json(
        { error: "Team member not found." },
        { status: 404 }
      );
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, member.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 403 }
      );
    }

    // Hash new password and update
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    const { error: updateError } = await supabaseAdmin
      .from("team_members")
      .update({ password_hash: newHash })
      .eq("id", member.id);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, message: "Password updated successfully." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
