# @leviackerman/shared

Shared utilities for just and just-admin projects.

## Installation

```bash
npm install @leviackerman/shared
```

## Usage

```typescript
import { getPriceDisplayData, convertCurrency, getCountryCode } from "@leviackerman/shared";
```

## What's Included

- **Currency**: 100+ currencies, conversions, symbols
- **Service Helpers**: Price extraction, plan filtering, deduplication
- **Service Price Display**: Unified price calculations (cheapest, savings, etc.)
- **Country Helpers**: Country code/currency lookup
- **Country Flags**: Flag emoji by country code

## Publishing

```bash
# 1. Update version in package.json
# 2. Build
npm run build

# 3. Publish to GitHub Packages
npm publish

# 4. In just and just-admin, update:
npm install @leviackerman/shared@latest
```

## Notes

- This is a **private package** - only accessible to leviackerman094340
- No database calls - pure utility functions only
- No API keys or secrets
