/**
 * Highlight Countries
 * Countries that are highlighted in the services table
 */

export const highlightCountries = ["us", "ca", "gb", "au", "de", "th"] as const;

export type HighlightCountry = typeof highlightCountries[number];

export function isHighlightCountry(code: string): code is HighlightCountry {
  return highlightCountries.includes(code as HighlightCountry);
}
