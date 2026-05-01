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
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? '127.0.0.1';

  // 1. Enterprise Rate Limiting for sensitive API routes
  if (pathname.startsWith('/api/contact') || pathname.startsWith('/api/auth') || pathname.startsWith('/api/login') || pathname.startsWith('/api/signup')) {
    if (apiLimiter) {
      const { success } = await apiLimiter.limit(`ratelimit_${ip}`);
      if (!success) {
        return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
      }
    }
  }

  // 2. Skip paths that should not be localized or processed
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname.includes('.')
  ) {
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

  // 5. RBAC Check
  const isAdminPath = pathname.includes('/admin');
  if (isAdminPath) {
    const secret = process.env.NEXTAUTH_SECRET;
    const token = await getToken({ req, secret });
    if (!token || (token.role !== 'ADMIN' && token.role !== 'CO_ADMIN')) {
      const loginUrl = new URL(`/${matchedLocale || 'en-IN'}/login`, req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlMiddleware(req);
}

export const config = {
  // We removed 'api' from the ignore list so our rate limiter can process API requests
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)']
};
