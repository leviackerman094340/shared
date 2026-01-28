/**
 * Service Helpers - Pure Utility Functions
 * 
 * Pure functions only - no database calls, no mongoose
 * For database operations, use just/lib/utils/service-helpers.ts
 */

import { IRegionalPrice, IPlan } from "../types";

// ============================================================================
// Type Definitions
// ============================================================================

export interface ServiceCountryDocument {
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
  plan?: any;
  createdAt: Date;
}

// ============================================================================
// Type Guards & Helpers
// ============================================================================

export function isPlan(obj: any): obj is IPlan {
  return obj && typeof obj === 'object' && 'name' in obj && 'price' in obj;
}

export function isPlanArray(obj: any): obj is IPlan[] {
  return Array.isArray(obj) && obj.length > 0 && isPlan(obj[0]);
}

// ============================================================================
// Plan Filtering
// ============================================================================

export function shouldExcludePlan(plan: any): boolean {
  if (!plan || typeof plan !== 'object') return false;
  
  const name = plan?.name || plan?.englishPlan || '';
  const price = plan?.price;
  
  return (name && name.toLowerCase() === 'free') || price === 0;
}

export function filterPlanFromData(data: any): any {
  if (data.price === 0) {
    const { plan, ...rest } = data;
    return rest;
  }
  
  if (!data.plan) {
    return data;
  }
  
  if (Array.isArray(data.plan)) {
    const filteredPlans = data.plan.filter((p: any) => !shouldExcludePlan(p));
    
    if (filteredPlans.length === 0) {
      const { plan, ...rest } = data;
      return rest;
    }
    
    return { ...data, plan: filteredPlans };
  }
  
  if (shouldExcludePlan(data.plan)) {
    const { plan, ...rest } = data;
    return rest;
  }
  
  return data;
}

// ============================================================================
// Price Extraction
// ============================================================================

export function extractPriceFromData(data: any): number | undefined {
  if (data.price !== undefined && data.price !== null) {
    return data.price;
  }

  if (data.plan) {
    if (Array.isArray(data.plan)) {
      const defaultPlan = data.plan.find((p: any) => p.isDefault === true);
      if (defaultPlan && defaultPlan.price !== undefined) {
        return defaultPlan.price;
      }
      
      const plansWithPrice = data.plan.filter((p: any) => p.price !== undefined);
      if (plansWithPrice.length > 0) {
        return plansWithPrice.reduce((highest: any, current: any) => 
          current.price > highest.price ? current : highest
        ).price;
      }
    } else if (typeof data.plan === 'object' && data.plan.price !== undefined) {
      return data.plan.price;
    }
  }

  return undefined;
}

// ============================================================================
// Country Code Normalization
// ============================================================================

export function normalizeCountryCode(code: string | undefined): string {
  if (!code) return '';
  const normalized = code.toLowerCase();
  return normalized.includes('-') ? normalized.split('-')[0] : normalized;
}

// ============================================================================
// Data Conversion
// ============================================================================

export function convertToRegionalPrice(data: any): IRegionalPrice {
  const filtered = filterPlanFromData(data);
  
  return {
    country: filtered.country,
    countryCode: filtered.countryCode,
    currency: filtered.currency,
    price: extractPriceFromData(filtered) ?? filtered.price,
    percentage: filtered.percentage,
    currencyName: filtered.currencyName,
    currencySymbol: filtered.currencySymbol,
    pricingPageUrl: filtered.pricingPageUrl,
    flag: filtered.flag,
    dateUpdated: filtered.dateUpdated,
    plan: filtered.plan,
  };
}

// ============================================================================
// Deduplication
// ============================================================================

export function deduplicateRegionalPrices(prices: IRegionalPrice[]): IRegionalPrice[] {
  const uniquePrices = new Map<string, IRegionalPrice>();
  
  for (const price of prices) {
    const key = normalizeCountryCode(price.countryCode);
    if (key) {
      uniquePrices.set(key, price);
    }
  }
  
  return Array.from(uniquePrices.values());
}

// ============================================================================
// Fallback Functions
// ============================================================================

export function extractFromOldRegionalPrices(data: any): IRegionalPrice[] {
  if (!data || !data.regionalPrices || !Array.isArray(data.regionalPrices)) {
    return [];
  }
  
  return data.regionalPrices;
}

// ============================================================================
// Aliases for backward compatibility
// ============================================================================

export const serviceCountryToRegionalPrice = convertToRegionalPrice;
