import { createNavigation } from 'next-intl/navigation';

export const locales = ['en', 'en-IN', 'en-US', 'en-GB', 'en-AU'] as const;

export const localePrefix = 'always'; 

export const { Link, redirect, usePathname, useRouter } =
  createNavigation({ locales, localePrefix, defaultLocale: 'en-IN' });
