import React, { useState } from "react";
import FullScreenImageModal from "./FullScreenImageModal";

/**
 * Example showing how to replace the existing ReportRendered pattern
 * with the new FullScreenImageModal component.
 *
 * This is the recommended pattern for report pages.
 */
const ReportWithModal: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample report data - in real usage, this would come from your API
  const reportHtml = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: white; color: black; line-height: 1.6;">
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #4a90e2; padding-bottom: 15px;">
        <h1 style="margin: 0; color: #333; font-size: 24px;">Cash Reconciliation Report</h1>
        <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Generated: ${new Date().toLocaleDateString()}</p>
      </div>

      <div style="margin-bottom: 25px;">
        <h2 style="color: #555; font-size: 18px; margin-bottom: 15px;">Cash Summary</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #dee2e6; padding: 10px; text-align: left;">Description</th>
            <th style="border: 1px solid #dee2e6; padding: 10px; text-align: right;">Amount</th>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 10px;">Opening Balance</td>
            <td style="border: 1px solid #dee2e6; padding: 10px; text-align: right;">$1,250.00</td>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 10px;">Total Sales</td>
            <td style="border: 1px solid #dee2e6; padding: 10px; text-align: right;">$3,845.75</td>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 10px;">Total Payouts</td>
            <td style="border: 1px solid #dee2e6; padding: 10px; text-align: right;">-$2,156.25</td>
          </tr>
          <tr style="background-color: #e3f2fd; font-weight: bold;">
            <td style="border: 1px solid #dee2e6; padding: 10px;">Expected Balance</td>
            <td style="border: 1px solid #dee2e6; padding: 10px; text-align: right;">$2,939.50</td>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 10px;">Actual Count</td>
            <td style="border: 1px solid #dee2e6; padding: 10px; text-align: right;">$2,939.50</td>
          </tr>
          <tr style="background-color: #d4edda; font-weight: bold;">
            <td style="border: 1px solid #dee2e6; padding: 10px;">Variance</td>
            <td style="border: 1px solid #dee2e6; padding: 10px; text-align: right; color: green;">$0.00</td>
          </tr>
        </table>
      </div>

      <div style="margin-bottom: 25px;">
        <h3 style="color: #555; font-size: 16px; margin-bottom: 15px;">Denomination Breakdown</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 15px;">
          <div style="flex: 1; min-width: 200px;">
            <h4 style="margin: 0 0 10px 0; color: #333; font-size: 14px;">Bills</h4>
            <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
              <tr><td style="border: 1px solid #ddd; padding: 5px;">$100 x 12</td><td style="border: 1px solid #ddd; padding: 5px; text-align: right;">$1,200.00</td></tr>
              <tr><td style="border: 1px solid #ddd; padding: 5px;">$50 x 8</td><td style="border: 1px solid #ddd; padding: 5px; text-align: right;">$400.00</td></tr>
              <tr><td style="border: 1px solid #ddd; padding: 5px;">$20 x 35</td><td style="border: 1px solid #ddd; padding: 5px; text-align: right;">$700.00</td></tr>
              <tr><td style="border: 1px solid #ddd; padding: 5px;">$10 x 42</td><td style="border: 1px solid #ddd; padding: 5px; text-align: right;">$420.00</td></tr>
              <tr><td style="border: 1px solid #ddd; padding: 5px;">$5 x 15</td><td style="border: 1px solid #ddd; padding: 5px; text-align: right;">$75.00</td></tr>
              <tr><td style="border: 1px solid #ddd; padding: 5px;">$1 x 28</td><td style="border: 1px solid #ddd; padding: 5px; text-align: right;">$28.00</td></tr>
            </table>
          </div>
          <div style="flex: 1; min-width: 200px;">
            <h4 style="margin: 0 0 10px 0; color: #333; font-size: 14px;">Coins</h4>
            <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
              <tr><td style="border: 1px solid #ddd; padding: 5px;">Quarters x 150</td><td style="border: 1px solid #ddd; padding: 5px; text-align: right;">$37.50</td></tr>
              <tr><td style="border: 1px solid #ddd; padding: 5px;">Dimes x 89</td><td style="border: 1px solid #ddd; padding: 5px; text-align: right;">$8.90</td></tr>
              <tr><td style="border: 1px solid #ddd; padding: 5px;">Nickels x 156</td><td style="border: 1px solid #ddd; padding: 5px; text-align: right;">$7.80</td></tr>
              <tr><td style="border: 1px solid #ddd; padding: 5px;">Pennies x 320</td><td style="border: 1px solid #ddd; padding: 5px; text-align: right;">$3.20</td></tr>
            </table>
          </div>
        </div>
      </div>

      <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin-top: 30px;">
        <h4 style="margin: 0 0 10px 0; color: #333;">Reconciliation Notes</h4>
        <p style="margin: 0; font-size: 14px; line-height: 1.5;">
          Cash count completed at 6:00 PM. All amounts balanced correctly with no discrepancies.
          Drawer was secured and locked following standard procedures.
        </p>
      </div>

      <div style="margin-top: 30px; text-align: center; padding-top: 20px; border-top: 1px solid #ddd;">
        <p style="margin: 0; font-size: 12px; color: #666;">
          Report ID: CR-2024-001 | Generated by: System Admin | Print Date: ${new Date().toLocaleString()}
        </p>
      </div>
    </div>
  `;

  const handlePrint = () => {
    // Custom print logic - could send to specific printer, generate PDF, etc.
    console.log("Printing Cash Reconciliation Report...");

    // For demonstration, we'll show an alert
    alert(
      "Report sent to printer!\n\nIn a real application, this could:\n• Send to a specific printer\n• Generate a PDF\n• Email the report\n• Save to file system"
    );
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Cash Reconciliation Report</h2>
      <p>
        Click the button below to view the full report in a modal with print
        capabilities.
      </p>

      <button
        onClick={() => setIsModalOpen(true)}
        style={{
          padding: "15px 30px",
          fontSize: "16px",
          fontWeight: "600",
          backgroundColor: "#4a90e2",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        View Report
      </button>

      <FullScreenImageModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPrint={handlePrint}
        printButtonText="Print Report"
        closeButtonText="Close"
      >
        <div dangerouslySetInnerHTML={{ __html: reportHtml }} />
      </FullScreenImageModal>
    </div>
  );
};

export default ReportWithModal;
