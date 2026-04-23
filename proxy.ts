import createMiddleware from 'next-intl/middleware';
import { locales, localePrefix } from './navigation';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'en-IN',
  localePrefix
});

export default function proxy(req: NextRequest) {
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

  // Detect Country using Vercel header
  // Defaults to 'IN' for local development as per "Optional: Force region to India for now"
  const country = req.headers.get('x-vercel-ip-country') || 'IN';

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

  // Helper to determine target locale based on country or cookie
  const getTargetLocale = () => {
    const cookieLocale = req.cookies.get('NEXT_LOCALE')?.value;
    if (cookieLocale && locales.includes(cookieLocale as any)) return cookieLocale;
    
    // Logic: India users -> en-IN, others -> en-US
    return country === 'IN' ? 'en-IN' : 'en-US';
  };

  // 3. Handle Subdomain Mapping
  if (subdomain) {
    const targetLocale = getTargetLocale();
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

  // 4. Main Domain Locale Persistence / Redirects
  const segments = pathname.split('/');
  const hasLocale = locales.includes(segments[1] as any);

  // If no locale in path, determine target and redirect
  if (!hasLocale) {
    const targetLocale = getTargetLocale();
    const url = req.nextUrl.clone();
    url.pathname = `/${targetLocale}${pathname === '/' ? '' : pathname}`;
    return NextResponse.redirect(url, 302);
  }

  // 5. Standard next-intl processing for paths that already have a locale
  return intlMiddleware(req);
}

export const config = {
  // matcher covers all routes that should be localized
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
