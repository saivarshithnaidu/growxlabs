export const LOCALE_CURRENCY_MAP: Record<string, { symbol: string; code: string }> = {
  'en-IN': { symbol: '₹', code: 'INR' },
  'te-IN': { symbol: '₹', code: 'INR' },
  'hi-IN': { symbol: '₹', code: 'INR' },
  'en-US': { symbol: '$', code: 'USD' },
  'en-GB': { symbol: '£', code: 'GBP' },
  'en-AU': { symbol: '$', code: 'AUD' },
  'ar-AE': { symbol: 'AED', code: 'AED' },
  'de-DE': { symbol: '€', code: 'EUR' },
  'fr-FR': { symbol: '€', code: 'EUR' },
  'es-ES': { symbol: '€', code: 'EUR' },
  'pt-BR': { symbol: 'R$', code: 'BRL' },
  'ja-JP': { symbol: '¥', code: 'JPY' },
  'zh-CN': { symbol: '¥', code: 'CNY' },
  'ko-KR': { symbol: '₩', code: 'KRW' },
  'id-ID': { symbol: 'Rp', code: 'IDR' }
};

export function getCurrency(locale: string) {
  return LOCALE_CURRENCY_MAP[locale] || LOCALE_CURRENCY_MAP['en-US'];
}
