import React, { useState } from "react";
import FullScreenImageModal from "./FullScreenImageModal";

/**
 * Example component demonstrating how to use FullScreenImageModal
 *
 * This component shows different usage scenarios:
 * 1. Basic HTML content rendering
 * 2. Custom print handlers
 * 3. Disabled print functionality
 * 4. Custom button text
 */
const FullScreenImageModalExample: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentExample, setCurrentExample] = useState<
    "basic" | "custom-print" | "no-print"
  >("basic");

  // Sample HTML content for the ImageScroller
  const sampleReportContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: white; color: black; min-height: 800px;">
      <h1 style="color: #333; border-bottom: 3px solid #4a90e2; padding-bottom: 10px; margin-bottom: 20px;">
        Sales Report - Monthly Summary
      </h1>
      
      <div style="margin-bottom: 30px;">
        <h2 style="color: #555; font-size: 18px;">Executive Summary</h2>
        <p style="line-height: 1.6; margin-bottom: 15px;">
          This comprehensive sales report provides detailed insights into our monthly performance, 
          highlighting key metrics, trends, and opportunities for growth.
        </p>
      </div>

      <div style="margin-bottom: 30px;">
        <h3 style="color: #555; font-size: 16px;">Sales by Category</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Category</th>
              <th style="border: 1px solid #dee2e6; padding: 12px; text-align: right;">Revenue</th>
              <th style="border: 1px solid #dee2e6; padding: 12px; text-align: right;">Units Sold</th>
              <th style="border: 1px solid #dee2e6; padding: 12px; text-align: right;">Growth %</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #dee2e6; padding: 12px;">Electronics</td>
              <td style="border: 1px solid #dee2e6; padding: 12px; text-align: right;">$245,680</td>
              <td style="border: 1px solid #dee2e6; padding: 12px; text-align: right;">1,234</td>
              <td style="border: 1px solid #dee2e6; padding: 12px; text-align: right; color: green;">+12.5%</td>
            </tr>
            <tr>
              <td style="border: 1px solid #dee2e6; padding: 12px;">Clothing</td>
              <td style="border: 1px solid #dee2e6; padding: 12px; text-align: right;">$189,450</td>
              <td style="border: 1px solid #dee2e6; padding: 12px; text-align: right;">2,567</td>
              <td style="border: 1px solid #dee2e6; padding: 12px; text-align: right; color: green;">+8.3%</td>
            </tr>
            <tr>
              <td style="border: 1px solid #dee2e6; padding: 12px;">Home & Garden</td>
              <td style="border: 1px solid #dee2e6; padding: 12px; text-align: right;">$156,790</td>
              <td style="border: 1px solid #dee2e6; padding: 12px; text-align: right;">890</td>
              <td style="border: 1px solid #dee2e6; padding: 12px; text-align: right; color: red;">-2.1%</td>
            </tr>
            <tr>
              <td style="border: 1px solid #dee2e6; padding: 12px;">Sports</td>
              <td style="border: 1px solid #dee2e6; padding: 12px; text-align: right;">$134,280</td>
              <td style="border: 1px solid #dee2e6; padding: 12px; text-align: right;">1,456</td>
              <td style="border: 1px solid #dee2e6; padding: 12px; text-align: right; color: green;">+15.7%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="margin-bottom: 30px;">
        <h3 style="color: #555; font-size: 16px;">Regional Performance</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 20px;">
          <div style="flex: 1; min-width: 200px; padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
            <h4 style="margin: 0 0 10px 0; color: #333;">North Region</h4>
            <p style="margin: 5px 0; font-size: 14px;"><strong>Revenue:</strong> $312,450</p>
            <p style="margin: 5px 0; font-size: 14px;"><strong>Growth:</strong> <span style="color: green;">+18.2%</span></p>
          </div>
          <div style="flex: 1; min-width: 200px; padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
            <h4 style="margin: 0 0 10px 0; color: #333;">South Region</h4>
            <p style="margin: 5px 0; font-size: 14px;"><strong>Revenue:</strong> $278,190</p>
            <p style="margin: 5px 0; font-size: 14px;"><strong>Growth:</strong> <span style="color: green;">+9.5%</span></p>
          </div>
          <div style="flex: 1; min-width: 200px; padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
            <h4 style="margin: 0 0 10px 0; color: #333;">East Region</h4>
            <p style="margin: 5px 0; font-size: 14px;"><strong>Revenue:</strong> $195,560</p>
            <p style="margin: 5px 0; font-size: 14px;"><strong>Growth:</strong> <span style="color: red;">-3.1%</span></p>
          </div>
        </div>
      </div>

      <div style="margin-bottom: 30px;">
        <h3 style="color: #555; font-size: 16px;">Monthly Trends</h3>
        <p style="line-height: 1.6; margin-bottom: 15px;">
          Overall sales performance has shown consistent growth throughout the quarter, 
          with particularly strong performance in the Electronics and Sports categories.
        </p>
        <ul style="line-height: 1.8; padding-left: 20px;">
          <li>Electronics category experienced highest growth at 12.5%</li>
          <li>Sports category showing exceptional performance with 15.7% growth</li>
          <li>Home & Garden category needs attention with -2.1% decline</li>
          <li>North region leading with 18.2% growth</li>
        </ul>
      </div>

      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 40px;">
        <h3 style="color: #333; margin-top: 0;">Recommendations</h3>
        <ol style="line-height: 1.8; padding-left: 20px;">
          <li>Increase inventory for Electronics and Sports categories</li>
          <li>Investigate declining performance in Home & Garden</li>
          <li>Replicate North region strategies in other regions</li>
          <li>Focus marketing efforts on high-growth categories</li>
        </ol>
      </div>

      <footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center;">
        Report generated on ${new Date().toLocaleDateString()} | Confidential Business Information
      </footer>
    </div>
  `;

  const handleBasicPrint = () => {
    console.log("Basic print functionality - using browser print");
    // Default browser print will be called automatically
  };

  const handleCustomPrint = () => {
    console.log("Custom print handler called");
    alert(
      "Custom print logic executed! This could send data to a specific printer, generate PDF, etc."
    );
  };

  const openModal = (example: "basic" | "custom-print" | "no-print") => {
    setCurrentExample(example);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>FullScreenImageModal Examples</h1>
      <p>
        This demonstrates the reusable FullScreenImageModal component with
        different configurations:
      </p>

      <div
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          margin: "20px 0",
        }}
      >
        <button
          onClick={() => openModal("basic")}
          style={{
            padding: "12px 20px",
            backgroundColor: "#4a90e2",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Basic Example
        </button>

        <button
          onClick={() => openModal("custom-print")}
          style={{
            padding: "12px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Custom Print Handler
        </button>

        <button
          onClick={() => openModal("no-print")}
          style={{
            padding: "12px 20px",
            backgroundColor: "#ffc107",
            color: "black",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Print Disabled
        </button>
      </div>

      <div
        style={{
          backgroundColor: "#f8f9fa",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h3>Usage Examples:</h3>

        <div style={{ marginBottom: "15px" }}>
          <h4>1. Basic Usage:</h4>
          <pre
            style={{
              backgroundColor: "#fff",
              padding: "10px",
              borderRadius: "4px",
              overflow: "auto",
            }}
          >
            {`<FullScreenImageModal
  open={isOpen}
  onClose={() => setIsOpen(false)}
>
  <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
</FullScreenImageModal>`}
          </pre>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <h4>2. With Custom Print Handler:</h4>
          <pre
            style={{
              backgroundColor: "#fff",
              padding: "10px",
              borderRadius: "4px",
              overflow: "auto",
            }}
          >
            {`<FullScreenImageModal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  onPrint={handleCustomPrint}
  printButtonText="Download PDF"
>
  {content}
</FullScreenImageModal>`}
          </pre>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <h4>3. Print Disabled:</h4>
          <pre
            style={{
              backgroundColor: "#fff",
              padding: "10px",
              borderRadius: "4px",
              overflow: "auto",
            }}
          >
            {`<FullScreenImageModal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  printDisabled={true}
  closeButtonText="Done"
>
  {content}
</FullScreenImageModal>`}
          </pre>
        </div>
      </div>

      {/* The actual modal */}
      <FullScreenImageModal
        open={isModalOpen}
        onClose={closeModal}
        onPrint={
          currentExample === "custom-print"
            ? handleCustomPrint
            : currentExample === "basic"
            ? handleBasicPrint
            : undefined
        }
        printDisabled={currentExample === "no-print"}
        printButtonText={
          currentExample === "custom-print" ? "Download PDF" : "Print"
        }
        closeButtonText={currentExample === "no-print" ? "Done" : "Close"}
      >
        <div dangerouslySetInnerHTML={{ __html: sampleReportContent }} />
      </FullScreenImageModal>
    </div>
  );
};

export default FullScreenImageModalExample;
