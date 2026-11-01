import "server-only";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

/** Finance APIs are admin-only: returns a 401/403 response to send, or null when allowed. */
export async function denyUnlessFinanceAdmin(): Promise<NextResponse | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  if (!["ADMIN", "CO_ADMIN"].includes(String(session.user.role))) {
    return NextResponse.json({ error: "You don't have permission to use finance." }, { status: 403 });
  }
  return null;
}
