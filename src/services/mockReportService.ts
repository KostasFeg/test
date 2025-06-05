export interface ReportParams {
  slug: string;
  type?: string;
  scope?: string;
  offset?: string | number;
  fromDate?: number;
  toDate?: number;
  withTime?: boolean;
  withAutoTime?: boolean;
}

export interface ReportResponse {
  htmlContent: string;
  metadata?: {
    generatedAt: string;
    parameters: ReportParams;
  };
}

// Mock HTML content for different report types - optimized for ImageScroller
const MOCK_REPORTS: Record<string, string> = {
  'sales': `
    <div style="font-family: Arial, sans-serif; padding: 15px; background: white; color: black; max-width: 100%; box-sizing: border-box;">
      <h2 style="color: #333; border-bottom: 2px solid #4a90e2; padding-bottom: 8px; margin: 0 0 15px 0; font-size: 18px;">Sales Report</h2>
      
      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 14px; margin: 10px 0; color: #555;">Daily Sales Summary</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Game Type</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Sales</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Wins</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Net</th>
          </tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Instant Games</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$1,245.50</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$892.25</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$353.25</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Draw Games</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$2,180.00</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$1,350.00</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$830.00</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Keno</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$550.25</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$385.75</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$164.50</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Sports Betting</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$890.00</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$712.50</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$177.50</td></tr>
          <tr style="font-weight: bold; background-color: #e3f2fd;">
            <td style="border: 1px solid #dee2e6; padding: 8px;">TOTAL</td>
            <td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$4,865.75</td>
            <td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$3,340.50</td>
            <td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$1,525.25</td>
          </tr>
        </table>
      </div>

      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 14px; margin: 10px 0; color: #555;">Hourly Breakdown</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Hour</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Transactions</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Sales</th>
          </tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">08:00-09:00</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">15</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$245.50</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">09:00-10:00</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">23</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$412.75</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">10:00-11:00</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">31</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$567.25</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">11:00-12:00</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">28</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$489.00</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">12:00-13:00</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">42</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$723.50</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">13:00-14:00</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">38</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$634.25</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">14:00-15:00</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">35</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$581.75</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">15:00-16:00</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">29</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$456.25</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">16:00-17:00</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">33</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$521.00</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">17:00-18:00</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">26</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$234.50</td></tr>
        </table>
      </div>

      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 14px; margin: 10px 0; color: #555;">Top Selling Games</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Game</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Tickets</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Sales</th>
          </tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Lucky 7s</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">45</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$450.00</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Cash Explosion</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">32</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$640.00</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Powerball</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">89</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$890.00</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Mega Millions</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">67</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$670.00</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Pick 3</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">124</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$620.00</td></tr>
        </table>
      </div>

      <div style="margin-bottom: 15px;">
        <h3 style="font-size: 14px; margin: 10px 0; color: #555;">Payment Methods</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Method</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Count</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Amount</th>
          </tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Cash</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">245</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$3,234.50</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Credit Card</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">89</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$1,456.25</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Debit Card</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">23</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$175.00</td></tr>
        </table>
      </div>

      <p style="margin: 15px 0 0 0; font-size: 11px; color: #666; text-align: center;">
        Report generated: ${new Date().toLocaleString()} | Terminal: POS-001 | Operator: Manager
      </p>
    </div>
  `,
  'commissions': `
    <div style="font-family: Arial, sans-serif; padding: 15px; background: white; color: black; max-width: 100%; box-sizing: border-box;">
      <h2 style="color: #333; border-bottom: 2px solid #28a745; padding-bottom: 8px; margin: 0 0 15px 0; font-size: 18px;">Commission Report</h2>
      
      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 14px; margin: 10px 0; color: #555;">Commission Summary</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Commission Type</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Sales Volume</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Rate</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Commission</th>
          </tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Instant Game Sales</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$1,245.50</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">7.0%</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$87.19</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Draw Game Sales</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$2,180.00</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">6.0%</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$130.80</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Keno Commissions</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$550.25</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">5.5%</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$30.26</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Sports Betting</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$890.00</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">4.5%</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$40.05</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Online Sales Bonus</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$320.00</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">2.0%</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$6.40</td></tr>
          <tr style="font-weight: bold; background-color: #e8f5e8;">
            <td style="border: 1px solid #dee2e6; padding: 8px;">TOTAL COMMISSION</td>
            <td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$5,185.75</td>
            <td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">-</td>
            <td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$294.70</td>
          </tr>
        </table>
      </div>

      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 14px; margin: 10px 0; color: #555;">Weekly Commission History</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Week Ending</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Sales</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Commission</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Status</th>
          </tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Dec 15, 2024</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$34,567.25</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$2,084.04</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right; color: green;">Paid</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Dec 08, 2024</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$32,145.80</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$1,928.75</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right; color: green;">Paid</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Dec 01, 2024</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$29,834.45</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$1,790.07</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right; color: green;">Paid</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Nov 24, 2024</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$31,256.20</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$1,875.37</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right; color: green;">Paid</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Nov 17, 2024</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$28,945.15</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$1,736.71</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right; color: green;">Paid</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Nov 10, 2024</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$33,412.90</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$2,004.77</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right; color: green;">Paid</td></tr>
        </table>
      </div>

      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 14px; margin: 10px 0; color: #555;">Commission Rate Details</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Product</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Base Rate</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Bonus Rate</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Effective Rate</th>
          </tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Scratch Tickets ($1-$5)</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">6.0%</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">0.5%</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">6.5%</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Scratch Tickets ($10+)</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">7.0%</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">1.0%</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">8.0%</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Draw Games</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">6.0%</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">0.0%</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">6.0%</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Multi-State Games</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">5.5%</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">0.0%</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">5.5%</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Keno</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">5.5%</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">0.0%</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">5.5%</td></tr>
        </table>
      </div>

      <div style="margin-bottom: 15px;">
        <h3 style="font-size: 14px; margin: 10px 0; color: #555;">Performance Metrics</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
          <div style="flex: 1; min-width: 150px; background: #f8f9fa; padding: 10px; border-radius: 4px; border: 1px solid #dee2e6;">
            <strong style="font-size: 11px; color: #666;">Monthly Sales Target</strong><br>
            <span style="font-size: 14px; font-weight: bold; color: #28a745;">$125,000</span>
          </div>
          <div style="flex: 1; min-width: 150px; background: #f8f9fa; padding: 10px; border-radius: 4px; border: 1px solid #dee2e6;">
            <strong style="font-size: 11px; color: #666;">Current Month Sales</strong><br>
            <span style="font-size: 14px; font-weight: bold; color: #007bff;">$98,456</span>
          </div>
          <div style="flex: 1; min-width: 150px; background: #f8f9fa; padding: 10px; border-radius: 4px; border: 1px solid #dee2e6;">
            <strong style="font-size: 11px; color: #666;">Achievement</strong><br>
            <span style="font-size: 14px; font-weight: bold; color: #ffc107;">78.8%</span>
          </div>
        </div>
      </div>

      <p style="margin: 15px 0 0 0; font-size: 11px; color: #666; text-align: center;">
        Report generated: ${new Date().toLocaleString()} | Commission Period: Current Month | Retailer ID: RTL-001
      </p>
    </div>
  `,
  'cashes': `
    <div style="font-family: Arial, sans-serif; padding: 15px; background: white; color: black; max-width: 100%; box-sizing: border-box;">
      <h2 style="color: #333; border-bottom: 2px solid #dc3545; padding-bottom: 8px; margin: 0 0 15px 0; font-size: 18px;">Cash Reconciliation Report</h2>
      
      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 14px; margin: 10px 0; color: #555;">Daily Cash Summary</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Category</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Amount</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Count</th>
          </tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Starting Cash</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$500.00</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">-</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Cash Sales</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$2,145.75</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">245</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Prize Payouts</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">-$1,850.25</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">89</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Cash Advances</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">-$200.00</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">4</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Bank Deposits</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">-$1,500.00</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">2</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Change Fund Adjustments</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$25.00</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">1</td></tr>
          <tr style="font-weight: bold; background-color: #ffebee;">
            <td style="border: 1px solid #dee2e6; padding: 8px;">Expected Cash on Hand</td>
            <td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$-879.50</td>
            <td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">341</td>
          </tr>
        </table>
      </div>

      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 14px; margin: 10px 0; color: #555;">Cash Drawer Detail</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Denomination</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Count</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Value</th>
          </tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">$100 Bills</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">15</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$1,500.00</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">$50 Bills</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">8</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$400.00</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">$20 Bills</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">42</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$840.00</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">$10 Bills</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">23</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$230.00</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">$5 Bills</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">35</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$175.00</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">$1 Bills</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">89</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$89.00</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Quarters</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">156</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$39.00</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Dimes</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">245</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$24.50</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Nickels</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">134</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$6.70</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Pennies</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">567</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$5.67</td></tr>
          <tr style="font-weight: bold; background-color: #e8f5e8;">
            <td style="border: 1px solid #dee2e6; padding: 8px;">Total Counted</td>
            <td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">1,314</td>
            <td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$3,309.87</td>
          </tr>
        </table>
      </div>

      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 14px; margin: 10px 0; color: #555;">Variance Analysis</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Description</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Expected</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Actual</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Variance</th>
          </tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Cash in Drawer</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$-879.50</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$3,309.87</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right; color: red;">$4,189.37</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Till Balance</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$500.00</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$500.00</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right; color: green;">$0.00</td></tr>
        </table>
      </div>

      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 14px; margin: 10px 0; color: #555;">Recent Cash Transactions</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Time</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Type</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Amount</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Reference</th>
          </tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">17:45:12</td><td style="border: 1px solid #dee2e6; padding: 8px;">Cash Sale</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$25.00</td><td style="border: 1px solid #dee2e6; padding: 8px;">TXN-8901</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">17:42:33</td><td style="border: 1px solid #dee2e6; padding: 8px;">Prize Payout</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">-$50.00</td><td style="border: 1px solid #dee2e6; padding: 8px;">WIN-5432</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">17:38:15</td><td style="border: 1px solid #dee2e6; padding: 8px;">Cash Sale</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$15.00</td><td style="border: 1px solid #dee2e6; padding: 8px;">TXN-8900</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">17:35:22</td><td style="border: 1px solid #dee2e6; padding: 8px;">Bank Deposit</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">-$1,000.00</td><td style="border: 1px solid #dee2e6; padding: 8px;">DEP-0234</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">17:30:08</td><td style="border: 1px solid #dee2e6; padding: 8px;">Cash Sale</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$10.00</td><td style="border: 1px solid #dee2e6; padding: 8px;">TXN-8899</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">17:25:44</td><td style="border: 1px solid #dee2e6; padding: 8px;">Cash Advance</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">-$100.00</td><td style="border: 1px solid #dee2e6; padding: 8px;">ADV-0156</td></tr>
        </table>
      </div>

      <div style="margin-bottom: 15px; background: #fff3cd; padding: 10px; border: 1px solid #ffeaa7; border-radius: 4px;">
        <h4 style="margin: 0 0 8px 0; font-size: 13px; color: #856404;">⚠️ Reconciliation Notes</h4>
        <p style="margin: 0; font-size: 12px; color: #856404;">
          Large variance detected ($4,189.37 over). Please verify all transactions and deposit records.
          Consider scheduling additional cash pickup if drawer exceeds $3,000.
        </p>
      </div>

      <p style="margin: 15px 0 0 0; font-size: 11px; color: #666; text-align: center;">
        Report generated: ${new Date().toLocaleString()} | Reconciliation by: Manager | Drawer: MAIN-001
      </p>
    </div>
  `,
  'transaction-history': `
    <div style="font-family: Arial, sans-serif; padding: 15px; background: white; color: black; max-width: 100%; box-sizing: border-box;">
      <h2 style="color: #333; border-bottom: 2px solid #6f42c1; padding-bottom: 8px; margin: 0 0 15px 0; font-size: 18px;">Transaction History Report</h2>
      
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
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">17:45:12</td><td style="border: 1px solid #dee2e6; padding: 8px;">Sale</td><td style="border: 1px solid #dee2e6; padding: 8px;">Powerball</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$10.00</td><td style="border: 1px solid #dee2e6; padding: 8px; color: green;">Complete</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">17:42:33</td><td style="border: 1px solid #dee2e6; padding: 8px;">Prize</td><td style="border: 1px solid #dee2e6; padding: 8px;">Scratch #501</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$25.00</td><td style="border: 1px solid #dee2e6; padding: 8px; color: green;">Paid</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">17:38:15</td><td style="border: 1px solid #dee2e6; padding: 8px;">Sale</td><td style="border: 1px solid #dee2e6; padding: 8px;">Scratch #750</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$5.00</td><td style="border: 1px solid #dee2e6; padding: 8px; color: green;">Complete</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">17:35:22</td><td style="border: 1px solid #dee2e6; padding: 8px;">Sale</td><td style="border: 1px solid #dee2e6; padding: 8px;">Mega Millions</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$15.00</td><td style="border: 1px solid #dee2e6; padding: 8px; color: green;">Complete</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">17:32:44</td><td style="border: 1px solid #dee2e6; padding: 8px;">Void</td><td style="border: 1px solid #dee2e6; padding: 8px;">Pick 3</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">-$2.00</td><td style="border: 1px solid #dee2e6; padding: 8px; color: orange;">Voided</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">17:30:18</td><td style="border: 1px solid #dee2e6; padding: 8px;">Sale</td><td style="border: 1px solid #dee2e6; padding: 8px;">Lucky 7s</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$10.00</td><td style="border: 1px solid #dee2e6; padding: 8px; color: green;">Complete</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">17:28:55</td><td style="border: 1px solid #dee2e6; padding: 8px;">Prize</td><td style="border: 1px solid #dee2e6; padding: 8px;">Cash Explosion</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$100.00</td><td style="border: 1px solid #dee2e6; padding: 8px; color: green;">Paid</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">17:25:33</td><td style="border: 1px solid #dee2e6; padding: 8px;">Sale</td><td style="border: 1px solid #dee2e6; padding: 8px;">Keno</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$5.00</td><td style="border: 1px solid #dee2e6; padding: 8px; color: green;">Complete</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">17:22:11</td><td style="border: 1px solid #dee2e6; padding: 8px;">Sale</td><td style="border: 1px solid #dee2e6; padding: 8px;">Powerball</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$20.00</td><td style="border: 1px solid #dee2e6; padding: 8px; color: green;">Complete</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">17:18:47</td><td style="border: 1px solid #dee2e6; padding: 8px;">Refund</td><td style="border: 1px solid #dee2e6; padding: 8px;">Scratch #250</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$1.00</td><td style="border: 1px solid #dee2e6; padding: 8px; color: blue;">Refunded</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">17:15:23</td><td style="border: 1px solid #dee2e6; padding: 8px;">Sale</td><td style="border: 1px solid #dee2e6; padding: 8px;">Mega Millions</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$5.00</td><td style="border: 1px solid #dee2e6; padding: 8px; color: green;">Complete</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">17:12:08</td><td style="border: 1px solid #dee2e6; padding: 8px;">Sale</td><td style="border: 1px solid #dee2e6; padding: 8px;">Pick 4</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$2.00</td><td style="border: 1px solid #dee2e6; padding: 8px; color: green;">Complete</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">17:08:45</td><td style="border: 1px solid #dee2e6; padding: 8px;">Prize</td><td style="border: 1px solid #dee2e6; padding: 8px;">Scratch #1000</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$50.00</td><td style="border: 1px solid #dee2e6; padding: 8px; color: green;">Paid</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">17:05:12</td><td style="border: 1px solid #dee2e6; padding: 8px;">Sale</td><td style="border: 1px solid #dee2e6; padding: 8px;">Scratch #500</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$20.00</td><td style="border: 1px solid #dee2e6; padding: 8px; color: green;">Complete</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">17:02:33</td><td style="border: 1px solid #dee2e6; padding: 8px;">Sale</td><td style="border: 1px solid #dee2e6; padding: 8px;">Lucky 7s</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$10.00</td><td style="border: 1px solid #dee2e6; padding: 8px; color: green;">Complete</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">16:58:19</td><td style="border: 1px solid #dee2e6; padding: 8px;">Sale</td><td style="border: 1px solid #dee2e6; padding: 8px;">Keno</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$2.00</td><td style="border: 1px solid #dee2e6; padding: 8px; color: green;">Complete</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">16:55:44</td><td style="border: 1px solid #dee2e6; padding: 8px;">Sale</td><td style="border: 1px solid #dee2e6; padding: 8px;">Powerball</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$6.00</td><td style="border: 1px solid #dee2e6; padding: 8px; color: green;">Complete</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">16:52:15</td><td style="border: 1px solid #dee2e6; padding: 8px;">Prize</td><td style="border: 1px solid #dee2e6; padding: 8px;">Scratch #200</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$10.00</td><td style="border: 1px solid #dee2e6; padding: 8px; color: green;">Paid</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">16:48:33</td><td style="border: 1px solid #dee2e6; padding: 8px;">Sale</td><td style="border: 1px solid #dee2e6; padding: 8px;">Mega Millions</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$10.00</td><td style="border: 1px solid #dee2e6; padding: 8px; color: green;">Complete</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">16:45:27</td><td style="border: 1px solid #dee2e6; padding: 8px;">Sale</td><td style="border: 1px solid #dee2e6; padding: 8px;">Pick 3</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$3.00</td><td style="border: 1px solid #dee2e6; padding: 8px; color: green;">Complete</td></tr>
        </table>
      </div>

      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 14px; margin: 10px 0; color: #555;">Transaction Summary</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Transaction Type</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Count</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">Total Amount</th>
          </tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Sales</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">15</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$108.00</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Prize Payouts</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">4</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$185.00</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Voids</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">1</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">-$2.00</td></tr>
          <tr><td style="border: 1px solid #dee2e6; padding: 8px;">Refunds</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">1</td><td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$1.00</td></tr>
          <tr style="font-weight: bold; background-color: #f3e5f5;">
            <td style="border: 1px solid #dee2e6; padding: 8px;">NET TOTAL</td>
            <td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">21</td>
            <td style="border: 1px solid #dee2e6; padding: 8px; text-align: right;">$292.00</td>
          </tr>
        </table>
      </div>

      <div style="margin-bottom: 15px;">
        <h3 style="font-size: 14px; margin: 10px 0; color: #555;">Payment Method Breakdown</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
          <div style="flex: 1; min-width: 120px; background: #f8f9fa; padding: 10px; border-radius: 4px; border: 1px solid #dee2e6;">
            <strong style="font-size: 11px; color: #666;">Cash</strong><br>
            <span style="font-size: 14px; font-weight: bold; color: #28a745;">$234.00</span><br>
            <small style="font-size: 10px; color: #666;">18 transactions</small>
          </div>
          <div style="flex: 1; min-width: 120px; background: #f8f9fa; padding: 10px; border-radius: 4px; border: 1px solid #dee2e6;">
            <strong style="font-size: 11px; color: #666;">Credit Card</strong><br>
            <span style="font-size: 14px; font-weight: bold; color: #007bff;">$45.00</span><br>
            <small style="font-size: 10px; color: #666;">2 transactions</small>
          </div>
          <div style="flex: 1; min-width: 120px; background: #f8f9fa; padding: 10px; border-radius: 4px; border: 1px solid #dee2e6;">
            <strong style="font-size: 11px; color: #666;">Debit Card</strong><br>
            <span style="font-size: 14px; font-weight: bold; color: #6f42c1;">$13.00</span><br>
            <small style="font-size: 10px; color: #666;">1 transaction</small>
          </div>
        </div>
      </div>

      <p style="margin: 15px 0 0 0; font-size: 11px; color: #666; text-align: center;">
        Report generated: ${new Date().toLocaleString()} | Date Range: Last 2 hours | Terminal: POS-001
      </p>
    </div>
  `
};

class MockReportService {
  async getReport(params: ReportParams): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

    // Get the appropriate mock content based on slug
    const htmlContent = MOCK_REPORTS[params.slug] || this.getDefaultReport(params);
    
    return htmlContent;
  }

  private getDefaultReport(params: ReportParams): string {
    return `
      <div style="font-family: Arial, sans-serif; padding: 15px; background: white; color: black; max-width: 100%; box-sizing: border-box;">
        <h2 style="color: #333; border-bottom: 2px solid #ffc107; padding-bottom: 8px; margin: 0 0 15px 0; font-size: 18px;">
          ${params.slug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Report
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
            to display real data for the "${params.slug}" report type.
          </p>
        </div>

        <p style="margin: 15px 0 0 0; font-size: 11px; color: #666; text-align: center;">
          Mock report generated: ${new Date().toLocaleString()} | Report Type: ${params.slug}
        </p>
      </div>
    `;
  }
}

export const mockReportService = new MockReportService(); 