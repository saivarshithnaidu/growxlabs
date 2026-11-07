import { NextResponse } from "next/server";
import { denyUnlessHrAdmin } from "@/lib/hrms/admin-guard";
import { loadDirectory } from "@/lib/hrms/directory";

export async function GET() {
  const denied = await denyUnlessHrAdmin("employee.view", "department.manage", "designation.manage");
  if (denied) return denied;
  try {
    return NextResponse.json(await loadDirectory());
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "The directory couldn't load." }, { status: 500 });
  }
}
