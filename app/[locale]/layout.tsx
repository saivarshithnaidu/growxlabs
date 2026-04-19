import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter } from "next/font/google";
import { GlobalBackground } from "@/components/layout/GlobalBackground";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { CookieConsent } from "@/components/layout/CookieConsent";
import "../globals.css";
import { locales } from "@/navigation";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

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
      default: "GrowX Labs | Web Development & Automation Agency",
      template: "%s | GrowX Labs"
    },
    description: "We build websites and automation systems that grow your business. High-performance, scalable solutions for modern enterprises.",
    alternates: {
      canonical: `/${locale}`,
      languages
    },
    openGraph: {
      url: `https://growxlabs.tech/${locale}/`,
      siteName: 'GrowX Labs',
      type: 'website',
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
              
              <ConditionalLayout>
                {children}
              </ConditionalLayout>

              <CookieConsent />
              
              <Script id="apollo-tracker" strategy="afterInteractive">
                {`
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

                    // Check for existing consent safely
                    try {
                      if (localStorage.getItem("growx_cookie_consent") === "accepted") {
                        startTracking();
                      } else {
                        // Wait for consent event
                        window.addEventListener("growx_consent_accepted", startTracking);
                      }
                    } catch (e) {
                      // If storage is blocked, we just wait for the event which is memory-bound
                      window.addEventListener("growx_consent_accepted", startTracking);
                    }
                  })();
                `}
              </Script>
            </ThemeProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
