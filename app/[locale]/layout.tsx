import React from "react";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter } from "next/font/google";
import { GlobalBackground } from "@/components/layout/GlobalBackground";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { Toaster } from "sonner";
import { locales } from "@/navigation";
import Script from "next/script";
import { PHProvider } from "@/components/providers/PostHogProvider";
import "../globals.css";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-sans",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  const languages: Record<string, string> = {
    'x-default': 'https://growxlabs.tech/en-IN',
  };
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
      canonical: `https://growxlabs.tech/en-IN`,
      languages
    },
    openGraph: {
      url: `https://growxlabs.tech/en-IN/`,
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
  if (!messages) return null;
  const direction = locale.startsWith('ar') ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction} className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/* ELITE AEO: Entity-First Knowledge Graph */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://growxlabs.tech/#organization",
                  "name": "GrowX Labs",
                  "url": "https://growxlabs.tech",
                  "logo": "https://growxlabs.tech/logo.svg",
                  "description": "AI-Native digital agency building AI-powered websites, automation systems, and full-stack projects.",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Guntur",
                    "addressRegion": "Andhra Pradesh",
                    "addressCountry": "IN"
                  },
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "email": "hello@growxlabs.tech",
                    "contactType": "customer service"
                  },
                  "sameAs": [
                    "https://linkedin.com/company/growxlabs",
                    "https://github.com/saivarshithnaidu",
                    "https://x.com/growxlabs"
                  ],
                  "founder": [
                    {
                      "@type": "Person",
                      "@id": "https://growxlabs.tech/#founder-varshith",
                      "name": "Varshith Pujala",
                      "jobTitle": "Founder & Lead Engineer"
                    },
                    {
                      "@type": "Person",
                      "@id": "https://growxlabs.tech/#founder-akhilesh",
                      "name": "Akhilesh",
                      "jobTitle": "Co-Founder"
                    }
                  ]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://growxlabs.tech/#website",
                  "url": "https://growxlabs.tech",
                  "name": "GrowX Labs | AI-Native Digital Agency",
                  "publisher": { "@id": "https://growxlabs.tech/#organization" }
                },
                {
                  "@type": "SoftwareApplication",
                  "@id": "https://growxlabs.tech/#product",
                  "name": "GrowX Intelligence Matrix",
                  "applicationCategory": "BusinessApplication",
                  "operatingSystem": "Web",
                  "author": { "@id": "https://growxlabs.tech/#organization" },
                  "description": "Enterprise-grade AI automation and dashboard system for modern digital scaling."
                },
                {
                  "@type": "FAQPage",
                  "@id": "https://growxlabs.tech/#faq",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "What is GrowX Labs?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "GrowX Labs is an AI-Native digital agency that specializes in building high-performance websites and autonomous automation systems."
                      }
                    }
                  ]
                }
              ]
            })
          }}
        />

        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans relative" suppressHydrationWarning>
        <PHProvider>
          <NextIntlClientProvider messages={messages} locale={locale}>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false} disableTransitionOnChange>
              <GlobalBackground />
              
              <ConditionalLayout>
                {children}
              </ConditionalLayout>

              <CookieConsent />
              <Toaster position="top-right" expand={false} richColors />
            </ThemeProvider>
            
          </AuthProvider>
        </NextIntlClientProvider>
      </PHProvider>
    </body>
    </html>
  );
}
