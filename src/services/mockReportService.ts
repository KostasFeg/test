/**
 * Enhanced Mock Report Service
 * 
 * Features:
 * - Configurable mock data based on report slugs
 * - Proper fetch simulation with delays and status codes
 * - Support for different content types (HTML, Image, PDF, etc.)
 * - Dynamic report generation based on parameters
 * - Error simulation for testing
 */

export interface ReportParams {
  slug: string;
  type?: string;
  scope?: string;
  offset?: string | number;
  fromDate?: number;
  toDate?: number;
  withTime?: boolean;
  withAutoTime?: boolean;
  [key: string]: any; // Allow additional parameters
}

export interface MockFetchOptions {
  delay?: number;
  status?: number;
  errorRate?: number; // 0-1, probability of random errors
}

export interface ReportResponse {
  content: string;
  contentType: 'html' | 'image' | 'pdf' | 'json';
  metadata?: {
    generatedAt: string;
    parameters: ReportParams;
    reportTitle?: string;
  };
}

// Enhanced mock fetch function as requested
export const mockFetch = (mockData: any, { delay = 400, status = 200 }: MockFetchOptions = {}) => {
  return async (): Promise<Response> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const isError = status < 200 || status >= 300;
        
        if (isError) {
          reject(new Error(`Mock fetch error: ${status}`));
          return;
        }

        resolve({
          ok: status >= 200 && status < 300,
          status,
          json: async () => mockData,
          text: async () => typeof mockData === 'string' ? mockData : JSON.stringify(mockData),
          headers: new Headers({
            'Content-Type': typeof mockData === 'string' ? 'text/html' : 'application/json'
          })
        } as Response);
      }, delay);
    });
  };
};

// Mock report configurations with different filters
const MOCK_REPORT_CONFIGS: Record<string, {
  filters: string[];
  contentType: 'html' | 'image' | 'pdf' | 'json';
  generator: (params: ReportParams) => string;
}> = {
  'sales': {
    filters: ['type', 'fromDate', 'toDate', 'scope'],
    contentType: 'html',
    generator: (params) => generateSalesReport(params)
  },
  'commissions': {
    filters: ['type', 'scope', 'fromDate'],
    contentType: 'html',
    generator: (params) => generateCommissionsReport(params)
  },
  'cashes': {
    filters: ['type', 'scope'],
    contentType: 'html',
    generator: (params) => generateCashReport(params)
  },
  'transaction-history': {
    filters: ['fromDate', 'toDate', 'type'],
    contentType: 'html',
    generator: (params) => generateTransactionHistoryReport(params)
  },
  'financial-adjustments': {
    filters: ['type', 'scope', 'fromDate'],
    contentType: 'html',
    generator: (params) => generateAdjustmentsReport(params)
  },
  'sales-summary': {
    filters: ['type', 'scope'],
    contentType: 'html',
    generator: (params) => generateSummaryReport(params)
  },
  'shifts': {
    filters: ['fromDate', 'toDate'],
    contentType: 'html',
    generator: (params) => generateShiftsReport(params)
  },
  'games/current-jackpots': {
    filters: [],
    contentType: 'html',
    generator: (params) => generateJackpotsReport(params)
  },
  'games/winning-numbers': {
    filters: ['fromDate'],
    contentType: 'html',
    generator: (params) => generateWinningNumbersReport(params)
  },

  // 📊 Financial Reports (Tab Layout Examples)
  'daily-sales-summary': {
    filters: ['fromDate', 'toDate'],
    contentType: 'html',
    generator: (params) => generateDailySalesSummary(params)
  },
  'weekly-revenue-analysis': {
    filters: ['type'],
    contentType: 'html',
    generator: (params) => generateWeeklyRevenueAnalysis(params)
  },
  'monthly-profit-loss': {
    filters: ['fromDate', 'toDate'],
    contentType: 'html',
    generator: (params) => generateMonthlyProfitLoss(params)
  },
  'quarterly-financial-overview': {
    filters: ['type'],
    contentType: 'html',
    generator: (params) => generateQuarterlyOverview(params)
  },

  // 📈 Analytics Dashboard (Tab Layout)
  'customer-analytics': {
    filters: ['fromDate', 'toDate', 'type'],
    contentType: 'html',
    generator: (params) => generateCustomerAnalytics(params)
  },
  'product-performance': {
    filters: ['type', 'scope'],
    contentType: 'html',
    generator: (params) => generateProductPerformance(params)
  },
  'regional-comparison': {
    filters: ['type'],
    contentType: 'html',
    generator: (params) => generateRegionalComparison(params)
  },
  'trend-analysis': {
    filters: ['fromDate', 'toDate', 'type'],
    contentType: 'html',
    generator: (params) => generateTrendAnalysis(params)
  },

  // 🐛 Debug Reports with Long Content
  'super-long-report': {
    filters: [],
    contentType: 'html',
    generator: (params) => generateSuperLongReport(params)
  },
  'image-heavy-report': {
    filters: [],
    contentType: 'html',
    generator: (params) => generateImageHeavyReport(params)
  },
  'mixed-content-report': {
    filters: ['type'],
    contentType: 'html',
    generator: (params) => generateMixedContentReport(params)
  },
  'minimal-content-report': {
    filters: [],
    contentType: 'html',
    generator: (params) => generateMinimalContentReport(params)
  },
  // Aliases without the "games/" prefix so navigation slugs match the mock service
  'current-jackpots': {
    filters: [],
    contentType: 'html',
    generator: (params) => generateJackpotsReport(params)
  },
  'winning-numbers': {
    filters: ['fromDate'],
    contentType: 'html',
    generator: (params) => generateWinningNumbersReport(params)
  }
};

// Dynamic report generators
function generateSalesReport(params: ReportParams): string {
  const date = new Date(params.fromDate ? params.fromDate * 1000 : Date.now());
  const reportType = params.type || 'Day';
  
  return `
    <div style="font-family: Arial, sans-serif; padding: 15px; background: white; color: black; max-width: 100%; box-sizing: border-box;">
      <h2 style="color: #333; border-bottom: 2px solid #4a90e2; padding-bottom: 8px; margin: 0 0 15px 0; font-size: 18px;">
        ${reportType}ly Sales Report - ${date.toDateString()}
      </h2>
      
      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 14px; margin: 10px 0; color: #555;">Sales Summary</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Game Type</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Sales</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Wins</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Net</th>
          </tr>
          ${generateRandomSalesData(reportType).map(item => `
            <tr>
              <td style="border: 1px solid #dee2e6; padding: 8px;">${item.game}</td>
              <td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$${item.sales}</td>
              <td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$${item.wins}</td>
              <td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$${item.net}</td>
          </tr>
          `).join('')}
        </table>
      </div>

      <div style="margin-bottom: 15px; background: #e3f2fd; padding: 10px; border: 1px solid #90caf9; border-radius: 4px;">
        <h4 style="margin: 0 0 8px 0; font-size: 13px; color: #1565c0;">📊 Report Parameters</h4>
        <p style="margin: 0; font-size: 12px; color: #1565c0;">
          Type: ${params.type || 'Not specified'} | 
          Scope: ${params.scope || 'Default'} | 
          Date Range: ${formatDateRange(params)}
        </p>
      </div>

      <p style="margin: 15px 0 0 0; font-size: 11px; color: #666; text-align: center;">
        Report generated: ${new Date().toLocaleString()} | Report ID: SAL-${Math.random().toString(36).substr(2, 6).toUpperCase()}
      </p>
    </div>
  `;
}

function generateCommissionsReport(params: ReportParams): string {
  const date = new Date(params.fromDate ? params.fromDate * 1000 : Date.now());
  const reportType = params.type || 'Day';
  
  return `
    <div style="font-family: Arial, sans-serif; padding: 15px; background: white; color: black; max-width: 100%; box-sizing: border-box;">
      <h2 style="color: #333; border-bottom: 2px solid #28a745; padding-bottom: 8px; margin: 0 0 15px 0; font-size: 18px;">
        ${reportType}ly Commission Report - ${date.toDateString()}
      </h2>
      
      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 14px; margin: 10px 0; color: #555;">Commission Summary</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Commission Type</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Sales Volume</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Rate</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Commission</th>
          </tr>
          ${generateRandomCommissionData(reportType).map(item => `
            <tr>
              <td style="border: 1px solid #dee2e6; padding: 8px;">${item.type}</td>
              <td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$${item.volume}</td>
              <td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">${item.rate}%</td>
              <td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$${item.commission}</td>
          </tr>
          `).join('')}
        </table>
      </div>

      <div style="margin-bottom: 15px; background: #e8f5e8; padding: 10px; border: 1px solid #c8e6c9; border-radius: 4px;">
        <h4 style="margin: 0 0 8px 0; font-size: 13px; color: #2e7d32;">💰 Commission Parameters</h4>
        <p style="margin: 0; font-size: 12px; color: #2e7d32;">
          Type: ${params.type || 'All'} | 
          Scope: ${params.scope || 'Retailer'} | 
          Period: ${formatDateRange(params)}
        </p>
      </div>

      <p style="margin: 15px 0 0 0; font-size: 11px; color: #666; text-align: center;">
        Report generated: ${new Date().toLocaleString()} | Report ID: COM-${Math.random().toString(36).substr(2, 6).toUpperCase()}
      </p>
    </div>
  `;
}

function generateCashReport(params: ReportParams): string {
  const date = new Date(params.fromDate ? params.fromDate * 1000 : Date.now());
  const reportType = params.type || 'Day';
  
  return `
    <div style="font-family: Arial, sans-serif; padding: 15px; background: white; color: black; max-width: 100%; box-sizing: border-box;">
      <h2 style="color: #333; border-bottom: 2px solid #dc3545; padding-bottom: 8px; margin: 0 0 15px 0; font-size: 18px;">
        ${reportType}ly Cash Reconciliation - ${date.toDateString()}
      </h2>
      
      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 14px; margin: 10px 0; color: #555;">Cash Flow Summary</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Category</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Amount</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Count</th>
          </tr>
          ${generateRandomCashData(reportType).map(item => `
            <tr>
              <td style="border: 1px solid #dee2e6; padding: 8px;">${item.category}</td>
              <td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">${item.amount >= 0 ? '$' : '-$'}${Math.abs(item.amount).toFixed(2)}</td>
              <td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">${item.count}</td>
          </tr>
          `).join('')}
        </table>
      </div>

      <div style="margin-bottom: 15px; background: #ffebee; padding: 10px; border: 1px solid #ffcdd2; border-radius: 4px;">
        <h4 style="margin: 0 0 8px 0; font-size: 13px; color: #c62828;">🏦 Cash Parameters</h4>
        <p style="margin: 0; font-size: 12px; color: #c62828;">
          Type: ${params.type || 'Daily'} | 
          Scope: ${params.scope || 'All Locations'} | 
          Generated: ${new Date().toLocaleString()}
        </p>
      </div>

      <p style="margin: 15px 0 0 0; font-size: 11px; color: #666; text-align: center;">
        Report generated: ${new Date().toLocaleString()} | Report ID: CSH-${Math.random().toString(36).substr(2, 6).toUpperCase()}
      </p>
    </div>
  `;
}

function generateTransactionHistoryReport(params: ReportParams): string {
  const fromDate = new Date(params.fromDate ? params.fromDate * 1000 : Date.now() - 86400000);
  const toDate = new Date(params.toDate ? params.toDate * 1000 : Date.now());
  
  return `
    <div style="font-family: Arial, sans-serif; padding: 15px; background: white; color: black; max-width: 100%; box-sizing: border-box;">
      <h2 style="color: #333; border-bottom: 2px solid #6f42c1; padding-bottom: 8px; margin: 0 0 15px 0; font-size: 18px;">
        Transaction History Report
      </h2>
      
      <div style="margin-bottom: 15px; background: #f3e5f5; padding: 10px; border-radius: 4px;">
        <strong>Date Range:</strong> ${fromDate.toDateString()} to ${toDate.toDateString()}
      </div>
      
      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 14px; margin: 10px 0; color: #555;">Recent Transactions</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Time</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Type</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Game/Product</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Amount</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Status</th>
          </tr>
          ${generateRandomTransactionData().map(tx => `
            <tr>
              <td style="border: 1px solid #dee2e6; padding: 8px;">${tx.time}</td>
              <td style="border: 1px solid #dee2e6; padding: 8px;">${tx.type}</td>
              <td style="border: 1px solid #dee2e6; padding: 8px;">${tx.product}</td>
              <td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$${tx.amount}</td>
              <td style="border: 1px solid #dee2e6; padding: 8px; color: ${tx.status === 'Complete' ? 'green' : tx.status === 'Paid' ? 'green' : tx.status === 'Voided' ? 'orange' : 'blue'};">${tx.status}</td>
            </tr>
          `).join('')}
        </table>
      </div>

      <p style="margin: 15px 0 0 0; font-size: 11px; color: #666; text-align: center;">
        Report generated: ${new Date().toLocaleString()} | Report ID: TXH-${Math.random().toString(36).substr(2, 6).toUpperCase()}
      </p>
    </div>
  `;
}

function generateAdjustmentsReport(params: ReportParams): string {
  const date = new Date(params.fromDate ? params.fromDate * 1000 : Date.now());
  
  return `
    <div style="font-family: Arial, sans-serif; padding: 15px; background: white; color: black; max-width: 100%; box-sizing: border-box;">
      <h2 style="color: #333; border-bottom: 2px solid #ffc107; padding-bottom: 8px; margin: 0 0 15px 0; font-size: 18px;">
        Financial Adjustments Report - ${date.toDateString()}
      </h2>

      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 14px; margin: 10px 0; color: #555;">Adjustment Summary</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Adjustment Type</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Amount</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Reason</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Approved By</th>
          </tr>
          ${generateRandomAdjustmentData().map(adj => `
            <tr>
              <td style="border: 1px solid #dee2e6; padding: 8px;">${adj.type}</td>
              <td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">${adj.amount >= 0 ? '$' : '-$'}${Math.abs(adj.amount).toFixed(2)}</td>
              <td style="border: 1px solid #dee2e6; padding: 8px;">${adj.reason}</td>
              <td style="border: 1px solid #dee2e6; padding: 8px;">${adj.approver}</td>
          </tr>
          `).join('')}
        </table>
      </div>

      <p style="margin: 15px 0 0 0; font-size: 11px; color: #666; text-align: center;">
        Report generated: ${new Date().toLocaleString()} | Report ID: ADJ-${Math.random().toString(36).substr(2, 6).toUpperCase()}
      </p>
          </div>
  `;
}

function generateSummaryReport(params: ReportParams): string {
  return `
    <div style="font-family: Arial, sans-serif; padding: 15px; background: white; color: black; max-width: 100%; box-sizing: border-box;">
      <h2 style="color: #333; border-bottom: 2px solid #17a2b8; padding-bottom: 8px; margin: 0 0 15px 0; font-size: 18px;">
        Sales Summary Report
      </h2>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; text-align: center;">
          <h4 style="margin: 0 0 10px 0; color: #1976d2;">Total Sales</h4>
          <p style="margin: 0; font-size: 24px; font-weight: bold; color: #1976d2;">$${(Math.random() * 10000 + 5000).toFixed(2)}</p>
          </div>
        <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; text-align: center;">
          <h4 style="margin: 0 0 10px 0; color: #388e3c;">Total Commissions</h4>
          <p style="margin: 0; font-size: 24px; font-weight: bold; color: #388e3c;">$${(Math.random() * 500 + 200).toFixed(2)}</p>
          </div>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; text-align: center;">
          <h4 style="margin: 0 0 10px 0; color: #f57c00;">Transactions</h4>
          <p style="margin: 0; font-size: 24px; font-weight: bold; color: #f57c00;">${Math.floor(Math.random() * 200 + 50)}</p>
        </div>
      </div>

      <p style="margin: 15px 0 0 0; font-size: 11px; color: #666; text-align: center;">
        Report generated: ${new Date().toLocaleString()} | Report ID: SUM-${Math.random().toString(36).substr(2, 6).toUpperCase()}
      </p>
    </div>
  `;
}

function generateShiftsReport(params: ReportParams): string {
  return `
    <div style="font-family: Arial, sans-serif; padding: 15px; background: white; color: black; max-width: 100%; box-sizing: border-box;">
      <h2 style="color: #333; border-bottom: 2px solid #9c27b0; padding-bottom: 8px; margin: 0 0 15px 0; font-size: 18px;">
        Shifts Report
      </h2>
      
      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 14px; margin: 10px 0; color: #555;">Shift Summary</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Shift</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Employee</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Start Time</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">End Time</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Sales</th>
          </tr>
          ${generateRandomShiftData().map(shift => `
            <tr>
              <td style="border: 1px solid #dee2e6; padding: 8px;">${shift.shiftName}</td>
              <td style="border: 1px solid #dee2e6; padding: 8px;">${shift.employee}</td>
              <td style="border: 1px solid #dee2e6; padding: 8px;">${shift.startTime}</td>
              <td style="border: 1px solid #dee2e6; padding: 8px;">${shift.endTime}</td>
              <td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$${shift.sales}</td>
            </tr>
          `).join('')}
        </table>
      </div>

      <p style="margin: 15px 0 0 0; font-size: 11px; color: #666; text-align: center;">
        Report generated: ${new Date().toLocaleString()} | Report ID: SHF-${Math.random().toString(36).substr(2, 6).toUpperCase()}
      </p>
    </div>
  `;
}

function generateJackpotsReport(params: ReportParams): string {
  return `
    <div style="font-family: Arial, sans-serif; padding: 15px; background: white; color: black; max-width: 100%; box-sizing: border-box;">
      <h2 style="color: #333; border-bottom: 2px solid #ff5722; padding-bottom: 8px; margin: 0 0 15px 0; font-size: 18px;">
        Current Jackpots Report
      </h2>
      
      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 14px; margin: 10px 0; color: #555;">Active Jackpots</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Game</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Current Jackpot</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Next Draw</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Status</th>
          </tr>
          ${generateRandomJackpotData().map(jp => `
            <tr>
              <td style="border: 1px solid #dee2e6; padding: 8px;">${jp.game}</td>
              <td style="border: 1px solid #dee2e6; padding: 8px; text-align: right; font-weight: bold; color: #ff5722;">$${jp.amount}</td>
              <td style="border: 1px solid #dee2e6; padding: 8px;">${jp.nextDraw}</td>
              <td style="border: 1px solid #dee2e6; padding: 8px; color: green;">${jp.status}</td>
            </tr>
          `).join('')}
        </table>
      </div>

      <p style="margin: 15px 0 0 0; font-size: 11px; color: #666; text-align: center;">
        Report generated: ${new Date().toLocaleString()} | Report ID: JAK-${Math.random().toString(36).substr(2, 6).toUpperCase()}
      </p>
    </div>
  `;
}

function generateWinningNumbersReport(params: ReportParams): string {
  return `
    <div style="font-family: Arial, sans-serif; padding: 15px; background: white; color: black; max-width: 100%; box-sizing: border-box;">
      <h2 style="color: #333; border-bottom: 2px solid #795548; padding-bottom: 8px; margin: 0 0 15px 0; font-size: 18px;">
        Winning Numbers Report
      </h2>
      
      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 14px; margin: 10px 0; color: #555;">Latest Winning Numbers</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Game</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Draw Date</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Winning Numbers</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Prize Amount</th>
          </tr>
          ${generateRandomWinningNumbers().map(wn => `
            <tr>
              <td style="border: 1px solid #dee2e6; padding: 8px;">${wn.game}</td>
              <td style="border: 1px solid #dee2e6; padding: 8px;">${wn.drawDate}</td>
              <td style="border: 1px solid #dee2e6; padding: 8px; font-weight: bold; color: #795548;">${wn.numbers}</td>
              <td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$${wn.prize}</td>
            </tr>
          `).join('')}
        </table>
      </div>

      <p style="margin: 15px 0 0 0; font-size: 11px; color: #666; text-align: center;">
        Report generated: ${new Date().toLocaleString()} | Report ID: WIN-${Math.random().toString(36).substr(2, 6).toUpperCase()}
      </p>
    </div>
  `;
}

// Helper functions for generating random data
function generateRandomSalesData(type: string) {
  const baseMultiplier = type === 'Week' ? 7 : 1;
  return [
    { game: 'Instant Games', sales: (Math.random() * 1000 * baseMultiplier + 500).toFixed(2), wins: (Math.random() * 700 * baseMultiplier + 300).toFixed(2), net: (Math.random() * 400 * baseMultiplier + 200).toFixed(2) },
    { game: 'Draw Games', sales: (Math.random() * 2000 * baseMultiplier + 1000).toFixed(2), wins: (Math.random() * 1200 * baseMultiplier + 800).toFixed(2), net: (Math.random() * 900 * baseMultiplier + 400).toFixed(2) },
    { game: 'Keno', sales: (Math.random() * 600 * baseMultiplier + 300).toFixed(2), wins: (Math.random() * 400 * baseMultiplier + 200).toFixed(2), net: (Math.random() * 250 * baseMultiplier + 100).toFixed(2) },
    { game: 'Sports Betting', sales: (Math.random() * 900 * baseMultiplier + 400).toFixed(2), wins: (Math.random() * 700 * baseMultiplier + 350).toFixed(2), net: (Math.random() * 300 * baseMultiplier + 100).toFixed(2) }
  ];
}

function generateRandomCommissionData(type: string) {
  const baseMultiplier = type === 'Week' ? 7 : 1;
  return [
    { type: 'Instant Game Sales', volume: (Math.random() * 1000 * baseMultiplier + 500).toFixed(2), rate: '7.0', commission: (Math.random() * 70 * baseMultiplier + 35).toFixed(2) },
    { type: 'Draw Game Sales', volume: (Math.random() * 2000 * baseMultiplier + 1000).toFixed(2), rate: '6.0', commission: (Math.random() * 120 * baseMultiplier + 60).toFixed(2) },
    { type: 'Keno Commissions', volume: (Math.random() * 600 * baseMultiplier + 300).toFixed(2), rate: '5.5', commission: (Math.random() * 33 * baseMultiplier + 16).toFixed(2) },
    { type: 'Sports Betting', volume: (Math.random() * 900 * baseMultiplier + 400).toFixed(2), rate: '4.5', commission: (Math.random() * 40 * baseMultiplier + 18).toFixed(2) }
  ];
}

function generateRandomCashData(type: string) {
  return [
    { category: 'Starting Cash', amount: 500, count: 1 },
    { category: 'Cash Sales', amount: Math.random() * 2000 + 1000, count: Math.floor(Math.random() * 200 + 100) },
    { category: 'Prize Payouts', amount: -(Math.random() * 1500 + 800), count: Math.floor(Math.random() * 80 + 40) },
    { category: 'Cash Advances', amount: -(Math.random() * 300 + 100), count: Math.floor(Math.random() * 8 + 2) },
    { category: 'Bank Deposits', amount: -(Math.random() * 1000 + 500), count: Math.floor(Math.random() * 4 + 1) }
  ];
}

function generateRandomTransactionData(): Array<{
  time: string;
  type: string;
  product: string;
  amount: string;
  status: string;
}> {
  const transactions: Array<{
    time: string;
    type: string;
    product: string;
    amount: string;
    status: string;
  }> = [];
  const games = ['Powerball', 'Mega Millions', 'Pick 3', 'Pick 4', 'Keno', 'Lucky 7s', 'Cash Explosion', 'Scratch #501'];
  const types = ['Sale', 'Prize', 'Void', 'Refund'];
  const statuses = ['Complete', 'Paid', 'Voided', 'Refunded'];
  
  for (let i = 0; i < 15; i++) {
    const now = new Date();
    const time = new Date(now.getTime() - Math.random() * 8 * 60 * 60 * 1000);
    transactions.push({
      time: time.toLocaleTimeString(),
      type: types[Math.floor(Math.random() * types.length)],
      product: games[Math.floor(Math.random() * games.length)],
      amount: (Math.random() * 100 + 1).toFixed(2),
      status: statuses[Math.floor(Math.random() * statuses.length)]
    });
  }
  
  return transactions;
}

function generateRandomAdjustmentData() {
  const types = ['Prize Correction', 'Till Variance', 'System Error', 'Inventory Adjustment'];
  const reasons = ['Customer Dispute', 'Terminal Malfunction', 'Operator Error', 'System Sync Issue'];
  const approvers = ['Manager Smith', 'Supervisor Jones', 'Area Manager Brown', 'District Manager Wilson'];
  
  return Array.from({ length: 6 }, () => ({
    type: types[Math.floor(Math.random() * types.length)],
    amount: (Math.random() - 0.5) * 200,
    reason: reasons[Math.floor(Math.random() * reasons.length)],
    approver: approvers[Math.floor(Math.random() * approvers.length)]
  }));
}

function generateRandomShiftData() {
  const employees = ['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson'];
  const shifts = ['Morning', 'Afternoon', 'Evening', 'Night'];
  
  return Array.from({ length: 4 }, (_, i) => ({
    shiftName: shifts[i],
    employee: employees[i],
    startTime: `${8 + i * 4}:00 AM`,
    endTime: `${12 + i * 4}:00 ${i < 1 ? 'PM' : 'AM'}`,
    sales: (Math.random() * 3000 + 1000).toFixed(2)
  }));
}

function generateRandomJackpotData() {
  const games = ['Powerball', 'Mega Millions', 'Super Lotto', 'Fantasy 5', 'Daily 4'];
  
  return games.map(game => ({
    game,
    amount: (Math.random() * 50000000 + 5000000).toLocaleString(),
    nextDraw: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toDateString(),
    status: 'Active'
  }));
}

function generateRandomWinningNumbers() {
  return [
    { game: 'Powerball', drawDate: '2024-06-20', numbers: '07-14-21-35-42 PB: 18', prize: '25,000,000' },
    { game: 'Mega Millions', drawDate: '2024-06-19', numbers: '03-11-26-33-47 MB: 12', prize: '87,000,000' },
    { game: 'Pick 3', drawDate: '2024-06-20', numbers: '5-7-2', prize: '500' },
    { game: 'Pick 4', drawDate: '2024-06-20', numbers: '8-1-4-9', prize: '5,000' },
    { game: 'Daily 4', drawDate: '2024-06-20', numbers: '2-6-8-3', prize: '5,000' }
  ];
}

// 📊 Financial Reports (Tab Layout Examples)
function generateDailySalesSummary(params: ReportParams): string {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: white; color: black;">
      <h2 style="color: #333; border-bottom: 2px solid #4a90e2; padding-bottom: 10px;">📊 Daily Sales Summary</h2>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0;">
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; border-left: 4px solid #2196f3;">
          <h4 style="margin: 0 0 5px 0; color: #1976d2;">Total Sales</h4>
          <p style="font-size: 24px; font-weight: bold; margin: 0; color: #1976d2;">$12,847.50</p>
        </div>
        <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; border-left: 4px solid #4caf50;">
          <h4 style="margin: 0 0 5px 0; color: #388e3c;">Transactions</h4>
          <p style="font-size: 24px; font-weight: bold; margin: 0; color: #388e3c;">247</p>
        </div>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; border-left: 4px solid #ff9800;">
          <h4 style="margin: 0 0 5px 0; color: #f57c00;">Avg. Transaction</h4>
          <p style="font-size: 24px; font-weight: bold; margin: 0; color: #f57c00;">$52.02</p>
        </div>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background-color: #f5f5f5;">
          <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Hour</th>
          <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Sales</th>
          <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Transactions</th>
        </tr>
        ${Array.from({length: 12}, (_, i) => {
          const hour = i + 8;
          const sales = Math.round(Math.random() * 2000 + 500);
          const transactions = Math.round(Math.random() * 30 + 10);
          return `
            <tr>
              <td style="border: 1px solid #ddd; padding: 12px;">${hour}:00 - ${hour + 1}:00</td>
              <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">$${sales}</td>
              <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">${transactions}</td>
            </tr>
          `;
        }).join('')}
      </table>
    </div>
  `;
}

function generateWeeklyRevenueAnalysis(params: ReportParams): string {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: white; color: black;">
      <h2 style="color: #333; border-bottom: 2px solid #9c27b0; padding-bottom: 10px;">📈 Weekly Revenue Analysis</h2>
      
      <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0; color: #7b1fa2;">Analysis Type: ${params.type || 'Week'}</h3>
        <p style="margin: 0; color: #7b1fa2;">Detailed breakdown of revenue patterns and trends.</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin: 20px 0;">
        ${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
          const revenue = Math.round(Math.random() * 3000 + 1000);
          return `
            <div style="background: #f8f9fa; padding: 10px; border-radius: 6px; text-align: center;">
              <h4 style="margin: 0 0 5px 0; font-size: 14px;">${day}</h4>
              <p style="font-weight: bold; margin: 0; color: #7b1fa2;">$${revenue}</p>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function generateMonthlyProfitLoss(params: ReportParams): string {
  const profit = Math.round(Math.random() * 50000 + 20000);
  const revenue = Math.round(profit / 0.25);
  const expenses = revenue - profit;
  
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: white; color: black;">
      <h2 style="color: #333; border-bottom: 2px solid #ff5722; padding-bottom: 10px;">💰 Monthly P&L Statement</h2>
      
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0;">
        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; text-align: center;">
          <h3 style="margin: 0 0 10px 0; color: #2e7d32;">Revenue</h3>
          <p style="font-size: 28px; font-weight: bold; margin: 0; color: #2e7d32;">$${revenue.toLocaleString()}</p>
        </div>
        <div style="background: #ffebee; padding: 20px; border-radius: 8px; text-align: center;">
          <h3 style="margin: 0 0 10px 0; color: #c62828;">Expenses</h3>
          <p style="font-size: 28px; font-weight: bold; margin: 0; color: #c62828;">$${expenses.toLocaleString()}</p>
        </div>
        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; text-align: center;">
          <h3 style="margin: 0 0 10px 0; color: #1565c0;">Net Profit</h3>
          <p style="font-size: 28px; font-weight: bold; margin: 0; color: #1565c0;">$${profit.toLocaleString()}</p>
        </div>
      </div>
    </div>
  `;
}

function generateQuarterlyOverview(params: ReportParams): string {
  const quarter = params.type || 'Q1';
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: white; color: black;">
      <h2 style="color: #333; border-bottom: 2px solid #673ab7; padding-bottom: 10px;">📅 ${quarter} Financial Overview</h2>
      
      <div style="background: #ede7f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0; color: #512da8;">Quarter: ${quarter}</h3>
        <p style="margin: 0; color: #512da8;">Comprehensive financial summary for the selected quarter.</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0;">
        ${['Month 1', 'Month 2', 'Month 3'].map(month => {
          const value = Math.round(Math.random() * 100000 + 50000);
          return `
            <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; text-align: center;">
              <h4 style="margin: 0 0 10px 0; color: #7b1fa2;">${month}</h4>
              <p style="font-size: 20px; font-weight: bold; margin: 0; color: #7b1fa2;">$${value.toLocaleString()}</p>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// 📈 Analytics Dashboard Generators
function generateCustomerAnalytics(params: ReportParams): string {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: white; color: black;">
      <h2 style="color: #333; border-bottom: 2px solid #00bcd4; padding-bottom: 10px;">👥 Customer Analytics Dashboard</h2>
      
      <div style="background: #e0f2f1; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0; color: #00695c;">Analysis Type: ${params.type || 'Daily'}</h3>
        <p style="margin: 0; color: #00695c;">Customer behavior and engagement metrics.</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0;">
        <div style="background: #e1f5fe; padding: 15px; border-radius: 8px;">
          <h4 style="margin: 0 0 5px 0; color: #0277bd;">Active Customers</h4>
          <p style="font-size: 24px; font-weight: bold; margin: 0; color: #0277bd;">1,247</p>
        </div>
        <div style="background: #f3e5f5; padding: 15px; border-radius: 8px;">
          <h4 style="margin: 0 0 5px 0; color: #7b1fa2;">New Customers</h4>
          <p style="font-size: 24px; font-weight: bold; margin: 0; color: #7b1fa2;">89</p>
        </div>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px;">
          <h4 style="margin: 0 0 5px 0; color: #e65100;">Retention Rate</h4>
          <p style="font-size: 24px; font-weight: bold; margin: 0; color: #e65100;">87.3%</p>
        </div>
      </div>
    </div>
  `;
}

function generateProductPerformance(params: ReportParams): string {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: white; color: black;">
      <h2 style="color: #333; border-bottom: 2px solid #795548; padding-bottom: 10px;">📦 Product Performance Analysis</h2>
      
      <div style="background: #efebe9; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0; color: #5d4037;">Scope: ${params.scope || 'All Products'}</h3>
        <p style="margin: 0; color: #5d4037;">Product sales and performance metrics analysis.</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background-color: #f5f5f5;">
          <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Product</th>
          <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Sales</th>
          <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Units</th>
          <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Performance</th>
        </tr>
        ${['Lottery Tickets', 'Scratch Cards', 'Digital Games', 'Bonus Games', 'Jackpot Games'].map(product => {
          const sales = Math.round(Math.random() * 10000 + 2000);
          const units = Math.round(Math.random() * 500 + 100);
          const performance = (Math.random() * 40 - 20).toFixed(1);
          const color = parseFloat(performance) > 0 ? '#2e7d32' : '#c62828';
          return `
            <tr>
              <td style="border: 1px solid #ddd; padding: 12px;">${product}</td>
              <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">$${sales.toLocaleString()}</td>
              <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">${units}</td>
              <td style="border: 1px solid #ddd; padding: 12px; text-align: right; color: ${color};">${performance}%</td>
            </tr>
          `;
        }).join('')}
      </table>
    </div>
  `;
}

function generateRegionalComparison(params: ReportParams): string {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: white; color: black;">
      <h2 style="color: #333; border-bottom: 2px solid #607d8b; padding-bottom: 10px;">🌎 Regional Comparison Report</h2>
      
      <div style="background: #eceff1; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0; color: #455a64;">Region: ${params.type || 'All Regions'}</h3>
        <p style="margin: 0; color: #455a64;">Regional performance comparison and analysis.</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; margin: 20px 0;">
        ${['North', 'South', 'East', 'West'].map(region => {
          const revenue = Math.round(Math.random() * 50000 + 20000);
          const growth = (Math.random() * 30 - 10).toFixed(1);
          const color = parseFloat(growth) > 0 ? '#2e7d32' : '#c62828';
          return `
            <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; text-align: center;">
              <h4 style="margin: 0 0 5px 0; color: #455a64;">${region} Region</h4>
              <p style="font-size: 18px; font-weight: bold; margin: 5px 0; color: #455a64;">$${revenue.toLocaleString()}</p>
              <p style="margin: 0; color: ${color}; font-weight: bold;">${growth}% growth</p>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function generateTrendAnalysis(params: ReportParams): string {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: white; color: black;">
      <h2 style="color: #333; border-bottom: 2px solid #ff5722; padding-bottom: 10px;">📊 Trend Analysis Report</h2>
      
      <div style="background: #fbe9e7; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0; color: #d84315;">Trend Type: ${params.type || 'Sales Trends'}</h3>
        <p style="margin: 0; color: #d84315;">Analysis of trends and patterns over time.</p>
      </div>

      <div style="margin: 20px 0;">
        <h4 style="color: #333;">Key Trend Indicators</h4>
        <ul style="list-style-type: none; padding: 0;">
          ${['Upward trend in digital sales (+15.3%)', 'Seasonal peak expected in Q4', 'Customer retention improving', 'New product categories gaining traction'].map(trend => `
            <li style="background: #f8f9fa; padding: 10px; margin: 5px 0; border-left: 4px solid #ff5722; border-radius: 4px;">
              ${trend}
            </li>
          `).join('')}
        </ul>
      </div>
    </div>
  `;
}

// 🐛 Debug Reports with Long Content
function generateSuperLongReport(params: ReportParams): string {
  const sections = Array.from({length: 20}, (_, i) => `
    <div style="margin: 30px 0; padding: 20px; background: ${i % 2 ? '#f8f9fa' : '#ffffff'}; border-radius: 8px;">
      <h3 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Section ${i + 1}: Data Analysis</h3>
      <p style="line-height: 1.6; margin: 15px 0;">
        This is section ${i + 1} of the super long debug report. This section contains extensive data analysis, 
        detailed metrics, and comprehensive information that would typically be found in a real-world report. 
        The purpose of this section is to test the scrolling behavior and ensure that the ImageScroller 
        component handles long content properly.
      </p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <tr style="background-color: #f5f5f5;">
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Metric</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Value</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Change</th>
        </tr>
        ${Array.from({length: 5}, (_, j) => {
          const value = Math.round(Math.random() * 10000);
          const change = (Math.random() * 20 - 10).toFixed(1);
          return `
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">Metric ${j + 1}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${value}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${change}%</td>
            </tr>
          `;
        }).join('')}
      </table>
      
      <p style="line-height: 1.6; margin: 15px 0;">
        Additional analysis shows comprehensive data patterns and trends for section ${i + 1}. 
        This content is designed to be extensive and demonstrate how the ImageScroller handles 
        long scrollable content in both regular and fullscreen modes.
      </p>
    </div>
  `).join('');

  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: white; color: black;">
      <h1 style="color: #333; border-bottom: 3px solid #2196f3; padding-bottom: 15px; margin-bottom: 30px;">
        🐛 Super Long Debug Report
      </h1>
      
      <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="margin: 0 0 10px 0; color: #1565c0;">Report Purpose</h2>
        <p style="margin: 0; color: #1565c0;">
          This is a debug report designed to test the scrolling behavior of the ImageScroller component 
          with very long content. It contains multiple sections with tables, text, and various elements 
          to simulate a real-world long report.
        </p>
      </div>

      ${sections}
      
      <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 30px 0;">
        <h2 style="margin: 0 0 10px 0; color: #2e7d32;">Report Summary</h2>
        <p style="margin: 0; color: #2e7d32;">
          End of super long debug report. This report contained 20 sections with comprehensive data 
          to test scrolling functionality and ensure proper display of long content in both regular 
          and fullscreen tab layout modes.
        </p>
      </div>
    </div>
  `;
}

function generateImageHeavyReport(params: ReportParams): string {
  const placeholderImages = Array.from({length: 8}, (_, i) => `
    <div style="margin: 20px 0; text-align: center;">
      <h4 style="color: #333; margin: 10px 0;">Chart ${i + 1}: Performance Metrics</h4>
      <div style="width: 100%; height: 300px; background: linear-gradient(45deg, #f0f0f0 25%, transparent 25%), 
                  linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), 
                  linear-gradient(45deg, transparent 75%, #f0f0f0 75%), 
                  linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
                  background-size: 20px 20px;
                  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
                  border: 2px dashed #ccc;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: #666;
                  font-size: 18px;
                  border-radius: 8px;">
        📊 Mock Chart ${i + 1}<br/>
        <span style="font-size: 14px;">(768x300px placeholder)</span>
      </div>
      <p style="font-size: 12px; color: #666; margin: 10px 0;">
        Chart ${i + 1} description: This would be a real chart showing performance metrics, 
        trends, and analytical data in a production environment. Testing tab layout with images.
      </p>
    </div>
  `).join('');

  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: white; color: black;">
      <h1 style="color: #333; border-bottom: 3px solid #9c27b0; padding-bottom: 15px; margin-bottom: 30px;">
        🖼️ Image Heavy Debug Report
      </h1>
      
      <div style="background: #f3e5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="margin: 0 0 10px 0; color: #7b1fa2;">Report Purpose</h2>
        <p style="margin: 0; color: #7b1fa2;">
          This debug report contains multiple large placeholder images to test how the ImageScroller 
          handles image-heavy content in tab layout and ensures proper centering behavior and fullscreen support.
        </p>
      </div>

      ${placeholderImages}
      
      <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 30px 0;">
        <h2 style="margin: 0 0 10px 0; color: #2e7d32;">Image Report Summary</h2>
        <p style="margin: 0; color: #2e7d32;">
          This report contained 8 placeholder images to test image handling and scrolling behavior 
          in tab layout with fullscreen modal support.
        </p>
      </div>
    </div>
  `;
}

function generateMixedContentReport(params: ReportParams): string {
  const contentType = params.type || 'Balanced';
  
  if (contentType === 'Text Heavy') {
    return generateSuperLongReport(params);
  } else if (contentType === 'Image Heavy') {
    return generateImageHeavyReport(params);
  }
  
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: white; color: black;">
      <h1 style="color: #333; border-bottom: 3px solid #ff9800; padding-bottom: 15px; margin-bottom: 30px;">
        🔄 Mixed Content Debug Report
      </h1>
      
      <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="margin: 0 0 10px 0; color: #e65100;">Content Type: ${contentType}</h2>
        <p style="margin: 0; color: #e65100;">
          This report mixes text content with images to test various content combinations in tab layout.
        </p>
      </div>

      <div style="margin: 20px 0;">
        <h3 style="color: #333;">Text Section</h3>
        <p style="line-height: 1.6;">
          This is a text section that provides context and analysis. It contains important information 
          that would typically be found alongside charts and graphs in a real report, especially 
          useful for testing tab layout with mixed content.
        </p>
      </div>

      <div style="margin: 20px 0; text-align: center;">
        <h4 style="color: #333; margin: 10px 0;">Performance Chart</h4>
        <div style="width: 100%; height: 250px; background: linear-gradient(45deg, #f0f0f0 25%, transparent 25%), 
                    linear-gradient(-45deg, #f0f0f0 25%, transparent 25%);
                    background-size: 20px 20px;
                    border: 2px dashed #ccc;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #666;
                    border-radius: 8px;">
          📊 Mixed Content Chart<br/>
          <span style="font-size: 14px;">(Tab Layout Test)</span>
        </div>
      </div>

      <div style="margin: 20px 0;">
        <h3 style="color: #333;">Analysis</h3>
        <p style="line-height: 1.6;">
          The chart above shows the performance metrics for the mixed content analysis. 
          This demonstrates how text and images work together in the ImageScroller component 
          within a tab layout structure.
        </p>
      </div>
    </div>
  `;
}

function generateMinimalContentReport(params: ReportParams): string {
  return `
    <div style="font-family: Arial, sans-serif; padding: 40px; background: white; color: black; text-align: center;">
      <h1 style="color: #333; margin-bottom: 30px;">📄 Minimal Content Report</h1>
      
      <div style="background: #f5f5f5; padding: 30px; border-radius: 12px; margin: 20px auto; max-width: 400px;">
        <h2 style="margin: 0 0 15px 0; color: #666;">Test: Content Centering</h2>
        <p style="margin: 0; color: #666; line-height: 1.6;">
          This minimal report tests the centering behavior when content is small enough to fit 
          in the available space without scrolling, especially in tab layout.
        </p>
      </div>
      
      <div style="margin: 30px 0;">
        <p style="font-size: 18px; color: #2196f3; font-weight: bold;">
          ✅ Content should be vertically centered in tab layout
        </p>
      </div>
    </div>
  `;
}

function formatDateRange(params: ReportParams): string {
  if (params.fromDate && params.toDate) {
    const from = new Date(params.fromDate * 1000).toDateString();
    const to = new Date(params.toDate * 1000).toDateString();
    return `${from} to ${to}`;
  } else if (params.fromDate) {
    return new Date(params.fromDate * 1000).toDateString();
  }
  return 'Current';
}

// Main service class
class MockReportService {
  private defaultOptions: MockFetchOptions = {
    delay: 600,
    status: 200,
    errorRate: 0
  };

  async getReport(params: ReportParams, options: MockFetchOptions = {}): Promise<string> {
    const finalOptions = { ...this.defaultOptions, ...options };
    
    // Simulate random errors if errorRate is set
    if (finalOptions.errorRate && Math.random() < finalOptions.errorRate) {
      throw new Error(`Simulated error for testing (${Math.floor(Math.random() * 400 + 500)})`);
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, finalOptions.delay));

    // Check if we have a specific configuration for this slug
    const config = MOCK_REPORT_CONFIGS[params.slug];
    
    if (config) {
      return config.generator(params);
    }

    // Fallback to generic report
    return this.getDefaultReport(params);
  }

  getReportConfig(slug: string) {
    return MOCK_REPORT_CONFIGS[slug];
  }

  private getDefaultReport(params: ReportParams): string {
    return `
      <div style="font-family: Arial, sans-serif; padding: 15px; background: white; color: black; max-width: 100%; box-sizing: border-box;">
        <h2 style="color: #333; border-bottom: 2px solid #ffc107; padding-bottom: 8px; margin: 0 0 15px 0; font-size: 18px;">
          ${params.slug.replace(/[-/]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Report
        </h2>
        
        <div style="margin-bottom: 20px;">
          <h3 style="font-size: 14px; margin: 10px 0; color: #555;">Report Information</h3>
          <p style="font-size: 12px; margin: 5px 0;">This is a mock report for demonstration purposes.</p>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin: 15px 0;">
            <tr style="background-color: #f8f9fa;">
              <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Parameter</th>
              <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Value</th>
            </tr>
            ${Object.entries(params).map(([key, value]) => 
              `<tr><td style="border: 1px solid #dee2e6; padding: 8px;"><strong>${key}</strong></td><td style="border: 1px solid #dee2e6; padding: 8px;">${value || 'Not provided'}</td></tr>`
            ).join('')}
          </table>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="font-size: 14px; margin: 10px 0; color: #555;">Sample Data</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <tr style="background-color: #f8f9fa;">
              <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Description</th>
              <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Count</th>
              <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Amount</th>
            </tr>
            <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Sample Item 1</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">5</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$125.00</td></tr>
            <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Sample Item 2</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">12</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$245.50</td></tr>
            <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Sample Item 3</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">8</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$89.75</td></tr>
            <tr style="font-weight: bold; background-color: #fff3cd;">
              <td style="border: 1px solid #dee2e6; padding: 8px;">TOTAL</td>
              <td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">25</td>
              <td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$460.25</td>
            </tr>
          </table>
        </div>

        <div style="margin-bottom: 15px; background: #d1ecf1; padding: 10px; border: 1px solid #bee5eb; border-radius: 4px;">
          <h4 style="margin: 0 0 8px 0; font-size: 13px; color: #0c5460;">📊 Report Notes</h4>
          <p style="margin: 0; font-size: 12px; color: #0c5460;">
            This is a placeholder report. Replace this mock service with your actual API integration 
            to display real data for "${params.slug}" reports.
          </p>
        </div>

        <p style="margin: 15px 0 0 0; font-size: 11px; color: #666; text-align: center;">
          Mock report generated: ${new Date().toLocaleString()} | Report Type: ${params.slug} | Report ID: GEN-${Math.random().toString(36).substr(2, 6).toUpperCase()}
        </p>
      </div>
    `;
  }
}

export const mockReportService = new MockReportService(); 