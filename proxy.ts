import createMiddleware from 'next-intl/middleware';
import { locales, localePrefix } from './navigation';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'en-US',
  localePrefix
});

// Rename exported function from middleware to proxy
export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Skip if path is internal, api, or has extension
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Strict GEO Redirection ONLY on root "/"
  if (pathname === '/') {
    const isDev = process.env.NODE_ENV === 'development';
    const targetLocale = isDev ? 'en-IN' : (req.headers.get('cf-ipcountry') === 'AE' ? 'ar-AE' : 'en-US');
    
    return NextResponse.redirect(new URL(`/${targetLocale}/`, req.url));
  }

  // 3. Regular path processing
  return intlMiddleware(req);
}

export const config = {
  // Capture all paths
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
