import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GlobalBackground } from "@/components/layout/GlobalBackground";
import { GrowXChatWidget } from "@/components/ui/GrowXChatWidget";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "GrowX Labs | Web Development & Automation Agency",
  description: "We build websites and automation systems that grow your business. High-performance, scalable solutions for modern enterprises.",
  icons: {
    icon: "/logo-symbol.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans relative" suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
            <GlobalBackground />
            <Navbar />
            <main className="flex-grow container mx-auto px-4 relative z-10">
              {children}
            </main>
            <Footer />
            <GrowXChatWidget />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
