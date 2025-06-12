# 📊 Custom Reports Configuration Guide

## 🎯 Overview - SUPER EASY Reports!

You were **absolutely right** - this was a major oversight! We now have **ultra-simple** custom reports configuration via `config.json`. No more editing multiple files or complex setup!

## ✨ What's New

✅ **Add reports via `config.json`** - Just define them and they work  
✅ **Auto-integrates with navigation** - Reports show up in your custom navigation  
✅ **Full filter support** - Date ranges, dropdowns, time settings  
✅ **Zero code changes** - Pure configuration approach  
✅ **Merge with existing reports** - Adds to built-in reports, doesn't replace

---

## 🚀 Quick Start (2 Steps)

### Step 1: Define Your Reports

Add a `reports` section to your `config.json`:

```json
{
  "name": "My Custom Config",
  "config": {
    "reports": {
      "my-sales-report": {
        "name": "Custom Sales Report",
        "filters": ["type", "fromDate", "toDate"],
        "options": {
          "type": ["Daily", "Weekly", "Monthly"],
          "withTime": true
        }
      }
    }
  }
}
```

### Step 2: Add to Navigation

Include the reports in your navigation:

```json
{
  "navigation": [
    {
      "slug": "my-reports",
      "label": "📊 My Reports",
      "display": "buttons",
      "children": [
        {
          "slug": "my-sales-report",
          "label": "Custom Sales Report"
        }
      ]
    }
  ]
}
```

**That's it!** Your custom reports are now fully functional! 🎉

---

## 📋 Complete Configuration Reference

### Report Configuration Schema

```typescript
{
  "reports": {
    "[slug]": {
      "name": string,              // Display name
      "filters"?: string[],        // Available filters
      "options"?: {
        "type"?: string[],         // Dropdown options
        "scope"?: string[],        // Scope options
        "withTime"?: boolean,      // Include time in date pickers
        "withAutoTime"?: boolean   // Auto-set start/end of day
      }
    }
  }
}
```

### Available Filters

| Filter     | Description          | Example Options                   |
| ---------- | -------------------- | --------------------------------- |
| `type`     | Report type/category | `["Daily", "Weekly", "Monthly"]`  |
| `scope`    | Data scope           | `["Store", "Region", "National"]` |
| `fromDate` | Start date picker    | Auto-generated                    |
| `toDate`   | End date picker      | Auto-generated                    |

### Filter Options

| Option         | Type       | Description                      | Example                   |
| -------------- | ---------- | -------------------------------- | ------------------------- |
| `type`         | `string[]` | Dropdown values for type filter  | `["Summary", "Detailed"]` |
| `scope`        | `string[]` | Dropdown values for scope filter | `["All", "VIP", "New"]`   |
| `withTime`     | `boolean`  | Include time selection           | `true`                    |
| `withAutoTime` | `boolean`  | Auto-set to start/end of day     | `true`                    |

---

## 💼 Real-World Examples

### 🏪 Retail Store Reports

```json
{
  "reports": {
    "daily-sales": {
      "name": "Daily Sales Summary",
      "filters": ["type", "fromDate", "toDate"],
      "options": {
        "type": ["Summary", "Detailed", "By Department"],
        "withTime": false,
        "withAutoTime": true
      }
    },
    "inventory-alerts": {
      "name": "Inventory Alerts",
      "filters": ["type"],
      "options": {
        "type": ["Low Stock", "Out of Stock", "Overstock"]
      }
    }
  }
}
```

### 🏭 Manufacturing Reports

```json
{
  "reports": {
    "production-summary": {
      "name": "Production Summary",
      "filters": ["scope", "fromDate", "toDate"],
      "options": {
        "scope": ["All Lines", "Line A", "Line B", "Line C"],
        "withTime": true
      }
    },
    "quality-metrics": {
      "name": "Quality Control Metrics",
      "filters": ["type", "scope"],
      "options": {
        "type": ["Pass Rate", "Defect Analysis", "Reject Summary"],
        "scope": ["All Products", "Product A", "Product B"]
      }
    }
  }
}
```

### 🏥 Healthcare Reports

```json
{
  "reports": {
    "patient-census": {
      "name": "Patient Census Report",
      "filters": ["scope", "fromDate", "toDate"],
      "options": {
        "scope": ["All Departments", "Emergency", "ICU", "General"],
        "withTime": false,
        "withAutoTime": true
      }
    },
    "staff-scheduling": {
      "name": "Staff Scheduling Report",
      "filters": ["type", "fromDate", "toDate"],
      "options": {
        "type": ["Current Week", "Next Week", "Monthly Overview"],
        "withTime": true
      }
    }
  }
}
```

---

## 🛠 Advanced Features

### Merging with Built-in Reports

Your custom reports **merge** with existing reports, so you get:

- ✅ All built-in reports (sales, commissions, etc.)
- ✅ Your custom reports
- ✅ Full compatibility

### Auto-Generation Utilities

For developers, we provide helper functions:

```typescript
import {
  generateReportsNavigation,
  createReportsNavigationSection,
} from "../shared/config/config.builder";

// Auto-generate navigation items from reports
const reportItems = generateReportsNavigation(customReports);

// Create complete section
const reportsSection = createReportsNavigationSection(customReports, {
  sectionLabel: "📊 Custom Reports",
  display: "buttons",
  columns: 2,
});
```

### Mock Data Integration

All custom reports automatically get:

- ✅ Mock data for development
- ✅ Proper filters and date handling
- ✅ Professional report layout
- ✅ Print functionality

---

## 🎯 Best Practices

### 1. **Descriptive Names**

```json
// ✅ Good
"monthly-sales-summary": {
  "name": "Monthly Sales Summary Report"
}

// ❌ Avoid
"report1": {
  "name": "Report"
}
```

### 2. **Logical Filter Combinations**

```json
// ✅ Good - logical for date-range reports
"filters": ["fromDate", "toDate", "scope"]

// ❌ Avoid - too many filters make UI cluttered
"filters": ["type", "scope", "fromDate", "toDate", "category", "status"]
```

### 3. **Reasonable Options**

```json
// ✅ Good - clear, concise options
"type": ["Daily", "Weekly", "Monthly"]

// ❌ Avoid - too many options overwhelm users
"type": ["Hourly", "Daily", "Weekly", "Bi-weekly", "Monthly", "Quarterly", "Yearly"]
```

### 4. **Navigation Organization**

```json
// ✅ Good - group related reports
{
  "slug": "financial-reports",
  "label": "💰 Financial Reports",
  "children": [
    { "slug": "sales-summary", "label": "Sales Summary" },
    { "slug": "profit-loss", "label": "P&L Statement" }
  ]
}
```

---

## 🔧 Troubleshooting

### Reports Not Showing

1. ✅ Check `reports` section is in `config.json`
2. ✅ Verify navigation includes the report slugs
3. ✅ Ensure config is loading (check browser console)
4. ✅ Use "Clear Active Config" if cached

### Filters Not Working

1. ✅ Verify filter names are correct: `type`, `scope`, `fromDate`, `toDate`
2. ✅ Check `options` array has valid values
3. ✅ Ensure filters array matches available options

### Date Filters Issues

- Use `withTime: false` for day-only selection
- Use `withAutoTime: true` for automatic start/end of day
- Use `withTime: true` for precise timestamp selection

---

## 🎊 Complete Working Example

See `active-config/reports-example.json` for a full working configuration with multiple report types, custom navigation, and various filter combinations.

This example shows:

- ✅ 7 different custom reports
- ✅ Multiple navigation styles (buttons + tabs)
- ✅ Various filter combinations
- ✅ Professional styling and organization

---

## 🏆 Summary

**Before**: Had to edit multiple files, complex setup, easy to make mistakes  
**After**: Add reports in `config.json` - **dead simple!**

This fixes the oversight completely and makes custom reports as easy as editing a JSON file! 🚀
