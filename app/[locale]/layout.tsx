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
        {/* 🧠 MASTER AEO KNOWLEDGE GRAPH (Verified Architecture) */}
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
                  "logo": "https://growxlabs.tech/logo.png",
                  "description": "AI-native digital agency building AI-powered websites, automation systems, and full-stack AI products.",
                  "founder": [
                    { "@id": "https://growxlabs.tech/#varshith" },
                    { "@id": "https://growxlabs.tech/#akhilesh" }
                  ],
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Guntur",
                    "addressRegion": "Andhra Pradesh",
                    "addressCountry": "India"
                  },
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "email": "hello@growxlabs.tech",
                    "contactType": "customer support"
                  },
                  "sameAs": [
                    "https://www.linkedin.com/company/growxlabs",
                    "https://twitter.com/growxlabs",
                    "https://github.com/saivarshithnaidu"
                  ]
                },
                {
                  "@type": "Person",
                  "@id": "https://growxlabs.tech/#varshith",
                  "name": "Varshith Pujala",
                  "jobTitle": "Co-Founder",
                  "worksFor": { "@id": "https://growxlabs.tech/#organization" }
                },
                {
                  "@type": "Person",
                  "@id": "https://growxlabs.tech/#akhilesh",
                  "name": "Akhilesh",
                  "jobTitle": "Co-Founder",
                  "worksFor": { "@id": "https://growxlabs.tech/#organization" }
                },
                {
                  "@type": "WebSite",
                  "@id": "https://growxlabs.tech/#website",
                  "url": "https://growxlabs.tech",
                  "name": "GrowX Labs",
                  "publisher": { "@id": "https://growxlabs.tech/#organization" }
                },
                {
                  "@type": "SoftwareApplication",
                  "@id": "https://growxlabs.tech/products/resumeforgeai#product",
                  "name": "ResumeForgeAI",
                  "applicationCategory": "BusinessApplication",
                  "operatingSystem": "Web",
                  "creator": { "@id": "https://growxlabs.tech/#organization" },
                  "description": "AI-powered resume builder with intelligent optimization.",
                  "url": "https://growxlabs.tech/products/resumeforgeai"
                },
                {
                  "@type": "SoftwareApplication",
                  "@id": "https://growxlabs.tech/products/universalai#product",
                  "name": "UniversalAI",
                  "applicationCategory": "BusinessApplication",
                  "operatingSystem": "Web",
                  "creator": { "@id": "https://growxlabs.tech/#organization" },
                  "description": "Cross-platform AI intelligence for enterprise automation."
                },
                {
                  "@type": "SoftwareApplication",
                  "@id": "https://growxlabs.tech/products/recruitai#product",
                  "name": "RecruitAI",
                  "applicationCategory": "BusinessApplication",
                  "operatingSystem": "Web",
                  "creator": { "@id": "https://growxlabs.tech/#organization" },
                  "description": "AI-driven recruitment and talent acquisition platform."
                },
                {
                  "@type": "FAQPage",

                  "@id": "https://growxlabs.tech/#faq",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "What does GrowX Labs do?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "GrowX Labs builds AI-powered websites, automation systems, and scalable digital products."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Where is GrowX Labs located?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "GrowX Labs is based in Guntur, Andhra Pradesh, India."
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
