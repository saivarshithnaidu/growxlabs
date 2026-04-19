import { createNavigation } from 'next-intl/navigation';

export const locales = [
  'en-US', 'en-GB', 'en-AU', 'en-IN', 'te-IN', 'hi-IN', 
  'ar-AE', 'de-DE', 'fr-FR', 'es-ES', 'pt-BR', 
  'ja-JP', 'zh-CN', 'ko-KR', 'id-ID'
] as const;

export const localePrefix = 'always'; 

export const { Link, redirect, usePathname, useRouter } =
  createNavigation({ locales, localePrefix });
