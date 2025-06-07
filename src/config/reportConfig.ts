/**
 * 🎯 DEAD SIMPLE REPORT SYSTEM
 * 
 * How it works:
 * 1. Add your report config here with the slug as the key
 * 2. GenericReport automatically extracts slug from URL
 * 3. Uses the slug to lookup config and render appropriate filters
 * 4. Backend receives the same slug to know which report to fetch
 * 
 * Example: URL `/sales` → looks up `sales` config → backend gets `sales` slug
 */

export interface ReportConfig {
  // Human readable name for display
  name: string;
  
  // Which filters to show (empty array = no filters)
  filters?: Array<'type' | 'scope' | 'fromDate' | 'toDate'>;
  
  // Options for each filter
  options?: {
    type?: string[];        // ['Day', 'Week', 'Month']
    scope?: string[];       // ['Retailer', 'Agent']
    withTime?: boolean;     // true = date pickers include time
    withAutoTime?: boolean; // true = auto-set to start/end of day
  };
}

// 🎯 SIMPLE: Just define what each report needs
export const REPORTS: Record<string, ReportConfig> = {
  // Financial reports with type/scope filters
  "sales": {
    name: "Sales Report", 
    filters: ['type', 'scope'],
    options: {
      type: ['Day', 'Week'],
      scope: ['Retailer'],
      withAutoTime: true
    }
  },
  
  "commissions": {
    name: "Commission Report",
    filters: ['type', 'scope'], 
    options: {
      type: ['Day', 'Week'],
      scope: ['Retailer'],
      withAutoTime: true
    }
  },
  
  "cashes": {
    name: "Cash Report",
    filters: ['type', 'scope'],
    options: {
      type: ['Day', 'Week'], 
      scope: ['Retailer'],
      withAutoTime: true
    }
  },
  
  // Date range reports
  "transaction-history": {
    name: "Transaction History",
    filters: ['fromDate', 'toDate'],
    options: {
      withTime: true
    }
  },
  
  // Simple reports with no filters
  "shifts": {
    name: "Shifts Report"
  },
  
  "current-jackpots": {
    name: "Current Jackpots"
  },
  
  "winning-numbers": {
    name: "Winning Numbers"
  },
  
  // 🚀 ADD YOUR REPORTS HERE - totally flexible!
  // "inventory": { name: "Inventory Report", filters: ['fromDate', 'toDate'] },
  // "custom-report": { name: "Custom Report", filters: ['type'], options: { type: ['A', 'B', 'C'] } },
  
  // 🔥 DEMO: Adding a new report is THIS simple!
  "inventory": { 
    name: "Inventory Report", 
    filters: ['fromDate', 'toDate'],
    options: { withTime: true }
  },

  // 📊 Financial Reports (Tab Layout Examples)
  "daily-sales-summary": {
    name: "Daily Sales Summary",
    filters: ['fromDate', 'toDate'],
    options: { withAutoTime: true }
  },

  "weekly-revenue-analysis": {
    name: "Weekly Revenue Analysis", 
    filters: ['type'],
    options: { type: ['Week', 'Month'] }
  },

  "monthly-profit-loss": {
    name: "Monthly P&L Statement",
    filters: ['fromDate', 'toDate'],
    options: { withTime: false }
  },

  "quarterly-financial-overview": {
    name: "Quarterly Financial Overview",
    filters: ['type'],
    options: { type: ['Q1', 'Q2', 'Q3', 'Q4'] }
  },

  // 📈 Analytics Dashboard (Tab Layout)
  "customer-analytics": {
    name: "Customer Analytics Dashboard",
    filters: ['fromDate', 'toDate', 'type'],
    options: { 
      type: ['Daily', 'Weekly', 'Monthly'],
      withTime: true 
    }
  },

  "product-performance": {
    name: "Product Performance Analysis",
    filters: ['type', 'scope'],
    options: {
      type: ['Category', 'Individual'],
      scope: ['All Products', 'Top 10', 'Bottom 10']
    }
  },

  "regional-comparison": {
    name: "Regional Comparison Report",
    filters: ['type'],
    options: { type: ['North', 'South', 'East', 'West', 'All Regions'] }
  },

  "trend-analysis": {
    name: "Trend Analysis Report",
    filters: ['fromDate', 'toDate', 'type'],
    options: {
      type: ['Sales Trends', 'Customer Trends', 'Product Trends'],
      withTime: false
    }
  },

  // 🐛 Debug Reports with Long Content
  "super-long-report": {
    name: "Super Long Debug Report",
    filters: [], // No filters for debugging
  },

  "image-heavy-report": {
    name: "Image Heavy Debug Report", 
    filters: [],
  },

  "mixed-content-report": {
    name: "Mixed Content Debug Report",
    filters: ['type'],
    options: { type: ['Text Heavy', 'Image Heavy', 'Balanced'] }
  },

  "minimal-content-report": {
    name: "Minimal Content Debug Report",
    filters: [],
  },
};

// Helper functions
export const getReportBySlug = (slug: string): ReportConfig | undefined => {
  return REPORTS[slug];
};

export const getReportSlugs = (): string[] => {
  return Object.keys(REPORTS);
};
