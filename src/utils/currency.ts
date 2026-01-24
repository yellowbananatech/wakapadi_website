// Currency detection and formatting utility

export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
}

// Currency mappings for different countries
const CURRENCY_MAP: Record<string, CurrencyInfo> = {
  NG: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  KE: { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  GH: { code: 'GHS', symbol: '₵', name: 'Ghanaian Cedi' },
  ZA: { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  US: { code: 'USD', symbol: '$', name: 'US Dollar' },
  GB: { code: 'GBP', symbol: '£', name: 'British Pound' },
  CA: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  AU: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  // Default to USD for other countries
};

// Exchange rates (base: USD) - These should be updated regularly or fetched from an API
const EXCHANGE_RATES: Record<string, number> = {
  NGN: 1500, // 1 USD = 1500 NGN (approximate)
  KES: 130,  // 1 USD = 130 KES (approximate)
  GHS: 12,   // 1 USD = 12 GHS (approximate)
  ZAR: 18,   // 1 USD = 18 ZAR (approximate)
  USD: 1,
  GBP: 0.79, // 1 USD = 0.79 GBP (approximate)
  CAD: 1.35, // 1 USD = 1.35 CAD (approximate)
  AUD: 1.52, // 1 USD = 1.52 AUD (approximate)
};

// Package prices in USD (base currency)
export interface PackagePrice {
  usd: number;
}

// Detect user's currency based on browser locale or IP geolocation
export function detectCurrency(): CurrencyInfo {
  // Try to get from browser locale
  try {
    const locale = navigator.language || 'en-US';
    const countryCode = locale.split('-')[1]?.toUpperCase();
    
    if (countryCode && CURRENCY_MAP[countryCode]) {
      return CURRENCY_MAP[countryCode];
    }
  } catch (e) {
    console.warn('Could not detect currency from locale:', e);
  }
  
  // Default to USD
  return CURRENCY_MAP['US'];
}

// Convert USD amount to target currency
export function convertCurrency(usdAmount: number, targetCurrency: string): number {
  const rate = EXCHANGE_RATES[targetCurrency] || 1;
  return usdAmount * rate;
}

// Format price with currency symbol
export function formatPrice(amount: number, currency: CurrencyInfo): string {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  
  return `${currency.symbol}${formatted}`;
}

// Get package price in user's currency
export function getPackagePrice(usdPrice: number, currency: CurrencyInfo): {
  amount: number;
  formatted: string;
} {
  const converted = convertCurrency(usdPrice, currency.code);
  return {
    amount: converted,
    formatted: formatPrice(converted, currency),
  };
}

// Convert to Paystack amount (kobo for NGN, cents for USD)
// Paystack primarily uses NGN (kobo) and USD (cents)
export function toPaystackAmount(amount: number, currencyCode: string): number {
  if (currencyCode === 'NGN') {
    // Amount is already in Naira, convert to kobo (multiply by 100)
    return Math.round(amount * 100);
  } else if (currencyCode === 'USD') {
    // Amount is already in USD, convert to cents (multiply by 100)
    return Math.round(amount * 100);
  } else {
    // For other currencies, convert to USD first, then to cents
    // This assumes the amount is in the local currency
    const usdAmount = amount / EXCHANGE_RATES[currencyCode];
    return Math.round(usdAmount * 100);
  }
}
