import { isSameOrigin } from "@/lib/command-center/security/origin";
import { handleLocationMock, isLocationMockMode } from "@/lib/location/mock";
import { isAllowedLocationRoute, locationAdminFetch, locationError, LocationHttpError, requireLocationAdmin } from "@/lib/location/server";

const MAX_BODY_BYTES = 64 * 1024;

async function proxy(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const actor = await requireLocationAdmin();
    const { path: segments } = await params;
    const path = segments.join("/");
    const method = request.method.toUpperCase();

    if (!isAllowedLocationRoute(method, path)) throw new LocationHttpError(404, "Unknown location admin route.");

    let body: string | undefined;
    if (method !== "GET") {
      // Key creation and status changes must come from this admin, not a cross-site form.
      if (!isSameOrigin(request.headers.get("origin"), request.headers.get("host"))) {
        throw new LocationHttpError(403, "Cross-origin request refused.");
      }
      body = await request.text();
      if (body.length > MAX_BODY_BYTES) throw new LocationHttpError(413, "Request body is too large.");
      if (!body) body = "{}";
    }

    const search = new URL(request.url).search;

    // Local development without GROWX_LOC_ADMIN_URL: serve in-memory mock data (never in production).
    if (isLocationMockMode()) {
      const mock = handleLocationMock({ method, path, search, body }, actor.email);
      return Response.json(mock.body, { status: mock.status, headers: { "Cache-Control": "no-store", "X-Location-Mock": "1" } });
    }

    const upstream = await locationAdminFetch(actor, { method, path, search, body });
    const text = await upstream.text();

    return new Response(text || "{}", {
      status: upstream.status,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  } catch (error) {
    return locationError(error);
  }
}

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
