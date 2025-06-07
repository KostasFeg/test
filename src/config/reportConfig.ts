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
};

// Helper functions
export const getReportBySlug = (slug: string): ReportConfig | undefined => {
  return REPORTS[slug];
};

export const getReportSlugs = (): string[] => {
  return Object.keys(REPORTS);
};
