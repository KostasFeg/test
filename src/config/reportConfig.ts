/**
 * 📊 REPORT CONFIGURATION
 * 
 * Define report configurations for the GenericReport component.
 * The GenericReport component automatically extracts the slug from the URL
 * and uses it to lookup the configuration and render appropriate filters.
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

export const REPORTS: Record<string, ReportConfig> = {
  // Financial reports
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
  
  
  // Additional reports
  "inventory": { 
    name: "Inventory Report", 
    filters: ['fromDate', 'toDate'],
    options: { withTime: true }
  },
};

// Helper function for components that need to lookup report config by slug
export const getReportBySlug = (slug: string): ReportConfig | undefined => {
  return REPORTS[slug];
};
