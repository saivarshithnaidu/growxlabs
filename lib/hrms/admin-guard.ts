import "server-only";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

/**
 * People data is admin-only: returns a 401/403 response to send, or null when allowed.
 * Pass a permission to also admit people-service users who hold it.
 */
export async function denyUnlessHrAdmin(permission?: string): Promise<NextResponse | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const user = session.user as { role?: string; permissions?: string[] };
  if (["ADMIN", "CO_ADMIN"].includes(String(user.role))) return null;
  if (permission && user.role === "IDENTITY_USER" && user.permissions?.includes(permission)) return null;
  return NextResponse.json({ error: "You don't have permission to view people data." }, { status: 403 });
}
