"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { locales } from "@/navigation";

export function LocaleRedirect() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check if we are at the root path without a locale
    const segments = pathname.split("/");
    const currentLocale = segments[1];
    
    // If the first segment is not a valid locale, detect and redirect
    if (!locales.includes(currentLocale as any)) {
      const storedLocale = localStorage.getItem("growx_user_locale");
      const browserLocale = navigator.language;
      
      let targetLocale = "en-IN"; // Default to en-IN
      
      if (storedLocale && locales.includes(storedLocale as any)) {
        targetLocale = storedLocale;
      } else if (browserLocale) {
        // Simple logic: if browser indicates India, keep en-IN, else use en-US (or others as matched)
        if (browserLocale.includes("IN")) targetLocale = "en-IN";
        else if (browserLocale.startsWith("en")) targetLocale = "en-US";
        else {
           // Fallback for other browsers if needed, but stick to en-US as default others
           targetLocale = "en-US";
        }
      }
      
      // Save it
      localStorage.setItem("growx_user_locale", targetLocale);
      
      // The middleware should have already handled this, but this is a safety fallback for root
      if (pathname === "/") {
         router.replace(`/${targetLocale}`);
      }
    } else {
      // If we are already on a locale-prefixed path, update the preference
      localStorage.setItem("growx_user_locale", currentLocale);
    }
  }, [pathname, router]);

  return null;
}
