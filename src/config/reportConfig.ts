export interface ReportOption {
  name: string;
  slug: string;
  required: string[];
  options?: {
    type?: string[];
    scope?: string[];
    offset?: string[];
    withTime?: boolean;
    withAutoTime?: boolean;
    [key: string]: any;
  };
  // Navigation metadata
  navigation: {
    label: string;
    category: string;
    order?: number;
  };
}

export interface ReportConfig {
  [key: string]: ReportOption;
}

// Single source of truth for all reports
export const REPORTS: ReportConfig = {
  'sales-report': {
    name: 'financial_sales_report',
    slug: 'sales',
    required: ["type", "scope"],
    options: {
      'type': ['Day', 'Week'],
      'scope': ['Retailer'],
      'withTime': false,
      'withAutoTime': true
    },
    navigation: {
      label: 'Sales Report',
      category: 'financial'
    }
  },
  'commission-report': {
    name: 'financial_commissions_report',
    slug: 'commissions',
    required: ["type", "scope"],
    options: {
      'type': ['Day', 'Week'],
      'scope': ['Retailer'],
      'withTime': false,
      'withAutoTime': true
    },
    navigation: {
      label: 'Commission Report',
      category: 'financial'
    }
  },
  'cash-report': {
    name: 'cash_reconciliation_report',
    slug: 'cashes',
    required: ["type", "scope"],
    options: {
      'type': ['Day', 'Week'],
      'scope': ['Retailer'],
      'withTime': false,
      'withAutoTime': true
    },
    navigation: {
      label: 'Cash Report',
      category: 'financial'
    }
  },
  'transaction-history-report': {
    name: 'transaction_history_report',
    slug: 'transaction-history',
    required: ["fromDate", "toDate"],
    options: {
      'withTime': true,
      'withAutoTime': false
    },
    navigation: {
      label: 'Transaction History',
      category: 'operational'
    }
  },
  'financial-adjustment-report': {
    name: 'financial_adjustment_report',
    slug: 'financial-adjustments',
    required: ["type", "scope"],
    options: {
      'type': ['Day', 'Week'],
      'scope': ['Retailer'],
      'withTime': false,
      'withAutoTime': true
    },
    navigation: {
      label: 'Financial Adjustments',
      category: 'financial'
    }
  },
  'summary-report': {
    name: 'summary_report',
    slug: 'sales-summary',
    required: ["type", "scope"],
    options: {
      'type': ['Day', 'Week'],
      'scope': ['Retailer'],
      'withTime': false,
      'withAutoTime': true
    },
    navigation: {
      label: 'Sales Summary',
      category: 'financial'
    }
  },
  'shifts-report': {
    name: 'shifts_report',
    slug: 'shifts',
    required: [],
    options: {},
    navigation: {
      label: 'Shifts Report',
      category: 'operational'
    }
  },
  'current-jackpots-report': {
    name: 'current_jackpots_report',
    slug: 'games/current-jackpots',
    required: [],
    options: {},
    navigation: {
      label: 'Current Jackpots',
      category: 'games'
    }
  },
  'winning-numbers-report': {
    name: 'winning_numbers_report',
    slug: 'games/winning-numbers',
    required: [],
    options: {},
    navigation: {
      label: 'Winning Numbers',
      category: 'games'
    }
  }
};

// Category configuration
export const REPORT_CATEGORIES = {
  financial: {
    label: 'Financial Reports',
    order: 1
  },
  operational: {
    label: 'Operational Reports', 
    order: 2
  },
  games: {
    label: 'Game Reports',
    order: 3
  }
};

// Helper functions for working with report configuration
export const getReportBySlug = (slug: string): ReportOption | undefined => {
  return Object.values(REPORTS).find(report => report.slug === slug);
};

export const getReportByKey = (key: string): ReportOption | undefined => {
  return REPORTS[key];
};

export const getReportTitle = (reportKey: string): string => {
  const report = REPORTS[reportKey];
  if (!report) return 'Unknown Report';
  
  // Convert snake_case to Title Case
  return report.name
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
};

export const getReportActionType = (slug: string): 'buttons' | 'dateRange' => {
  // Reports with date range requirements use date pickers
  const report = getReportBySlug(slug);
  if (!report) return 'buttons';
  
  const hasDateRange = report.required.includes('fromDate') && report.required.includes('toDate');
  return hasDateRange ? 'dateRange' : 'buttons';
};

// Generate navigation items from report configuration
export const generateReportNavigation = () => {
  const categorizedReports: { [key: string]: ReportOption[] } = {};
  
  // Group reports by category
  Object.entries(REPORTS).forEach(([key, report]) => {
    const category = report.navigation.category;
    if (!categorizedReports[category]) {
      categorizedReports[category] = [];
    }
    categorizedReports[category].push({ ...report, key } as ReportOption & { key: string });
  });
  
  // Convert to navigation structure
  return Object.entries(categorizedReports)
    .map(([categoryKey, reports]) => ({
      slug: `${categoryKey}-reports`,
      label: REPORT_CATEGORIES[categoryKey as keyof typeof REPORT_CATEGORIES]?.label || categoryKey,
      order: REPORT_CATEGORIES[categoryKey as keyof typeof REPORT_CATEGORIES]?.order || 999,
      reports: reports.sort((a, b) => (a.navigation.order || 999) - (b.navigation.order || 999))
    }))
    .sort((a, b) => a.order - b.order);
};

// Define which reports are available for different user levels
export const AVAILABLE_REPORTS_BY_LEVEL = {
  ADMINISTRATOR: Object.keys(REPORTS),
  AGENT_MANAGER: [
    'sales-report',
    'commission-report', 
    'cash-report',
    'transaction-history-report',
    'summary-report'
  ],
  AGENT_CLERK: [
    'sales-report',
    'cash-report',
    'transaction-history-report'
  ]
}; 