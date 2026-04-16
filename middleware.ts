import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createClient } from "@/lib/supabase/server";

export async function middleware(request: NextRequest) {
  // 1. Update session for all routes (refreshes cookie)
  const response = await updateSession(request);

  // 2. Protect dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return Response.redirect(new URL("/login", request.url));
    }
    
    // Role-based access logic could be added here or in the page layouts
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
