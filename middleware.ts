import createMiddleware from 'next-intl/middleware';
import { locales, localePrefix } from './navigation';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Redis only if env vars are present (fallback for local dev)
const redis = (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// Rate limit: 10 requests per minute per IP
const apiLimiter = redis 
  ? new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(10, '1 m'),
      analytics: true,
    })
  : null;

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'en-IN',
  localePrefix
});

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  // 1. PERFORMANCE: Immediate skip for static assets and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. ENTERPRISE RATE LIMITING (Optimized)
  // Only rate limit sensitive POST actions to protect against brute force/spam
  // Skip for GET requests (like session checks) to maintain UI snappiness
  if (req.method === 'POST') {
    const sensitiveRoutes = ['/api/contact', '/api/auth', '/api/login', '/api/signup'];
    if (sensitiveRoutes.some(route => pathname.startsWith(route))) {
      if (apiLimiter) {
        const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? '127.0.0.1';
        const { success } = await apiLimiter.limit(`ratelimit_${ip}`);
        if (!success) {
          return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
        }
      }
    }
  }

  // 3. Skip localization for general API routes after rate limiting check
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }


  // 2. Identify Subdomain Target
  const isProd = !hostname.includes('localhost') && !hostname.includes('.vercel.app');
  let subdomain = '';
  
  if (isProd) {
    if (hostname.startsWith('admin.')) subdomain = 'admin';
    else if (hostname.startsWith('client.')) subdomain = 'client';
    else if (hostname.startsWith('restaurant.')) subdomain = 'restaurant';
    else if (hostname.startsWith('hotel.')) subdomain = 'hotel';
    else if (hostname.startsWith('realestate.')) subdomain = 'realestate';
  }

  // 3. Locale Detection & Redirect Logic
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  // Case-insensitive check for locales
  const matchedLocale = locales.find(
    l => l.toLowerCase() === firstSegment?.toLowerCase()
  );

  // If no valid locale found in path, redirect to default /en-IN
  if (!matchedLocale && !subdomain) {
    const url = req.nextUrl.clone();
    // Handle legacy /en or other malformed starts
    const cleanPath = pathname.replace(/^\/en(\/|$)/, '/');
    url.pathname = `/en-IN${cleanPath === '/' ? '' : cleanPath}`;
    return NextResponse.redirect(url, 302);
  }

  // If casing mismatch (e.g., /en-in/ instead of /en-IN/), redirect to canonical
  if (firstSegment && matchedLocale && firstSegment !== matchedLocale && !subdomain) {
    const url = req.nextUrl.clone();
    segments[0] = matchedLocale;
    url.pathname = '/' + segments.join('/');
    return NextResponse.redirect(url, 302);
  }

  // 4. Handle Subdomain Mapping
  if (subdomain) {
    const targetLocale = 'en-IN'; // Subdomains use primary locale
    const mapping: Record<string, string> = {
      admin: '/admin',
      client: '/client',
      restaurant: '/demos/restaurant',
      hotel: '/demos/hotel',
      realestate: '/demos/real-estate'
    };
    const internalPath = mapping[subdomain];
    const url = req.nextUrl.clone();
    url.pathname = `/${targetLocale}${internalPath}${pathname === '/' ? '' : pathname}`;
    return NextResponse.rewrite(url);
  }

  // 5. RBAC Check (Admin & Client Portals)
  const isAdminPath = pathname.includes('/admin');
  const isClientPath = pathname.includes('/client');

  if (isAdminPath || isClientPath) {
    const secret = process.env.NEXTAUTH_SECRET;
    const cookieName = process.env.NODE_ENV === 'production' 
      ? '__Secure-next-auth.session-token' 
      : 'next-auth.session-token';

    const token = await getToken({ 
      req, 
      secret,
      cookieName: cookieName
    });

    
    if (!token) {
      const loginUrl = new URL(`/${matchedLocale || 'en-IN'}/login`, req.url);
      return NextResponse.redirect(loginUrl);
    }

    // Role verification
    if (isAdminPath && token.role !== 'ADMIN' && token.role !== 'CO_ADMIN') {
      const homeUrl = new URL(`/${matchedLocale || 'en-IN'}`, req.url);
      return NextResponse.redirect(homeUrl);
    }

    if (isClientPath && token.role !== 'CLIENT' && token.role !== 'ADMIN' && token.role !== 'CO_ADMIN') {
      const homeUrl = new URL(`/${matchedLocale || 'en-IN'}`, req.url);
      return NextResponse.redirect(homeUrl);
    }
  }


  return intlMiddleware(req);
}

export const config = {
  // We removed 'api' from the ignore list so our rate limiter can process API requests
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)']
};
