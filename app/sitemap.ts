import { MetadataRoute } from 'next';
import { projects } from '@/lib/data/projects';

const baseUrl = 'https://growxlabs.tech';

// Supported international locales from navigation.ts
const locales = ['', '/en', '/en-IN', '/en-US', '/en-GB', '/en-AU'];

// Static marketing and landing page routes
const marketingRoutes = [
  { path: '', priority: 1.0, changefreq: 'daily' as const },
  { path: '/services', priority: 0.9, changefreq: 'weekly' as const },
  { path: '/products', priority: 0.9, changefreq: 'weekly' as const },
  { path: '/pricing', priority: 0.9, changefreq: 'weekly' as const },
  { path: '/portfolio', priority: 0.8, changefreq: 'monthly' as const },
  { path: '/courses', priority: 0.8, changefreq: 'monthly' as const },
  { path: '/about', priority: 0.7, changefreq: 'monthly' as const },
  { path: '/contact', priority: 0.7, changefreq: 'monthly' as const },
  { path: '/terms', priority: 0.5, changefreq: 'monthly' as const },
  { path: '/privacy', priority: 0.5, changefreq: 'monthly' as const },
  { path: '/refund-policy', priority: 0.5, changefreq: 'monthly' as const },
  { path: '/how-to-get-clients-from-website', priority: 0.9, changefreq: 'weekly' as const },
  { path: '/website-vs-growth-system', priority: 0.9, changefreq: 'weekly' as const },
  { path: '/best-website-for-small-business', priority: 0.9, changefreq: 'weekly' as const },
];

// Dynamically generated editorial blog routes
const blogRoutes = [
  { path: '/blog', priority: 0.9, changefreq: 'daily' as const },
  { path: '/blog/elon-musks-path-to-becoming-the-worlds-first-trillionaire', priority: 0.8, changefreq: 'weekly' as const },
  { path: '/blog/google-io-2026', priority: 0.8, changefreq: 'weekly' as const },
  { path: '/blog/google-search-is-no-longer-just-search', priority: 0.8, changefreq: 'weekly' as const },
  { path: '/blog/why-anthropic-is-becoming-a-serious-threat-to-openai', priority: 0.8, changefreq: 'weekly' as const },
  { path: '/blog/ai-coding-tools-are-reshaping-modern-software-engineering', priority: 0.8, changefreq: 'weekly' as const },
  { path: '/blog/n8n-automation-for-business', priority: 0.8, changefreq: 'weekly' as const },
  { path: '/blog/whatsapp-automation-for-lead-nurturing', priority: 0.8, changefreq: 'weekly' as const },
  { path: '/blog/restaurant-customer-retention-automation', priority: 0.8, changefreq: 'weekly' as const },
  { path: '/blog/indian-restaurant-website-usa', priority: 0.8, changefreq: 'weekly' as const },
  { path: '/blog/ferraris-electric-future-why-the-luce-marks-a-historic-turning-point', priority: 0.8, changefreq: 'weekly' as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // Dynamically generated portfolio project routes
  const portfolioRoutes = projects.map((project) => ({
    path: `/portfolio/${project.slug}`,
    priority: 0.8,
    changefreq: 'weekly' as const,
  }));

  const allRoutes = [...marketingRoutes, ...blogRoutes, ...portfolioRoutes];

  const routes = allRoutes.flatMap((route) => 
    locales.map((locale) => ({
      url: `${baseUrl}${locale}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.changefreq,
      priority: route.priority,
    }))
  );

  return routes;
}
