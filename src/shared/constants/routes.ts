// Route path constants to avoid magic strings
export const ROUTES = {
  HOME: '/',
  MAINTENANCE_OPERATIONS: '/maintenance-operations',
  LOAD_FULL_PACK: '/maintenance-operations/load-full-pack',
  LOAD_COMBINED_PACK: '/maintenance-operations/load-combined-pack',
  UNLOAD_PACK: '/maintenance-operations/unload-pack',
  CLOSE_SHIFT: '/maintenance-operations/close-shift',
  IMPORTANT_TELEPHONE_NUMBERS: '/maintenance-operations/important-telephone-numbers',
  CLEAR_CUSTOMER_CREDITS: '/maintenance-operations/clear-customer-credits',
  PACK_OPERATIONS: '/maintenance-operations/pack-operations',
  
  FINANCIAL_REPORTS: '/financial-reports',
  PACK_SETTLEMENTS: '/financial-reports/pack-settlements',
  SCRATCH_CASHES: '/financial-reports/scratch-cashes',
  WEEKLY_STATEMENT: '/financial-reports/weekly-statement',
  
  LOTTERY_SALES_REPORTS: '/lottery-sales-reports',
  RETURN_TICKETS: '/lottery-sales-reports/return-tickets',
  ADJUSTMENTS: '/lottery-sales-reports/adjustments',
  FIELD_ORDER: '/lottery-sales-reports/field-order',
  RETAILER_ORDER: '/lottery-sales-reports/retailer-order',
  ORDER_PARAMETERS: '/lottery-sales-reports/order-parameters',
  LSR_ORDER: '/lottery-sales-reports/lsr-order',
  STOCK_RECOVERY: '/lottery-sales-reports/stock-recovery',
  ORDER_DETAIL: '/lottery-sales-reports/order-detail',
  
  DREAMTOUCH_OPERATIONS: '/dreamtouch-operations',
  CASH_RECONCILIATION_REPORT: '/dreamtouch-operations/cash-reconciliation-report',
  CASH_RECONCILIATION_REPORT_FINAL: '/dreamtouch-operations/cash-reconciliation-report-final',
  INVENTORY_REPORT: '/dreamtouch-operations/inventory-report',
  TRANSACTION_HISTORY_REPORT: '/dreamtouch-operations/transaction-history-report',
  SALES_REPORT: '/dreamtouch-operations/sales-report',
  BIN_OUT_OF_STOCK_REPORT: '/dreamtouch-operations/bin-out-of-stock-report',
  
  SYSTEM_REPORTS: '/system-reports',
  COMPONENT_VERSIONS: '/system-reports/component-versions',
  DEVICE_STATUS_REPORT: '/system-reports/device-status-report',
  CONFIGURATION: '/system-reports/configuration',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey]; 