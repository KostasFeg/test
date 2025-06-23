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
  
  /**
   * Optional slug override for the backend / generator. If omitted the key of the
   *  reports object or the navigation slug will be used.
   */
  slug?: string;
  
  // Which filters to show (empty array = no filters)
  filters?: Array<'type' | 'scope' | 'fromDate' | 'toDate'>;
  
  /**
   * Legacy alias used by older JSON configs – kept for backward-compatibility.
   * Will be mapped to `filters` when loading.
   */
  required?: Array<'type' | 'scope' | 'fromDate' | 'toDate'>;
  
  // Options for each filter
  options?: {
    type?: string[];        // ['Day', 'Week', 'Month']
    scope?: string[];       // ['Retailer', 'Agent']
    withTime?: boolean;     // true = date pickers include time
    withAutoTime?: boolean; // true = auto-set to start/end of day
  };
}

// HARDCODED REPORTS REMOVED - NOW CONFIG-DRIVEN!
// All reports are now defined in config.json and loaded dynamically
// Use dynamicConfig.getReportConfig(slug) instead of getReportBySlug(slug)

/**
 * @deprecated Use dynamicConfig.getReportConfig(slug) instead
 * This function is kept for backward compatibility only
 */
export const getReportBySlug = (slug: string): ReportConfig | undefined => {
  console.warn('getReportBySlug is deprecated. Use dynamicConfig.getReportConfig(slug) instead.');
  
  // This function is deprecated - all reports are now config-driven
  // The actual functionality is now handled by the dynamic config service
  return undefined;
};
