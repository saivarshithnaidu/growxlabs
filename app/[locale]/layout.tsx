import React from "react";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Plus_Jakarta_Sans, Playfair_Display, Lora, Outfit } from "next/font/google";
import { GlobalBackground } from "@/components/layout/GlobalBackground";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { WhatsAppWidget } from "@/components/shared/WhatsAppWidget";
import { Toaster } from "sonner";
import { locales } from "@/navigation";
import Script from "next/script";
import { PHProvider } from "@/components/providers/PostHogProvider";
import "../globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
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
      default: "GrowXLabsTech — AI Native Digital Agency",
      template: "%s | GrowXLabsTech"
    },
    description: "GrowXLabsTech is a global AI native digital agency building AI powered websites, n8n automation systems, and business growth tools. We help restaurants, real estate agencies, and growing businesses worldwide stop losing customers through automated follow ups and intelligent lead capture. 7 day delivery. Serving clients worldwide.",
    alternates: {
      canonical: `https://growxlabs.tech/${locale}`,
      languages
    },
    openGraph: {
      url: `https://growxlabs.tech/${locale}/`,
      siteName: 'GrowXLabsTech',
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
    <html lang={locale} dir={direction} className={`${sans.variable} ${serif.variable} ${lora.variable} ${outfit.variable} h-full antialiased`} suppressHydrationWarning>
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
                  "name": "GrowXLabsTech",
                  "url": "https://growxlabs.tech",
                  "logo": "https://growxlabs.tech/logo.png",
                  "description": "AI native digital agency building AI powered websites, automation systems, and full stack AI products.",
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
                    "email": "sai@growxlabs.tech",
                    "contactType": "customer support",
                    "availableLanguage": ["English", "Telugu", "Hindi", "Arabic"]
                  },
                  "areaServed": "Worldwide",
                  "serviceArea": {
                    "@type": "GeoShape",
                    "description": "Worldwide — serving clients across all countries"
                  },
                  "knowsAbout": [
                    "Web Development",
                    "AI Integration",
                    "Business Automation",
                    "n8n Workflows",
                    "Restaurant Technology",
                    "Real Estate CRM",
                    "WhatsApp Automation",
                    "Lead Generation",
                    "E-commerce Development",
                    "SaaS Development",
                    "AI Chatbots",
                    "Generative AI",
                    "Prompt Engineering",
                    "RAG Systems",
                    "Multi-Agent Systems",
                    "Agentic AI",
                    "AI Developer Tools",
                    "Agent Runtimes",
                    "Multi-Agent Orchestration"
                  ],
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
                  "jobTitle": "Co Founder",
                  "worksFor": { "@id": "https://growxlabs.tech/#organization" }
                },
                {
                  "@type": "Person",
                  "@id": "https://growxlabs.tech/#akhilesh",
                  "name": "Akhilesh",
                  "jobTitle": "Co Founder",
                  "worksFor": { "@id": "https://growxlabs.tech/#organization" }
                },
                {
                  "@type": "WebSite",
                  "@id": "https://growxlabs.tech/#website",
                  "url": "https://growxlabs.tech",
                  "name": "GrowXLabsTech",
                  "publisher": { "@id": "https://growxlabs.tech/#organization" }
                },
                {
                  "@type": "SoftwareApplication",
                  "@id": "https://growxlabs.tech/products/resumeforgeai#product",
                  "name": "ResumeForgeAI",
                  "applicationCategory": "BusinessApplication",
                  "operatingSystem": "Web",
                  "creator": { "@id": "https://growxlabs.tech/#organization" },
                  "description": "AI powered resume builder with intelligent optimization.",
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
                  "description": "AI driven recruitment and talent acquisition platform."
                },
                {
                  "@type": "SoftwareApplication",
                  "@id": "https://growxlabs.tech/products/3rdmind#product",
                  "name": "3RDMIND",
                  "applicationCategory": "BusinessApplication",
                  "operatingSystem": "Web",
                  "creator": { "@id": "https://growxlabs.tech/#organization" },
                  "description": "Autonomous startup simulation and multi-agent coordination system that automates business operations.",
                  "url": "https://growxlabs.tech/products/3rdmind"
                },
                {
                  "@type": "SoftwareApplication",
                  "@id": "https://growxlabs.tech/products/pipper#product",
                  "name": "Pipper",
                  "applicationCategory": "DeveloperApplication",
                  "operatingSystem": "All",
                  "creator": { "@id": "https://growxlabs.tech/#organization" },
                  "description": "Unified agent developer harness and desktop runtime for Codex, Claude-Code, and OpenCode orchestration.",
                  "url": "https://growxlabs.tech/products/pipper"
                }
              ]
            })
          }}
        />

        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="lazyOnload"
            />
            <Script id="google-analytics" strategy="lazyOnload">
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "GrowXLabsTech",
              "url": "https://growxlabs.tech",
              "logo": "https://growxlabs.tech/logo.png",
              "description": "Global AI native digital agency building AI powered websites, n8n automation, and business growth tools worldwide.",
              "foundingDate": "2026",
              "email": "sai@growxlabs.tech",
              "areaServed": "Worldwide",
              "sameAs": [
                "https://linkedin.com/company/growxlabstech",
                "https://instagram.com/growxlabstech"
              ],
              "knowsAbout": [
                "Web Development",
                "AI Integration",
                "n8n Automation",
                "Restaurant Technology",
                "Real Estate CRM",
                "WhatsApp Automation",
                "Lead Generation",
                "Multi-Agent Systems",
                "Agentic AI"
              ]
            })
          }}
        />
        <PHProvider>
          <NextIntlClientProvider messages={messages} locale={locale}>
            <AuthProvider>
              <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
                <GlobalBackground />

                <ConditionalLayout>
                  {children}
                </ConditionalLayout>

                <CookieConsent />
                <WhatsAppWidget />
                <Toaster position="top-right" expand={false} richColors />
              </ThemeProvider>

            </AuthProvider>
          </NextIntlClientProvider>
        </PHProvider>
      </body>
    </html>
  );
}
