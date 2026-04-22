import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter } from "next/font/google";
import { GlobalBackground } from "@/components/layout/GlobalBackground";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { LocaleRedirect } from "@/components/layout/LocaleRedirect";
import { CookieConsent } from "@/components/layout/CookieConsent";
import "../globals.css";
import { locales } from "@/navigation";
import Script from "next/script";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  const languages: Record<string, string> = {};
  locales.forEach((l) => {
    languages[l] = `https://growxlabs.tech/${l}`;
  });

  return {
    metadataBase: new URL('https://growxlabs.tech'),
    title: {
      default: "GrowX Labs — AI-Native Digital Agency",
      template: "%s | GrowX Labs"
    },
    description: "We build AI-powered websites, automation systems, and full-stack products that help businesses grow faster. Based in India, serving globally.",
    alternates: {
      canonical: `https://growxlabs.tech/${locale}`,
      languages
    },
    openGraph: {
      url: `https://growxlabs.tech/${locale}/`,
      siteName: 'GrowX Labs',
      type: 'website',
      images: [{ url: 'https://growxlabs.tech/og-image.png', width: 1200, height: 630 }],
    },
    icons: {
      icon: "/logo-symbol.svg",
    },
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const direction = locale.startsWith('ar') ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction} className={`${inter.variable} h-full antialiased dark`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans relative" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
              <GlobalBackground />
              
              <LocaleRedirect />
              <ConditionalLayout>
                {children}
              </ConditionalLayout>

              <CookieConsent />
            </ThemeProvider>
            
            <Script 
              id="apollo-tracker" 
              strategy="lazyOnload"
              dangerouslySetInnerHTML={{
                __html: `
                  (function initApollo(){
                    if (window.apolloInitialized) return;
                    
                    function startTracking() {
                      if (window.apolloInitialized) return;
                      window.apolloInitialized = true;
                      
                      var n=Math.random().toString(36).substring(7),
                      o=document.createElement("script");
                    
                      o.src="https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache="+n;
                      o.async=true;
                      o.defer=true;
                    
                      o.onload=function(){
                        if (window.trackingFunctions) {
                          window.trackingFunctions.onLoad({
                            appId:"69bffd4fc1dee4001d17a7f6"
                          });
                        }
                      };
                    
                      document.head.appendChild(o);
                    }

                    function handleInteraction() {
                      startTracking();
                      ['mousedown', 'mousemove', 'keydown', 'touchstart', 'scroll'].forEach(e => 
                        window.removeEventListener(e, handleInteraction)
                      );
                    }

                    // Pre-consent check
                    try {
                      const consent = localStorage.getItem("growx_cookie_consent");
                      if (consent === "accepted") {
                        ['mousedown', 'mousemove', 'keydown', 'touchstart', 'scroll'].forEach(e => 
                          window.addEventListener(e, handleInteraction, { once: true, passive: true })
                        );
                      } else {
                        window.addEventListener("growx_consent_accepted", () => {
                          ['mousedown', 'mousemove', 'keydown', 'touchstart', 'scroll'].forEach(e => 
                            window.addEventListener(e, handleInteraction, { once: true, passive: true })
                          );
                        });
                      }
                    } catch (e) {
                      window.addEventListener("growx_consent_accepted", () => {
                        ['mousedown', 'mousemove', 'keydown', 'touchstart', 'scroll'].forEach(e => 
                          window.addEventListener(e, handleInteraction, { once: true, passive: true })
                        );
                      });
                    }
                  })();
                `
              }}
            />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
