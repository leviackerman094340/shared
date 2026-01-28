/**
 * Shared Types for Pricing System
 * Pure TypeScript interfaces - no mongoose
 */

// ============================================================================
// Service Types
// ============================================================================

export interface IRegionalPrice {
  country: string;
  countryCode: string;
  currency: string;
  currencyName?: string;
  currencySymbol?: string;
  price: number;
  percentage?: number;
  pricingPageUrl?: string;
  flag?: string;
  dateUpdated?: Date;
  plan?: IPlan | IPlan[];
}

export interface IPlan {
  name: string;
  englishPlan?: string;
  isDefault: boolean;
  price: number;
  features?: string[];
  free?: boolean;
  specialPrice?: {
    price?: number;
    months?: number;
  };
}

export interface IBypassGuide {
  title: string;
  description: string;
  steps: string[];
  isPro: boolean;
}

export interface IVPNAvailability {
  vpnService: string;
  countryCode: string;
  status: "available" | "unavailable" | "testing";
  lastTested?: Date;
}

// IService without Document extension (pure interface)
export interface IService {
  _id?: any;
  name: string;
  slug: string;
  category: string;
  logo?: string;
  description: string;
  pricingPageUrl?: string;
  bypassGuides: IBypassGuide[];
  successRate: number;
  vpnAvailability?: IVPNAvailability[];
  hide?: boolean;
  annualOnly?: boolean;
  percentageOnly?: boolean;
  regionalPrices?: IRegionalPrice[];
  // Computed fields (maintained by just frontend)
  cheapestCountry?: string;
  cheapestPrice?: number;
  homeCountryPrice?: number;
  priceDelta?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// ============================================================================
// VPN Types
// ============================================================================

export interface IPromoOffer {
  percentage?: number;
  monthsFree?: number;
  plan?: string;
}

export interface IVPN {
  _id?: any;
  service: string;
  priceOneMonth: number;
  priceLongTerm: number;
  promoCode?: string;
  promoOffer?: IPromoOffer;
  logoUrl: string;
  affiliateUrl?: string;
  website: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// ============================================================================
// ServiceCountry Types
// ============================================================================

export interface IServiceCountry {
  _id?: any;
  serviceId: any;
  country: string;
  countryCode: string;
  currency: string;
  currencyName?: string;
  currencySymbol?: string;
  price?: number;
  percentage?: number;
  pricingPageUrl?: string;
  flag?: string;
  dateUpdated?: Date;
  plan?: IPlan | IPlan[];
  createdAt?: Date;
  updatedAt?: Date;
}

// ============================================================================
// Price Display Types
// ============================================================================

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
  
  allPrices: Array<{
    price: number;
    currency: string;
    symbol: string;
    country: string;
    countryCode: string;
    flag: string;
    priceInUSD: number;
  }>;
  
  isPercentageOnly: boolean;
  isAnnualOnly: boolean;
  isHidden: boolean;
  
  serviceName: string;
  serviceSlug: string;
  category: string;
}

export interface RegionalPriceDisplay {
  price: number;
  currency: string;
  symbol: string;
  country: string;
  countryCode: string;
  flag: string;
  priceConverted: {
    price: number;
    currency: string;
    symbol: string;
  };
}

export interface SimplePriceInfo {
  cheapestPrice: number;
  cheapestCountry: string;
  userPrice: number;
  savingsPercentage: number;
  isCheaper: boolean;
}

// ============================================================================
// Currency Types
// ============================================================================

export interface CurrencyRates {
  [currency: string]: number;
}

export interface CurrencySymbols {
  [currency: string]: string;
}

// ============================================================================
// Country Types
// ============================================================================

export interface CountryInfo {
  name: string;
  code: string;
  flag: string;
  currency: string;
  currencySymbol: string;
}
