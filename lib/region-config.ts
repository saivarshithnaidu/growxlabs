export const REGION_CONFIG = {
  "en-IN": { country: "India", city: "Hyderabad", currency: "INR" },
  "en-US": { country: "USA", city: "Delaware", currency: "USD" },
  "en-GB": { country: "UK", city: "London", currency: "GBP" },
  "hi": { country: "India", city: "Hyderabad", currency: "INR" },
  "te": { country: "India", city: "Hyderabad", currency: "INR" },
  "de": { country: "Germany", city: "Berlin", currency: "EUR" },
  "fr": { country: "France", city: "Paris", currency: "EUR" },
  "es": { country: "Spain", city: "Madrid", currency: "EUR" },
  "pt": { country: "Brazil", city: "São Paulo", currency: "BRL" },
  "ja": { country: "Japan", city: "Tokyo", currency: "JPY" },
  "zh": { country: "China", city: "Beijing", currency: "CNY" },
  "ko": { country: "Korea", city: "Seoul", currency: "KRW" },
  "id": { country: "Indonesia", city: "Jakarta", currency: "IDR" },
  "ar": { country: "UAE", city: "Dubai", currency: "AED" }
} as const;

export type SupportedLocale = keyof typeof REGION_CONFIG;

export const getRegionData = (locale: string) => {
  return REGION_CONFIG[locale as SupportedLocale] || REGION_CONFIG["en-IN"];
};

export const formatCurrency = (amount: number, locale: string) => {
  const region = getRegionData(locale);
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: region.currency,
      maximumFractionDigits: 0
    }).format(amount);
  } catch (e) {
    // Fallback if locale/currency combination is unsupported by Intl
    return `${region.currency} ${amount.toLocaleString()}`;
  }
};
