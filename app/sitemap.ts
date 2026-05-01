import { MetadataRoute } from 'next';

const baseUrl = 'https://growxlabs.tech';

const marketingRoutes = [
  { path: '', priority: 1.0, changefreq: 'daily' as const },
  { path: '/services', priority: 0.9, changefreq: 'weekly' as const },
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

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = marketingRoutes.flatMap((route) => [
    // Root version (Canonical)
    {
      url: `${baseUrl}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.changefreq,
      priority: route.priority,
    },
    // en-IN version
    {
      url: `${baseUrl}/en-IN${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.changefreq,
      priority: route.priority,
    }
  ]);

  return routes;
}

