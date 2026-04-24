import { MetadataRoute } from 'next';
import { locales } from '@/navigation';

const baseUrl = 'https://growxlabs.tech';

const marketingRoutes = [
  '',
  '/services',
  '/portfolio',
  '/courses',
  '/pricing',
  '/subscriptions',
  '/about',
  '/contact',
  '/terms',
  '/privacy',
  '/refund-policy',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  marketingRoutes.forEach((route) => {
    locales.forEach((locale) => {
      const url = `${baseUrl}/${locale}${route}`;
      
      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1.0 : 0.8,
        // Add alternate language versions for SEO
        alternates: {
          languages: locales.reduce((acc, l) => {
            acc[l] = `${baseUrl}/${l}${route}`;
            return acc;
          }, {} as Record<string, string>),
        },
      });
    });
  });

  return sitemapEntries;
}
