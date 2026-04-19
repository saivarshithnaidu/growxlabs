import createMiddleware from 'next-intl/middleware';
import { locales, localePrefix } from './navigation';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'en-US',
  localePrefix
});

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  // 1. Skip if path is internal, api, or has extension
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Identify Subdomain Target
  // admin.growxlabs.tech -> 'admin'
  // client.growxlabs.tech -> 'client'
  // restaurant.growxlabs.tech -> 'restaurant'
  const isProd = !hostname.includes('localhost') && !hostname.includes('.vercel.app');
  let subdomain = '';
  
  if (isProd) {
    if (hostname.startsWith('admin.')) subdomain = 'admin';
    else if (hostname.startsWith('client.')) subdomain = 'client';
    else if (hostname.startsWith('restaurant.')) subdomain = 'restaurant';
    else if (hostname.startsWith('hotel.')) subdomain = 'hotel';
    else if (hostname.startsWith('realestate.')) subdomain = 'realestate';
  }

  // 3. Handle Mapping
  if (subdomain) {
    // If user is accessing a subdomain, we rewrite to the specific localized path
    // Example: admin.growxlabs.tech/login -> /en-IN/admin/login
    
    // First, detect locale (same as root logic)
    const cookieLocale = req.cookies.get('NEXT_LOCALE')?.value;
    const targetLocale = (cookieLocale && locales.includes(cookieLocale as any)) 
      ? cookieLocale 
      : (req.headers.get('cf-ipcountry') === 'IN' || !isProd ? 'en-IN' : 'en-US');

    // Map subdomains to internal folders
    const mapping: Record<string, string> = {
      admin: '/admin',
      client: '/client',
      restaurant: '/demos/restaurant',
      hotel: '/demos/hotel',
      realestate: '/demos/real-estate'
    };

    const internalPath = mapping[subdomain];
    
    // Construct internal URL: /[locale]/[experience]/[rest-of-path]
    // Note: If we use rewrite, the user keeps seeing the subdomain URL
    const url = req.nextUrl.clone();
    url.pathname = `/${targetLocale}${internalPath}${pathname === '/' ? '' : pathname}`;
    
    return NextResponse.rewrite(url);
  }

  // 4. Root Domain Logic ("growxlabs.tech")
  if (pathname === '/') {
    const isDev = process.env.NODE_ENV === 'development';
    const targetLocale = (req.cookies.get('NEXT_LOCALE')?.value) || (isDev ? 'en-IN' : (req.headers.get('cf-ipcountry') === 'AE' ? 'ar-AE' : 'en-US'));
    
    return NextResponse.redirect(new URL(`/${targetLocale}/`, req.url));
  }

  // 5. Regular path processing for main domain
  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
