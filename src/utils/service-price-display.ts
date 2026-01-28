/**
 * Service Price Display Utility
 * Pure functions for price calculations and display data
 * 
 * Provides a unified API for:
 * - Cheapest price calculation
 * - User country price
 * - Savings percentage
 * - All prices sorted
 * - Display flags (percentageOnly, annualOnly, etc.)
 */

import { IService, IRegionalPrice } from "../types";
import {
  convertToUSD,
  getCurrencySymbol,
  isUSD,
} from "./currency";
import { getCountryFlag } from "./country-flags";
import { normalizeCountryCode, deduplicateRegionalPrices } from "./service-helpers";

// ============================================================================
// Types
// ============================================================================

export interface PriceDisplayOptions {
  includeAllPrices?: boolean;
  sortBy?: 'price' | 'country';
}

export interface PriceDisplayData {
  cheapest: {
    price: number;
    currency: string;
    symbol: string;
    country: string;
    countryCode: string;
    flag: string;
    priceInUSD: number;
  };
  
  userCountry: {
    price: number;
    currency: string;
    symbol: string;
    country: string;
    countryCode: string;
    flag: string;
    priceInUSD: number;
  };
  
  savings: {
    amountUSD: number;
    percentage: number;
    isPositive: boolean;
  };
  
  allPrices: AllPriceEntry[];
  
  isPercentageOnly: boolean;
  isAnnualOnly: boolean;
  isHidden: boolean;
  
  serviceName: string;
  serviceSlug: string;
  category: string;
}

interface AllPriceEntry {
  price: number;
  currency: string;
  symbol: string;
  country: string;
  countryCode: string;
  flag: string;
  priceInUSD: number;
}

interface RegionalPriceEntry {
  data: IRegionalPrice;
  priceInUSD: number;
}

// ============================================================================
// Main Function (Pure - no database calls)
// ============================================================================

export function getPriceDisplayData(
  service: IService,
  userCountryCode: string,
  regionalPrices: IRegionalPrice[],
  options?: PriceDisplayOptions
): PriceDisplayData | null {
  if (!regionalPrices || regionalPrices.length === 0) {
    return null;
  }

  // Deduplicate by countryCode
  const deduplicatedPrices = deduplicateRegionalPrices(regionalPrices);

  // Normalize user's country code
  const normalizedUserCountry = normalizeCountryCode(userCountryCode);

  // Find user's country price
  const userCountryPrice = deduplicatedPrices.find(
    (p: IRegionalPrice) => normalizeCountryCode(p.countryCode) === normalizedUserCountry
  );

  // Calculate USD value for each price and find cheapest
  const pricesWithUSD: RegionalPriceEntry[] = deduplicatedPrices.map((p: IRegionalPrice) => {
    let priceInUSD: number;
    
    if (isUSD(p.currency, p.currencyName)) {
      priceInUSD = p.price;
    } else {
      priceInUSD = convertToUSD(p.price, p.currency);
    }
    
    return { data: p, priceInUSD };
  });

  // Find cheapest
  const cheapestEntry = pricesWithUSD.reduce((cheapest, current) =>
    current.priceInUSD < cheapest.priceInUSD ? current : cheapest
  );

  // Find cheapest country price entry
  const cheapestCountryPrice = deduplicatedPrices.find(
    (p: IRegionalPrice) => normalizeCountryCode(p.countryCode) === normalizeCountryCode(cheapestEntry.data.countryCode)
  );

  if (!cheapestCountryPrice) {
    return null;
  }

  // Calculate user's price in USD
  let userPriceUSD: number;
  let userPriceOriginal: number;
  let userCurrency: string;
  let userSymbol: string;
  let userCountryName: string;
  let userCountryCodeNormalized: string;
  let userFlag: string;

  if (userCountryPrice) {
    userPriceOriginal = userCountryPrice.price;
    userCurrency = userCountryPrice.currency;
    userSymbol = userCountryPrice.currencySymbol || getCurrencySymbol(userCurrency);
    userCountryName = userCountryPrice.country;
    userCountryCodeNormalized = userCountryPrice.countryCode;
    userFlag = userCountryPrice.flag || getCountryFlag(userCountryPrice.countryCode);

    if (isUSD(userCurrency, userCountryPrice.currencyName)) {
      userPriceUSD = userPriceOriginal;
    } else {
      userPriceUSD = convertToUSD(userPriceOriginal, userCurrency);
    }
  } else {
    // Fallback: use US price
    const usPrice = deduplicatedPrices.find(
      (p: IRegionalPrice) => normalizeCountryCode(p.countryCode) === 'us'
    );
    
    if (usPrice) {
      userPriceOriginal = usPrice.price;
      userCurrency = usPrice.currency;
      userSymbol = usPrice.currencySymbol || getCurrencySymbol(userCurrency);
      userCountryName = usPrice.country;
      userCountryCodeNormalized = usPrice.countryCode;
      userFlag = usPrice.flag || getCountryFlag(usPrice.countryCode);
      
      if (isUSD(userCurrency, usPrice.currencyName)) {
        userPriceUSD = userPriceOriginal;
      } else {
        userPriceUSD = convertToUSD(userPriceOriginal, userCurrency);
      }
    } else {
      // Last resort: use cheapest price
      userPriceOriginal = cheapestCountryPrice.price;
      userCurrency = cheapestCountryPrice.currency;
      userSymbol = cheapestCountryPrice.currencySymbol || getCurrencySymbol(userCurrency);
      userCountryName = cheapestCountryPrice.country;
      userCountryCodeNormalized = cheapestCountryPrice.countryCode;
      userFlag = cheapestCountryPrice.flag || getCountryFlag(cheapestCountryPrice.countryCode);
      userPriceUSD = cheapestEntry.priceInUSD;
    }
  }

  // Calculate cheapest price in USD
  let cheapestPriceUSD: number;
  if (isUSD(cheapestCountryPrice.currency, cheapestCountryPrice.currencyName)) {
    cheapestPriceUSD = cheapestCountryPrice.price;
  } else {
    cheapestPriceUSD = convertToUSD(cheapestCountryPrice.price, cheapestCountryPrice.currency);
  }

  // Calculate savings
  const savingsAmount = userPriceUSD - cheapestPriceUSD;
  const savingsPercentage = Math.round((savingsAmount / userPriceUSD) * 100);

  // Build all prices array
  const allPrices: AllPriceEntry[] = deduplicatedPrices
    .map((p: IRegionalPrice) => {
      let priceInUSD: number;
      if (isUSD(p.currency, p.currencyName)) {
        priceInUSD = p.price;
      } else {
        priceInUSD = convertToUSD(p.price, p.currency);
      }
      
      return {
        price: p.price,
        currency: p.currency,
        symbol: p.currencySymbol || getCurrencySymbol(p.currency),
        country: p.country,
        countryCode: p.countryCode,
        flag: p.flag || getCountryFlag(p.countryCode),
        priceInUSD,
      };
    })
    .sort((a, b) => a.priceInUSD - b.priceInUSD);

  return {
    cheapest: {
      price: cheapestCountryPrice.price,
      currency: cheapestCountryPrice.currency,
      symbol: cheapestCountryPrice.currencySymbol || getCurrencySymbol(cheapestCountryPrice.currency),
      country: cheapestCountryPrice.country,
      countryCode: cheapestCountryPrice.countryCode,
      flag: cheapestCountryPrice.flag || getCountryFlag(cheapestCountryPrice.countryCode),
      priceInUSD: cheapestPriceUSD,
    },
    userCountry: {
      price: userPriceOriginal,
      currency: userCurrency,
      symbol: userSymbol,
      country: userCountryName,
      countryCode: userCountryCodeNormalized,
      flag: userFlag,
      priceInUSD: userPriceUSD,
    },
    savings: {
      amountUSD: savingsAmount,
      percentage: savingsPercentage,
      isPositive: savingsAmount > 0,
    },
    allPrices,
    isPercentageOnly: (service as any).percentageOnly === true,
    isAnnualOnly: (service as any).annualOnly === true,
    isHidden: (service as any).hide === true,
    serviceName: service.name,
    serviceSlug: service.slug,
    category: service.category,
  };
}

// ============================================================================
// Simple API
// ============================================================================

export interface SimplePriceInfo {
  cheapestPrice: number;
  cheapestCountry: string;
  userPrice: number;
  savingsPercentage: number;
  isCheaper: boolean;
}

export function getSimplePriceInfo(
  service: IService,
  userCountryCode: string,
  regionalPrices: IRegionalPrice[]
): SimplePriceInfo | null {
  const data = getPriceDisplayData(service, userCountryCode, regionalPrices);
  
  if (!data) return null;
  
  return {
    cheapestPrice: data.cheapest.priceInUSD,
    cheapestCountry: data.cheapest.country,
    userPrice: data.userCountry.priceInUSD,
    savingsPercentage: data.savings.percentage,
    isCheaper: data.savings.isPositive,
  };
}

// ============================================================================
// Formatters
// ============================================================================

export function formatPriceDisplay(data: PriceDisplayData): string {
  const { cheapest, savings } = data;
  
  if (savings.isPositive) {
    return `$${cheapest.priceInUSD.toFixed(2)} in ${cheapest.country} (-${savings.percentage}%)`;
  }
  
  return `$${cheapest.priceInUSD.toFixed(2)}`;
}

export function formatSavings(savings: { amountUSD: number; percentage: number; isPositive: boolean }): string {
  if (!savings.isPositive) return 'No savings available';
  
  return `Save $${savings.amountUSD.toFixed(2)} (${savings.percentage}%)`;
}
