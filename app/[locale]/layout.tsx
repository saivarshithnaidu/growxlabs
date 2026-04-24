import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter, Caveat } from "next/font/google";
import { GlobalBackground } from "@/components/layout/GlobalBackground";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { CookieConsent } from "@/components/layout/CookieConsent";
import "../globals.css";
import { locales } from "@/navigation";
import Script from "next/script";
import { Toaster } from "sonner";


const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-cursive",
  display: "swap",
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
  if (!messages) return null;
  const direction = locale.startsWith('ar') ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction} className={`${inter.variable} ${caveat.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans relative" suppressHydrationWarning>
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
      </body>
    </html>
  );
}
