/**
 * Unified Currency Utility
 * Single source of truth for currency rates, conversions, and symbols
 * 
 * Features:
 * - 100+ currencies with rates
 * - API fetch with 2-day cache
 * - Fallback rates when API unavailable
 * - Synchronous and async versions
 */

import { CurrencyRates, CurrencySymbols } from "../types";

// ============================================================================
// Fallback Currency Rates (1 unit = X USD)
// ============================================================================

const FALLBACK_CURRENCY_RATES: CurrencyRates = {
  // Major currencies
  USD: 1.0,
  EUR: 1.10,
  GBP: 1.27,
  JPY: 0.0067,
  CNY: 0.14,
  
  // Americas
  CAD: 0.74,
  AUD: 0.67,
  BRL: 0.20,
  MXN: 0.059,
  ARS: 0.0007,
  CLP: 0.0011,
  COP: 0.00027,
  PEN: 0.30,
  
  // Asia
  INR: 0.012,
  BDT: 0.0082,
  KRW: 0.00076,
  THB: 0.028,
  IDR: 0.000064,
  PHP: 0.018,
  VND: 0.000041,
  MYR: 0.21,
  SGD: 0.74,
  HKD: 0.13,
  TWD: 0.032,
  LKR: 0.0033,
  PKR: 0.0036,
  KZT: 0.0022,
  
  // Middle East
  AED: 0.27,
  SAR: 0.27,
  ILS: 0.27,
  TRY: 0.023,
  BHD: 2.65,
  IQD: 0.00076,
  QAR: 0.27,
  JOD: 1.41,
  OMR: 2.60,
  
  // Europe
  CHF: 1.15,
  CZK: 0.044,
  DKK: 0.15,
  NOK: 0.095,
  SEK: 0.095,
  PLN: 0.25,
  RON: 0.22,
  HUF: 0.0028,
  RUB: 0.011,
  RSD: 0.0067,
  BGN: 0.55,
  ISK: 0.0080,
  UAH: 0.023,
  MDL: 0.056,
  
  // Africa
  EGP: 0.021,
  ZAR: 0.055,
  NGN: 0.00070,
  KES: 0.0075,
  KSH: 0.0075, // Alternative code for KES
  TZS: 0.0004,
  UGX: 0.00027,
  GHS: 0.067,
  MAD: 0.10,
  TND: 0.32,
  DZD: 0.0067,
  CVE: 0.010,
  
  // Oceania
  NZD: 0.61,
  
  // Additional
  LBP: 0.000011,
  LAK: 0.000048,
  UZS: 0.000081,
  KHR: 0.00025,
  PYG: 0.00014,
  BOB: 0.15,
  GEL: 0.33,
  CRC: 0.0020,
  GYD: 0.0048,
  MMK:0.000476
};

// ============================================================================
// Currency Symbols
// ============================================================================

const CURRENCY_SYMBOLS: CurrencySymbols = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CNY: "¥",
  INR: "₹",
  KRW: "₩",
  TRY: "₺",
  BRL: "R$",
  MXN: "$",
  ARS: "$",
  THB: "฿",
  IDR: "Rp",
  PHP: "₱",
  VND: "₫",
  MYR: "RM",
  SGD: "S$",
  NZD: "NZ$",
  ZAR: "R",
  AED: "د.إ",
  SAR: "﷼",
  ILS: "₪",
  EGP: "E£",
  CLP: "$",
  COP: "$",
  PEN: "S/",
  CAD: "C$",
  AUD: "A$",
  BHD: ".د.ب",
  CHF: "CHF",
  CZK: "Kč",
  DKK: "kr",
  GHS: "₵",
  HKD: "HK$",
  TWD: "NT$",
  HUF: "Ft",
  IQD: "ع.د",
  KES: "KSh",
  LKR: "Rs",
  MAD: "د.م.",
  NGN: "₦",
  NOK: "kr",
  PLN: "zł",
  RON: "lei",
  SEK: "kr",
  TND: "د.ت",
  TZS: "TSh",
  UGX: "USh",
  CVE: "$",
  RUB: "₽",
  PKR: "Rs",
  KZT: "₸",
  UAH: "₴",
};

// ============================================================================
// Currency Code Normalization
// ============================================================================

const CURRENCY_CODE_MAP: Record<string, string> = {
  'KSH': 'KES', // Kenyan Shilling
};

// ============================================================================
// Rate Cache
// ============================================================================

interface RateCache {
  rates: CurrencyRates;
  timestamp: number;
}

let rateCache: RateCache | null = null;
const CACHE_DURATION_MS = 2 * 24 * 60 * 60 * 1000; // 2 days

// ============================================================================
// Helper Functions
// ============================================================================

function normalizeCurrencyCode(currency: string): string {
  const normalized = currency.toUpperCase();
  return CURRENCY_CODE_MAP[normalized] || normalized;
}

// ============================================================================
// Async Functions (with API fetch)
// ============================================================================

async function fetchExchangeRates(): Promise<CurrencyRates> {
  // Check cache first
  if (rateCache && Date.now() - rateCache.timestamp < CACHE_DURATION_MS) {
    return rateCache.rates;
  }

  try {
    const response = await fetch(
      'https://v6.exchangerate-api.com/v6/506673e59f820780b9a1e59c/latest/USD'
    );

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();

    if (data.result !== 'success') {
      throw new Error(`API returned error: ${data.result}`);
    }

    // Convert: if 1 USD = X currency, then 1 currency = 1/X USD
    const rates: CurrencyRates = { USD: 1.0 };
    
    for (const [currency, rate] of Object.entries(data.conversion_rates || {})) {
      if (typeof rate === 'number' && rate > 0) {
        rates[currency.toUpperCase()] = 1 / rate;
      }
    }

    // Merge with fallback (API takes precedence)
    const mergedRates = { ...FALLBACK_CURRENCY_RATES, ...rates };
    
    rateCache = { rates: mergedRates, timestamp: Date.now() };
    
    return mergedRates;
  } catch (error) {
    console.warn('Failed to fetch exchange rates:', error);
    return FALLBACK_CURRENCY_RATES;
  }
}

let ratesPromise: Promise<CurrencyRates> | null = null;

export async function getCurrencyRates(): Promise<CurrencyRates> {
  if (rateCache && Date.now() - rateCache.timestamp < CACHE_DURATION_MS) {
    return rateCache.rates;
  }

  if (ratesPromise) {
    return ratesPromise;
  }

  ratesPromise = fetchExchangeRates();
  const rates = await ratesPromise;
  ratesPromise = null;

  return rates;
}

// ============================================================================
// Synchronous Functions (uses cache or fallback)
// ============================================================================

export function getCurrencyRatesSync(): CurrencyRates {
  if (rateCache && Date.now() - rateCache.timestamp < CACHE_DURATION_MS) {
    return rateCache.rates;
  }
  return FALLBACK_CURRENCY_RATES;
}

// ============================================================================
// Conversion Functions
// ============================================================================

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  if (amount <= 0) return 0;
  
  const normalizedFrom = normalizeCurrencyCode(fromCurrency);
  const normalizedTo = normalizeCurrencyCode(toCurrency);

  if (normalizedFrom === normalizedTo) return amount;

  const rates = getCurrencyRatesSync();
  const fromRate = rates[normalizedFrom] || 1;
  const toRate = rates[normalizedTo] || 1;

  const usdAmount = amount * fromRate;
  return usdAmount / toRate;
}

export async function convertCurrencyAsync(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<number> {
  if (amount <= 0) return 0;
  
  const normalizedFrom = normalizeCurrencyCode(fromCurrency);
  const normalizedTo = normalizeCurrencyCode(toCurrency);

  if (normalizedFrom === normalizedTo) return amount;

  const rates = await getCurrencyRates();
  const fromRate = rates[normalizedFrom] || 1;
  const toRate = rates[normalizedTo] || 1;

  const usdAmount = amount * fromRate;
  return usdAmount / toRate;
}

export function convertToUSD(amount: number, fromCurrency: string): number {
  if (amount <= 0) return 0;
  
  const normalized = normalizeCurrencyCode(fromCurrency);
  if (normalized === 'USD') return amount;

  const rates = getCurrencyRatesSync();
  const rate = rates[normalized];

  if (!rate) {
    console.warn(`Currency rate not found for ${fromCurrency}, assuming USD`);
    return amount;
  }

  return amount * rate;
}

export async function convertToUSDAsync(amount: number, fromCurrency: string): Promise<number> {
  if (amount <= 0) return 0;
  
  const normalized = normalizeCurrencyCode(fromCurrency);
  if (normalized === 'USD') return amount;

  const rates = await getCurrencyRates();
  const rate = rates[normalized];

  if (!rate) {
    console.warn(`Currency rate not found for ${fromCurrency}, assuming USD`);
    return amount;
  }

  return amount * rate;
}

// ============================================================================
// Symbol Functions
// ============================================================================

export function getCurrencySymbol(currency: string): string {
  const normalized = normalizeCurrencyCode(currency);
  return CURRENCY_SYMBOLS[normalized] || normalized;
}

// ============================================================================
// Utility Functions
// ============================================================================

export function isUSD(currency: string, currencyName?: string): boolean {
  const normalized = currency.toUpperCase();
  
  if (normalized === 'USD') return true;
  
  if (currencyName) {
    const nameLower = currencyName.toLowerCase();
    if (nameLower.includes('us dollar') || nameLower.includes('united states dollar')) {
      return true;
    }
  }
  
  return false;
}

export function formatPrice(
  amount: number,
  currency: string,
  format: 'USD' | 'original' | 'both' = 'both'
): string {
  const symbol = getCurrencySymbol(currency);
  const amountUSD = convertToUSD(amount, currency);
  
  if (format === 'USD') {
    return `$${amountUSD.toFixed(2)}`;
  }
  
  if (format === 'original') {
    return `${symbol}${amount.toFixed(2)}`;
  }
  
  // 'both'
  if (currency.toUpperCase() === 'USD') {
    return `$${amount.toFixed(2)}`;
  }
  
  return `$${amountUSD.toFixed(2)} (${symbol}${amount.toFixed(2)})`;
}

export function formatPriceWithCurrency(
  usdAmount: number,
  originalAmount: number,
  currency: string,
  currencySymbol?: string
): string {
  const symbol = currencySymbol || getCurrencySymbol(currency);
  const formattedUSD = `$${usdAmount.toFixed(2)}`;
  const formattedOriginal = `${symbol}${originalAmount.toFixed(2)}`;

  if (currency.toUpperCase() === 'USD') {
    return formattedUSD;
  }

  return `${formattedUSD} (${formattedOriginal})`;
}

export async function prefetchCurrencyRates(): Promise<void> {
  await getCurrencyRates();
}
