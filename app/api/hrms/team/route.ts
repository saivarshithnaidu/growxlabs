import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { denyUnlessHrAdmin } from "@/lib/hrms/admin-guard";
import { loadDirectory } from "@/lib/hrms/directory";

/** The signed-in person's direct and indirect reports, matched to an employee by work email. */
export async function GET() {
  const denied = await denyUnlessHrAdmin("manager.view_team");
  if (denied) return denied;
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase();
  try {
    const { employees } = await loadDirectory();
    const me = employees.find((e) => e.email?.toLowerCase() === email);
    if (!me) return NextResponse.json({ linked: false, members: [] });

    const members: Array<(typeof employees)[number] & { depth: number }> = [];
    const seen = new Set([me.id]);
    const walk = (managerId: string, depth: number) => {
      for (const e of employees) {
        if (e.reporting_manager_id !== managerId || seen.has(e.id)) continue;
        seen.add(e.id);
        members.push({ ...e, depth });
        walk(e.id, depth + 1);
      }
    };
    walk(me.id, 1);
    return NextResponse.json({ linked: true, members });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Your team couldn't load." }, { status: 500 });
  }
}
