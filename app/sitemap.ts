import { MetadataRoute } from 'next';

const baseUrl = 'https://growxlabs.tech';

// Only these locales will appear as main entries in the sitemap
const priorityLocales = ['en-IN'];

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
];

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  marketingRoutes.forEach((route) => {
    priorityLocales.forEach((locale) => {
      const url = `${baseUrl}/${locale}${route.path}`;
      
      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: route.changefreq,
        priority: route.priority,
        alternates: {
          languages: {
            // Mapping specific locales to their localized URLs
            'en-IN': `${baseUrl}/en-IN${route.path}`,
            'en-US': `${baseUrl}/en-US${route.path}`,
            // Add a general 'en' alternate pointing to the primary en-IN
            'en': `${baseUrl}/en-IN${route.path}`,
            'x-default': `${baseUrl}/en-IN${route.path}`,
          },
        },
      });
    });
  });

  return sitemapEntries;
}
