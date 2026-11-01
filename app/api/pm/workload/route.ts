import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { teamWorkload } from "@/lib/pm/delivery";

// Workload = task assignments across delivery projects; see teamWorkload() for the rules.
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    if (!["ADMIN", "CO_ADMIN", "crm_agent"].includes(String(session.user.role))) {
      return NextResponse.json({ error: "You don't have permission to view workload." }, { status: 403 });
    }
    return NextResponse.json(await teamWorkload());
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load workload." }, { status: 500 });
  }
}
