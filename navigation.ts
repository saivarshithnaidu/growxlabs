import { createNavigation } from 'next-intl/navigation';

export const locales = [
  'en-IN', 'en-US', 'en-GB', 'hi', 'te', 'ar', 'de', 'fr', 'es', 'pt', 'ja', 'zh', 'ko', 'id'
] as const;

export const localePrefix = 'always'; 

export const { Link, redirect, usePathname, useRouter } =
  createNavigation({ locales, localePrefix, defaultLocale: 'en-IN' });
