import createMiddleware from 'next-intl/middleware';
import { locales, localePrefix } from './navigation';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'en-IN',
  localePrefix
});

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  // 1. Skip paths that should not be localized or processed
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. CRITICAL: Handle invalid/legacy or malformed locale segments
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  // Case-insensitive check for locales
  const matchedLocale = locales.find(
    l => l.toLowerCase() === firstSegment?.toLowerCase()
  );

  // If the path starts with 'en' (legacy) or a casing mismatch (e.g., /en-in/ instead of /en-IN/)
  if (firstSegment?.toLowerCase() === 'en' || (firstSegment && matchedLocale && firstSegment !== matchedLocale)) {
    const targetLocale = matchedLocale || 'en-IN';
    const url = req.nextUrl.clone();
    segments[0] = targetLocale;
    url.pathname = '/' + segments.join('/');
    return NextResponse.redirect(url, 302);
  }

  // 3. RBAC Check
  const isAdminPath = pathname.match(/^\/(?:[a-z]{2}(?:-[A-Z]{2})?)\/admin/) || pathname.startsWith('/admin');
  if (isAdminPath) {
    const secret = process.env.NEXTAUTH_SECRET;
    const token = await getToken({ req, secret });
    if (!token || (token.role !== 'ADMIN' && token.role !== 'CO_ADMIN')) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // 4. Identify Subdomain Target
  const isProd = !hostname.includes('localhost') && !hostname.includes('.vercel.app');
  let subdomain = '';
  
  if (isProd) {
    if (hostname.startsWith('admin.')) subdomain = 'admin';
    else if (hostname.startsWith('client.')) subdomain = 'client';
    else if (hostname.startsWith('restaurant.')) subdomain = 'restaurant';
    else if (hostname.startsWith('hotel.')) subdomain = 'hotel';
    else if (hostname.startsWith('realestate.')) subdomain = 'realestate';
  }

  if (subdomain) {
    const targetLocale = req.cookies.get('NEXT_LOCALE')?.value || 'en-IN';
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

  // 5. SEO Protection: Force locale prefix for all main domain routes
  if (!matchedLocale) {
    const targetLocale = req.cookies.get('NEXT_LOCALE')?.value || 'en-IN';
    const url = req.nextUrl.clone();
    url.pathname = `/${targetLocale}${pathname === '/' ? '' : pathname}`;
    return NextResponse.redirect(url, 302);
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)']
};
