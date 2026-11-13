// Currency detection and formatting utility

import { functionUrl } from './api';

export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
}

export const NGN: CurrencyInfo = {
  code: 'NGN',
  symbol: '₦',
  name: 'Nigerian Naira',
};

export const USD: CurrencyInfo = {
  code: 'USD',
  symbol: '$',
  name: 'US Dollar',
};

const USD_TO_NGN = 1500;
const CURRENCY_OVERRIDE_KEY = 'wakapadi_currency';

function currencyFromCode(code: string): CurrencyInfo | null {
  if (code === 'NGN') return NGN;
  if (code === 'USD') return USD;
  return null;
}

function readCurrencyOverride(): CurrencyInfo | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get('currency')?.toUpperCase();
    if (fromUrl) {
      const currency = currencyFromCode(fromUrl);
      if (currency) {
        sessionStorage.setItem(CURRENCY_OVERRIDE_KEY, currency.code);
        return currency;
      }
    }
    const stored = sessionStorage.getItem(CURRENCY_OVERRIDE_KEY);
    if (stored) return currencyFromCode(stored);
  } catch {
    // sessionStorage or URL may be unavailable
  }
  return null;
}

function hasNigeriaLocaleHints(): boolean {
  try {
    if (Intl.DateTimeFormat().resolvedOptions().timeZone === 'Africa/Lagos') {
      return true;
    }
    const languages = navigator.languages?.length
      ? navigator.languages
      : [navigator.language];
    return languages.some((locale) => locale.split('-')[1]?.toUpperCase() === 'NG');
  } catch {
    return false;
  }
}

async function fetchCountryFromGeo(): Promise<string | null> {
  try {
    const res = await fetch(functionUrl('geo-country'));
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data?.country === 'string' ? data.country.toUpperCase() : null;
  } catch {
    return null;
  }
}

export async function detectCurrencyAsync(): Promise<CurrencyInfo> {
  const override = readCurrencyOverride();
  if (override) return override;

  if (hasNigeriaLocaleHints()) return NGN;

  const country = await fetchCountryFromGeo();
  if (country === 'NG') return NGN;

  return USD;
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
export function getPackagePrice(
  pkg: { priceUsd: number; priceNgn?: number },
  currency: CurrencyInfo
): {
  amount: number;
  formatted: string;
} {
  if (currency.code === 'NGN') {
    const amount = pkg.priceNgn ?? Math.round(pkg.priceUsd * USD_TO_NGN);
    return {
      amount,
      formatted: formatPrice(amount, currency),
    };
  }

  return {
    amount: pkg.priceUsd,
    formatted: formatPrice(pkg.priceUsd, currency),
  };
}

// Convert to Paystack amount (kobo for NGN, cents for USD)
export function toPaystackAmount(amount: number, currencyCode: string): number {
  return Math.round(amount * 100);
}
