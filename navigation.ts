import React from 'react';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { usePathname as useNextPathname, useRouter as useNextRouter, redirect as nextRedirect } from 'next/navigation';

export const locales = ['en', 'en-IN', 'en-US', 'en-GB', 'en-AU'] as const;

export const localePrefix = 'always'; 

export const Link = React.forwardRef<HTMLAnchorElement, React.ComponentPropsWithoutRef<typeof NextLink>>(
  ({ href, ...props }, ref) => {
    let cleanHref = href;
    if (typeof href === 'string') {
      cleanHref = href.replace(/^\/(en-IN|en-US|en-GB|en-AU|en|ar)(\/|$)/, '/');
      if (cleanHref === '') cleanHref = '/';
    }
    return React.createElement(NextLink, { ref, href: cleanHref, ...props });
  }
);
Link.displayName = 'Link';

export const redirect = nextRedirect;

export function usePathname() {
  const pathname = useNextPathname();
  if (!pathname) return pathname;
  const cleaned = pathname.replace(/^\/(en-IN|en-US|en-GB|en-AU|en|ar)(\/|$)/, '/');
  return cleaned;
}

export function useRouter() {
  const router = useNextRouter();
  const nextRouter = useNextRouter();
  return {
    ...nextRouter,
    push: (href: string, options?: any) => {
      const cleanHref = href.replace(/^\/(en-IN|en-US|en-GB|en-AU|en|ar)(\/|$)/, '/');
      router.push(cleanHref === '' ? '/' : cleanHref, options);
    },
    replace: (href: string, options?: any) => {
      const cleanHref = href.replace(/^\/(en-IN|en-US|en-GB|en-AU|en|ar)(\/|$)/, '/');
      router.replace(cleanHref === '' ? '/' : cleanHref, options);
    }
  };
}
