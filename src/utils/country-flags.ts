/**
 * Country Flags Utility
 * Single source of truth for flag emoji by country code
 */

const COUNTRY_FLAGS: Record<string, string> = {
  // Major countries
  US: "🇺🇸",
  GB: "🇬🇧",
  DE: "🇩🇪",
  FR: "🇫🇷",
  JP: "🇯🇵",
  CN: "🇨🇳",
  IN: "🇮🇳",
  BR: "🇧🇷",
  RU: "🇷🇺",
  
  // Americas
  CA: "🇨🇦",
  MX: "🇲🇽",
  AR: "🇦🇷",
  CL: "🇨🇱",
  CO: "🇨🇴",
  PE: "🇵🇪",
  VE: "🇻🇪",
  UY: "🇺🇾",
  PY: "🇵🇾",
  BO: "🇧🇴",
  EC: "🇪🇨",
  CR: "🇨🇷",
  PA: "🇵🇦",
  DO: "🇩🇴",
  PR: "🇵🇷",
  
  // Europe
  ES: "🇪🇸",
  IT: "🇮🇹",
  NL: "🇳🇱",
  BE: "🇧🇪",
  CH: "🇨🇭",
  AT: "🇦🇹",
  SE: "🇸🇪",
  NO: "🇳🇴",
  DK: "🇩🇰",
  FI: "🇫🇮",
  PL: "🇵🇱",
  CZ: "🇨🇿",
  HU: "🇭🇺",
  RO: "🇷🇴",
  GR: "🇬🇷",
  PT: "🇵🇹",
  IE: "🇮🇪",
  
  // Asia
  KR: "🇰🇷",
  TW: "🇹🇼",
  HK: "🇭🇰",
  SG: "🇸🇬",
  MY: "🇲🇾",
  TH: "🇹🇭",
  VN: "🇻🇳",
  ID: "🇮🇩",
  PH: "🇵🇭",
  PK: "🇵🇰",
  BD: "🇧🇩",
  LK: "🇱🇰",
  NP: "🇳🇵",
  IQ: "🇮🇶",
  SA: "🇸🇦",
  AE: "🇦🇪",
  IL: "🇮🇱",
  TR: "🇹🇷",
  IR: "🇮🇷",
  
  // Africa
  ZA: "🇿🇦",
  EG: "🇪🇬",
  NG: "🇳🇬",
  KE: "🇰🇪",
  MA: "🇲🇦",
  TN: "🇹🇳",
  
  // Oceania
  AU: "🇦🇺",
  NZ: "🇳🇿",
};

// Get flag emoji from country code
export function getCountryFlag(countryCode?: string): string {
  if (!countryCode) return "";
  
  const code = countryCode.toUpperCase();
  
  // Check if we have a custom flag
  if (COUNTRY_FLAGS[code]) {
    return COUNTRY_FLAGS[code];
  }
  
  // Convert country code to flag emoji using regional indicators
  if (code.length === 2) {
    try {
      const firstChar = code.charCodeAt(0) - 0x41 + 0x1F1E6;
      const secondChar = code.charCodeAt(1) - 0x41 + 0x1F1E6;
      return String.fromCodePoint(firstChar, secondChar);
    } catch {
      return "";
    }
  }
  
  return "";
}

// Get all flags as a record
export function getAllFlags(): Record<string, string> {
  return { ...COUNTRY_FLAGS };
}
