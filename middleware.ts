import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Known legacy i18n locale prefixes to strip & 301 redirect for Googlebot & incoming traffic
const LEGACY_LOCALES = [
  "en-IN", "en-US", "en-GB", "en", "es", "de", "fr", "hi", "ja", "zh", "pt", "it", "ru", "ar", "ko"
];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 1. Intercept legacy i18n locale paths (e.g. /en-IN/blog/slug, /en/services, /en-IN)
  const segments = pathname.split("/");
  const firstSegment = segments[1];

  if (firstSegment && LEGACY_LOCALES.includes(firstSegment)) {
    // Strip locale segment (e.g. /en-IN/blog/slug -> /blog/slug)
    const cleanPath = "/" + segments.slice(2).join("/");
    const targetUrl = new URL((cleanPath || "/") + search, request.url);
    
    // Return HTTP 301 Moved Permanently for Googlebot & Search Engines to transfer PageRank
    return NextResponse.redirect(targetUrl, 301);
  }

  const response = NextResponse.next();
  const requestId = request.headers.get("x-request-id") || "req_" + Math.random().toString(36).substring(2, 10);

  // Propagate Request ID
  response.headers.set("x-request-id", requestId);

  // Security Response Headers
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;");

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)"
  ]
};
