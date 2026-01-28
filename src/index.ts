/**
 * @leviackerman/shared
 * 
 * Shared utilities for just and just-admin projects
 * 
 * Pure functions only - no database calls, no API keys
 */

// Re-export types
export type {
  IRegionalPrice,
  IPlan,
  IBypassGuide,
  IVPNAvailability,
  IService,
  IVPN,
  IServiceCountry,
  PriceDisplayData,
  RegionalPriceDisplay,
  SimplePriceInfo,
  CurrencyRates,
  CurrencySymbols,
  CountryInfo,
} from "./types";

// Currency
export * from "./utils/currency";

// Service Helpers (pure functions only)
export * from "./utils/service-helpers";

// Service Price Display
export * from "./utils/service-price-display";

// Country Helpers
export {
  getCountryCode,
  getCurrencyFromCountry,
  getCurrencySymbol,
  getCountryName,
  isValidCountryCode,
  getAllCountries,
  searchCountries,
} from "./utils/country-helpers";

// Country Flags
export {
  getCountryFlag,
  getAllFlags,
} from "./utils/country-flags";
