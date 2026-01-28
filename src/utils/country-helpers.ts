/**
 * Country Helpers Utility
 * Single source of truth for country-related helpers
 */

import countries from "i18n-iso-countries";
import countryToCurrency from "country-to-currency";
import currencySymbolMap from "currency-symbol-map";

// Register English locale
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

// ============================================================================
// Country Name Variations
// ============================================================================

const COUNTRY_NAME_VARIATIONS: Record<string, string> = {
  "USA": "United States",
  "US": "United States",
  "UK": "United Kingdom",
  "Korea": "South Korea",
  "UAE": "United Arab Emirates",
  "VG": "British Virgin Islands",
  "LA": "Laos",
  "FM": "Micronesia",
  "MD": "Moldova",
  "KN": "Saint Kitts and Nevis",
  "RU": "Russia",
  "TW": "Taiwan",
  "CZ": "Czech Republic",
  "VN": "Vietnam",
  "IR": "Iran",
  "SY": "Syria",
  "VE": "Venezuela",
  "BO": "Bolivia",
  "TZ": "Tanzania",
  "CG": "Congo",
};

// ============================================================================
// Main Functions
// ============================================================================

export function getCountryCode(country: string): string {
  if (!country) return "";
  
  const normalized = country.trim();
  
  // Check variations first
  if (COUNTRY_NAME_VARIATIONS[normalized]) {
    const standardName = COUNTRY_NAME_VARIATIONS[normalized];
    const code = countries.getAlpha2Code(standardName, "en");
    if (code) return code;
  }
  
  // Try direct lookup
  let code = countries.getAlpha2Code(normalized, "en");
  if (code) return code;
  
  // Try uppercase
  code = countries.getAlpha2Code(normalized.toUpperCase(), "en");
  if (code) return code;
  
  // If already a 2-letter code, validate it
  if (normalized.length === 2 && countries.getName(normalized.toUpperCase(), "en")) {
    return normalized.toUpperCase();
  }
  
  return "";
}

export function getCurrencyFromCountry(country: string): string {
  if (!country) return "USD";
  
  const normalized = country.trim();
  
  // If already a 2-letter code
  if (normalized.length === 2 && countries.getName(normalized.toUpperCase(), "en")) {
    const currency = (countryToCurrency as Record<string, string>)[normalized.toUpperCase()];
    return currency || "USD";
  }
  
  // Get country code first
  const countryCode = getCountryCode(normalized);
  if (countryCode) {
    const currency = (countryToCurrency as Record<string, string>)[countryCode.toUpperCase()];
    return currency || "USD";
  }
  
  return "USD";
}

export function getCurrencySymbol(currencyCode: string): string {
  if (!currencyCode) return "$";
  return currencySymbolMap(currencyCode.toUpperCase()) || "$";
}

export function getCountryName(code: string): string {
  if (!code) return "";
  return countries.getName(code.toUpperCase(), "en") || code;
}

export function isValidCountryCode(code: string): boolean {
  if (!code || code.length !== 2) return false;
  return !!countries.getName(code.toUpperCase(), "en");
}

export function getAllCountries(): Array<{ code: string; name: string }> {
  const countriesData = countries.getNames("en", { select: "official" });
  return Object.entries(countriesData).map(([code, name]) => ({
    code,
    name: name as string,
  }));
}

export function searchCountries(query: string): Array<{ code: string; name: string }> {
  if (!query || query.length < 2) return [];
  
  const normalizedQuery = query.toLowerCase();
  const allCountries = getAllCountries();
  
  return allCountries.filter(({ name, code }) => 
    name.toLowerCase().includes(normalizedQuery) ||
    code.toLowerCase().includes(normalizedQuery)
  );
}
