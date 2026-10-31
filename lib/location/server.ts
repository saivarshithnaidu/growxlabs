import "server-only";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Server-side bridge to the Growx Location admin API (growx-loc docs/12-admin-ops-api.md).
// The admin secret never leaves the server; the browser only talks to /api/admin/location/*.

export class LocationHttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export type LocationActor = { userId: string; email: string };

/** Only ADMIN and CO_ADMIN may run Location ops. crm_agent, IDENTITY_USER and CLIENT are rejected. */
export async function requireLocationAdmin(): Promise<LocationActor> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new LocationHttpError(401, "Authentication required.");
  if (!["ADMIN", "CO_ADMIN"].includes(session.user.role || "")) {
    throw new LocationHttpError(403, "Location administration permission is required.");
  }
  if (!session.user.email) throw new LocationHttpError(403, "Your account has no email address for the audit log.");
  return { userId: session.user.id, email: session.user.email };
}

const UUID = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";

/** Every admin call the UI may make. Anything else is refused before it reaches growx-loc. */
const ALLOWED_ROUTES: { method: string; pattern: RegExp }[] = [
  { method: "GET", pattern: /^overview$/ },
  { method: "GET", pattern: /^audit-logs$/ },
  { method: "GET", pattern: /^tenants$/ },
  { method: "POST", pattern: /^tenants$/ },
  { method: "GET", pattern: new RegExp(`^tenants/${UUID}$`, "i") },
  { method: "PATCH", pattern: new RegExp(`^tenants/${UUID}$`, "i") },
  { method: "GET", pattern: new RegExp(`^tenants/${UUID}/keys$`, "i") },
  { method: "POST", pattern: new RegExp(`^tenants/${UUID}/keys$`, "i") },
  { method: "GET", pattern: new RegExp(`^tenants/${UUID}/usage$`, "i") },
  { method: "POST", pattern: new RegExp(`^keys/${UUID}/revoke$`, "i") },
  { method: "POST", pattern: new RegExp(`^keys/${UUID}/rotate$`, "i") },
];

export function isAllowedLocationRoute(method: string, path: string): boolean {
  return ALLOWED_ROUTES.some((route) => route.method === method && route.pattern.test(path));
}

function locationAdminConfig() {
  const baseUrl = process.env.GROWX_LOC_ADMIN_URL;
  const secret = process.env.GROWX_LOC_ADMIN_SECRET;
  if (!baseUrl || !secret) throw new LocationHttpError(503, "Location admin is not configured on this server.");
  return { baseUrl: baseUrl.replace(/\/+$/, ""), secret };
}

/** Calls growx-loc /admin/v1/<path>. Only the method, query, JSON body and actor are forwarded. */
export async function locationAdminFetch(
  actor: LocationActor,
  { method, path, search, body }: { method: string; path: string; search?: string; body?: string },
): Promise<Response> {
  const { baseUrl, secret } = locationAdminConfig();
  const headers: Record<string, string> = {
    Authorization: `Bearer ${secret}`,
    "X-Admin-Actor-Id": actor.userId,
    "X-Admin-Actor-Email": actor.email,
    "User-Agent": "GrowxAdmin/1.0",
  };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  try {
    return await fetch(`${baseUrl}/admin/v1/${path}${search ?? ""}`, {
      method,
      headers,
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    throw new LocationHttpError(502, "Growx Location is unreachable. Try again in a moment.");
  }
}

export function locationError(error: unknown) {
  const status = error instanceof LocationHttpError ? error.status : 500;
  const message = error instanceof LocationHttpError ? error.message : "Location admin is unavailable.";
  if (!(error instanceof LocationHttpError)) console.error("Location admin proxy failed", error);
  return Response.json({ error: { code: "LOCATION_ADMIN_ERROR", message } }, { status, headers: { "Cache-Control": "no-store" } });
}
