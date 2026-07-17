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

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  if (hostname === 'spidey.growxlabs.tech') {
    return NextResponse.rewrite(
      new URL('/spiderman/dist/index.html', req.url)
    );
  }

  // Redirect old /wish-admin path to the new unified /admin/wish-game path
  if (pathname.includes('/wish-admin')) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.replace('/wish-admin', '/admin/wish-game');
    return NextResponse.redirect(url, 301);
  }

  // Protect /admin/wish-game route with ADMIN_SECRET query parameter or active Admin session
  if (pathname.includes('/admin/wish-game')) {
    const secret = req.nextUrl.searchParams.get("secret");
    const isSecretValid = !!(process.env.ADMIN_SECRET && secret === process.env.ADMIN_SECRET);

    let isAdmin = false;
    try {
      const token = await getToken({ 
        req, 
        secret: process.env.NEXTAUTH_SECRET,
      });
      if (token && (token.role === 'ADMIN' || token.role === 'CO_ADMIN')) {
        isAdmin = true;
      }
    } catch (e) {
      console.error("Token verification failed for admin/wish-game in middleware:", e);
    }

    if (!isSecretValid && !isAdmin) {
      const url = req.nextUrl.clone();
      url.pathname = `/wish-game`;
      url.search = "";
      return NextResponse.redirect(url, 302);
    }
  }

  // Redirect underscores in locale and path if they match wish_game or en_IN
  let rewrittenPath = pathname;
  let shouldRedirect = false;

  if (pathname.includes('wish_game')) {
    rewrittenPath = rewrittenPath.replace('wish_game', 'wish-game');
    shouldRedirect = true;
  }

  if (shouldRedirect) {
    const url = req.nextUrl.clone();
    url.pathname = rewrittenPath;
    return NextResponse.redirect(url, 302);
  }

  // 1. PERFORMANCE: Immediate skip for static assets and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. ENTERPRISE RATE LIMITING (Optimized with Fast Fail-Open Timeout)
  if (req.method === 'POST') {
    const sensitiveRoutes = ['/api/contact', '/api/auth', '/api/login', '/api/signup'];
    if (sensitiveRoutes.some(route => pathname.startsWith(route))) {
      if (apiLimiter) {
        const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? '127.0.0.1';
        
        try {
          // Wrap rate limiting in a 600ms timeout promise so it fails open if Upstash Redis has latency
          const timeoutPromise = new Promise<{ success: boolean }>((resolve) => 
            setTimeout(() => resolve({ success: true }), 600)
          );
          
          const limitPromise = apiLimiter.limit(`ratelimit_${ip}`);
          const { success } = await Promise.race([limitPromise, timeoutPromise]);
          
          if (!success) {
            return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
          }
        } catch (err) {
          console.error("Rate limiting error (failing open):", err);
        }
      }
    }
  }

  // 3. Skip localization for general API routes after rate limiting check
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // 2. Identify Subdomain Target
  const isVercel = hostname.includes('.vercel.app');
  let subdomain = '';
  
  if (!isVercel) {
    if (hostname.startsWith('admin.')) subdomain = 'admin';
    else if (hostname.startsWith('client.')) subdomain = 'client';
    else if (hostname.startsWith('restaurant.')) subdomain = 'restaurant';
    else if (hostname.startsWith('hotel.')) subdomain = 'hotel';
    else if (hostname.startsWith('realestate.')) subdomain = 'realestate';
    else if (hostname.startsWith('courses.')) subdomain = 'courses';
    else if (hostname.startsWith('careers.')) subdomain = 'careers';
  }

  // 2.5. Redirect main domain /careers and /courses to their subdomains
  const cleanPathForCheck = pathname;
  const cleanLowerPath = cleanPathForCheck.toLowerCase();
  const hasCourses = cleanLowerPath.startsWith('/courses');
  const hasCareers = cleanLowerPath.startsWith('/careers');

  if (hasCourses || hasCareers) {
    const isCoursesSub = subdomain === 'courses';
    const isCareersSub = subdomain === 'careers';

    if ((hasCourses && !isCoursesSub) || (hasCareers && !isCareersSub)) {
      const targetSub = hasCourses ? 'courses' : 'careers';
      let cleanPath = pathname;

      if (cleanPath === `/courses` || cleanPath === `/careers`) {
        cleanPath = '/';
      } else {
        cleanPath = cleanPath.replace(/^\/(courses|careers)/, '');
      }

      const baseHost = req.nextUrl.hostname.replace(/^(admin\.|client\.|restaurant\.|hotel\.|realestate\.|courses\.|careers\.)/, '');
      const protocol = req.nextUrl.protocol;
      const port = req.nextUrl.port ? `:${req.nextUrl.port}` : '';
      const targetPath = cleanPath === '' ? '/' : cleanPath;
      const redirectUrl = `${protocol}//${targetSub}.${baseHost}${port}${targetPath}${req.nextUrl.search}`;
      return NextResponse.redirect(redirectUrl);
    }
  }

  // 2.8. Redirect subdomain requests for main site paths back to main domain
  if (subdomain === 'courses' || subdomain === 'careers') {
    const cleanPath = pathname;
    
    // Redirect if they repeat the subdomain path in URL
    const targetSubRoute = `/${subdomain}`;
    if (cleanPath.startsWith(targetSubRoute)) {
      const remainingPath = cleanPath.substring(targetSubRoute.length);
      const baseHost = req.nextUrl.hostname.replace(/^(admin\.|client\.|restaurant\.|hotel\.|realestate\.|courses\.|careers\.)/, '');
      const protocol = req.nextUrl.protocol;
      const port = req.nextUrl.port ? `:${req.nextUrl.port}` : '';
      const targetPath = remainingPath === '' ? '/' : remainingPath;
      const redirectUrl = `${protocol}//${subdomain}.${baseHost}${port}${targetPath}${req.nextUrl.search}`;
      return NextResponse.redirect(redirectUrl);
    }

    const mainSitePaths = [
      '/services', '/portfolio', '/blog', '/faq', '/contact', 
      '/privacy', '/terms', '/refund-policy', '/login', '/signup', 
      '/register', '/admin', '/client', '/demos', '/checkout'
    ];

    if (mainSitePaths.some(path => cleanPath.startsWith(path))) {
      const baseHost = req.nextUrl.hostname.replace(/^(admin\.|client\.|restaurant\.|hotel\.|realestate\.|courses\.|careers\.)/, '');
      
      // In local development, if we redirect to localhost:3000, Next.js strips the host and causes an infinite loop.
      // To prevent this, we skip the redirect on localhost in development (falling through to a safe 404).
      if (baseHost.includes('localhost') || baseHost.includes('127.0.0.1')) {
        return NextResponse.next();
      }

      const protocol = req.nextUrl.protocol;
      const port = req.nextUrl.port ? `:${req.nextUrl.port}` : '';
      const redirectUrl = `${protocol}//${baseHost}${port}${req.nextUrl.pathname}${req.nextUrl.search}`;
      console.log("MIDDLEWARE REDIRECT HIT:", req.nextUrl.href, "=>", redirectUrl);
      return new NextResponse(null, {
        status: 307,
        headers: {
          Location: redirectUrl,
        },
      });
    }
  }

  // 4. Handle Subdomain Mapping
  if (subdomain) {
    const mapping: Record<string, string> = {
      admin: '/admin',
      client: '/client',
      restaurant: '/demos/restaurant',
      hotel: '/demos/hotel',
      realestate: '/demos/real-estate',
      courses: '/courses',
      careers: '/careers'
    };
    const internalPath = mapping[subdomain];
    const url = req.nextUrl.clone();
    url.pathname = `${internalPath}${pathname === '/' ? '' : pathname}`;
    return NextResponse.rewrite(url);
  }

  // 5. RBAC Check (Admin & Client Portals)
  const isAdminPath = pathname.includes('/admin') && !pathname.includes('/wish-admin');
  const isClientPath = pathname.includes('/client');

  if (isAdminPath || isClientPath) {
    const secret = process.env.NEXTAUTH_SECRET;
    const token = await getToken({ 
      req, 
      secret,
    });

    const isLoginPage = pathname.includes('/login');
    
    if (!token && !isLoginPage) {
      const loginUrl = new URL(`/login`, req.url);
      return NextResponse.redirect(loginUrl);
    }

    // Role verification
    if (token) {
      // Instantly block and redirect co-admin sessions
      if (
        token.role === 'CO_ADMIN' ||
        token.email === 'coadmin@growxlabs.tech' ||
        token.email === 'coadmin-suspended@growxlabs.tech'
      ) {
        const loginUrl = new URL(`/login`, req.url);
        return NextResponse.redirect(loginUrl);
      }

      if (isAdminPath && token.role !== 'ADMIN' && token.role !== 'CO_ADMIN' && token.role !== 'crm_agent') {
        const homeUrl = new URL(`/`, req.url);
        return NextResponse.redirect(homeUrl);
      }

      if (isClientPath && token.role !== 'CLIENT' && token.role !== 'ADMIN' && token.role !== 'CO_ADMIN') {
        const homeUrl = new URL(`/`, req.url);
        return NextResponse.redirect(homeUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  // We removed 'api' from the ignore list so our rate limiter can process API requests
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)']
};
