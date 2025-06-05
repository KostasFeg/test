# Modern Reports System

This document explains how to use and configure the modern reports system that replaces the old GenericReport component.

## Overview

The new reports system provides:

- ✅ **ZERO DUPLICATION** - Single source of truth configuration
- ✅ **DEAD SIMPLE SETUP** - Add report in one file, navigation auto-generates
- ✅ Modern React hooks-based architecture (no class components)
- ✅ TypeScript support with proper type safety
- ✅ Modern DatePicker component (replaces react-datepicker)
- ✅ Integration with ImageScroller for report display
- ✅ Mock service for development/testing
- ✅ Cross-project compatibility through configuration

## Super Simple Setup

### Step 1: Add Report to Configuration (ONLY FILE YOU NEED TO EDIT!)

```typescript
// In reportConfig.ts - This is the ONLY place you define reports
export const REPORTS: ReportConfig = {
  "my-new-report": {
    name: "my_custom_report",
    slug: "api/my-report",
    required: ["type", "fromDate", "toDate"],
    options: {
      type: ["Daily", "Weekly"],
      withTime: true,
    },
    navigation: {
      label: "My New Report",
      category: "financial", // Will auto-group with other financial reports
    },
  },
};
```

### Step 2: That's it! 🎉

The navigation system automatically:

- ✅ Creates the navigation menu item
- ✅ Groups it with other reports in the same category
- ✅ Sets up routing and lazy loading
- ✅ Provides mock data (or you can add custom mock data)

## Architecture

### Core Components

1. **UniversalReportsPage** (`src/pages/UniversalReportsPage.tsx`)

   - Single component that handles ALL reports
   - Auto-detects which report to show from the URL
   - No need to create multiple report components

2. **reportConfig.ts** (`src/config/reportConfig.ts`)

   - **SINGLE SOURCE OF TRUTH** for all reports
   - Contains navigation metadata, API configuration, and UI options
   - Auto-generates navigation structure

3. **reportNavigation.tsx** (`src/utils/reportNavigation.tsx`)

   - Auto-generates navigation items from report config
   - Eliminates manual navigation setup

4. **Mock Service** (`src/services/mockReportService.ts`)
   - Automatically provides generic mock data
   - Easy to extend with custom mock data

## Adding New Categories

```typescript
// In reportConfig.ts
export const REPORT_CATEGORIES = {
  financial: { label: "Financial Reports", order: 1 },
  operational: { label: "Operational Reports", order: 2 },
  games: { label: "Game Reports", order: 3 },
  // Add your new category
  custom: { label: "Custom Reports", order: 4 },
};
```

## Report Configuration Options

| Field                 | Type     | Description                      | Example                     |
| --------------------- | -------- | -------------------------------- | --------------------------- |
| `name`                | string   | Internal name for i18n/display   | `'my_custom_report'`        |
| `slug`                | string   | API endpoint or identifier       | `'api/my-report'`           |
| `required`            | string[] | Required parameters              | `["type", "fromDate"]`      |
| `options`             | object   | Available values for parameters  | `{ type: ['Day', 'Week'] }` |
| `navigation.label`    | string   | Display name in navigation       | `'My Report'`               |
| `navigation.category` | string   | Which category to group under    | `'financial'`               |
| `navigation.order`    | number?  | Order within category (optional) | `1`                         |

## Cross-Project Usage

### Step 1: Create Project-Specific Configuration

```typescript
// myproject-reports.config.ts
import { ReportConfig } from "./reportConfig";

export const MY_PROJECT_REPORTS: ReportConfig = {
  "project-specific-report": {
    name: "project_specific_report",
    slug: "myproject/specific-report",
    required: ["customParam"],
    options: {
      customParam: ["Option1", "Option2"],
    },
    navigation: {
      label: "Project Specific Report",
      category: "custom",
    },
  },
};
```

### Step 2: Import in Navigation

```typescript
// In navigation.config.tsx
import { createReportNavigationWithOptions } from "../../utils/reportNavigation";

export const navConfig: NavNode[] = [
  // ... other nav items
  ...createReportNavigationWithOptions({
    icon: <MyIcon />,
    categoryPrefix: "my-project", // Optional: prefix category slugs
  }),
];
```

### That's All! No More Manual Setup Required!

## Before vs After Comparison

### BEFORE (Complex, Lots of Duplication):

```typescript
// ❌ Had to edit reportConfig.ts
// ❌ Had to edit navigation.config.tsx
// ❌ Had to create helper functions
// ❌ Had to manually map each report
// ❌ Had to pass props to each component
// ❌ Easy to make mistakes

// In reportConfig.ts
export const REPORTS = { 'my-report': { ... } };

// In navigation.config.tsx (DUPLICATION!)
const createReportElement = (reportSlug: string) => () => { ... };
{
  slug: "my-report",
  label: "My Report", // DUPLICATE!
  element: createReportElement("my-report-slug")
}
```

### AFTER (Simple, Zero Duplication):

```typescript
// ✅ Edit ONLY reportConfig.ts
// ✅ Navigation auto-generates
// ✅ No helper functions needed
// ✅ No manual mapping
// ✅ No prop passing
// ✅ Impossible to make mistakes

// ONLY THIS FILE:
export const REPORTS = {
  "my-report": {
    // ... config
    navigation: {
      label: "My Report",
      category: "financial",
    },
  },
};
// DONE! Navigation auto-creates itself!
```

## Current Working Reports

The system auto-generates these navigation items from `reportConfig.ts`:

**Financial Reports:**

- Sales Report (`/financial-reports/sales`)
- Commission Report (`/financial-reports/commissions`)
- Cash Report (`/financial-reports/cashes`)
- Financial Adjustments (`/financial-reports/financial-adjustments`)
- Sales Summary (`/financial-reports/sales-summary`)

**Operational Reports:**

- Transaction History (`/operational-reports/transaction-history`)
- Shifts Report (`/operational-reports/shifts`)

**Game Reports:**

- Current Jackpots (`/games-reports/games/current-jackpots`)
- Winning Numbers (`/games-reports/games/winning-numbers`)

## Migration from Old System

1. **Replace all GenericReport usage**: Just import the new system
2. **Delete manual navigation setup**: Use auto-generated navigation
3. **Consolidate report definitions**: Move everything to `reportConfig.ts`
4. **Remove helper functions**: Not needed anymore
5. **Test**: Everything should work automatically

## Development Tips

1. **Adding Reports**: Edit ONLY `reportConfig.ts`
2. **Custom Mock Data**: Add to `mockReportService.ts` (optional)
3. **New Categories**: Add to `REPORT_CATEGORIES`
4. **Custom Styling**: Modify `ReportsPage.scss`
5. **Debug**: Check browser console for slug detection

The system is now **dead simple** - edit one file and everything else happens automatically! 🚀
