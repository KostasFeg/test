import React from "react";
import ReportServiceConfig from "./ReportServiceConfig";
import GenericReport from "./GenericReport";
import { setupReportService } from "../../services/reportService";

/**
 * Example component demonstrating the streamlined report service usage
 *
 * This shows how to:
 * 1. Configure the service with a baseURL
 * 2. Enable testing mode to see both mock and real requests
 * 3. Use the GenericReport component with the enhanced service
 */
const ReportServiceExample: React.FC = () => {
  // Example of programmatic setup (optional)
  const handleQuickSetup = () => {
    // Quick setup with your backend URL
    setupReportService("https://your-backend.com/api/reports", {
      showBothRequests: true, // Show both mock and real requests for testing
      useMockData: false, // Use real API data
    });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>📊 Enhanced Report Service Demo</h1>

      <div style={{ marginBottom: "30px" }}>
        <h2>🔧 Configuration</h2>
        <p>
          Use the configuration panel below to set up your backend URL. The
          service will automatically handle both mock and real API calls.
        </p>

        {/* Configuration Component */}
        <ReportServiceConfig />

        {/* Example of programmatic setup */}
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
          }}
        >
          <h4>💻 Programmatic Setup Example</h4>
          <p>You can also set up the service programmatically:</p>
          <pre
            style={{
              backgroundColor: "#fff",
              padding: "10px",
              borderRadius: "4px",
              fontSize: "0.9em",
            }}
          >
            {`import { setupReportService } from './services/reportService';

// Quick setup for your backend
setupReportService('https://your-backend.com/api/reports', {
  showBothRequests: true, // See both mock and real requests
  useMockData: false,     // Use real API data
});`}
          </pre>
          <button
            onClick={handleQuickSetup}
            style={{
              padding: "8px 16px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Run Example Setup
          </button>
        </div>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h2>📈 Test Reports</h2>
        <p>
          Try generating different reports below. Open your browser's Network
          tab to see the API requests being made.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gap: "20px",
          }}
        >
          {/* Sales Report Example */}
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "15px",
            }}
          >
            <h3>Sales Report</h3>
            <GenericReport reportSlug="sales" />
          </div>

          {/* Commission Report Example */}
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "15px",
            }}
          >
            <h3>Commission Report</h3>
            <GenericReport reportSlug="commissions" />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h2>🚀 How It Works</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          <div
            style={{
              padding: "20px",
              backgroundColor: "#e8f5e8",
              borderRadius: "8px",
            }}
          >
            <h4>🎭 Mock Mode</h4>
            <ul>
              <li>Returns realistic mock data</li>
              <li>Works offline</li>
              <li>Perfect for development</li>
              <li>No backend required</li>
            </ul>
          </div>

          <div
            style={{
              padding: "20px",
              backgroundColor: "#e8f4fd",
              borderRadius: "8px",
            }}
          >
            <h4>🌐 API Mode</h4>
            <ul>
              <li>Calls your real backend</li>
              <li>Automatic URL building</li>
              <li>Filter parameters included</li>
              <li>Fallback to mock on error</li>
            </ul>
          </div>

          <div
            style={{
              padding: "20px",
              backgroundColor: "#fff3cd",
              borderRadius: "8px",
            }}
          >
            <h4>🔧 Testing Mode</h4>
            <ul>
              <li>Makes both requests</li>
              <li>See both in Network tab</li>
              <li>Returns mock data</li>
              <li>Perfect for debugging</li>
            </ul>
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
        }}
      >
        <h2>📝 Implementation Guide</h2>
        <ol>
          <li>
            <strong>Install:</strong> <code>npm install axios</code> (already
            done)
          </li>
          <li>
            <strong>Configure:</strong> Use the config panel above or{" "}
            <code>setupReportService(baseUrl)</code>
          </li>
          <li>
            <strong>Use:</strong>{" "}
            <code>&lt;GenericReport reportSlug="your-report" /&gt;</code>
          </li>
          <li>
            <strong>Test:</strong> Enable "Show Both Requests" to see API calls
            in Network tab
          </li>
        </ol>

        <h3>🔗 URL Structure</h3>
        <p>The service automatically builds URLs like:</p>
        <code
          style={{
            backgroundColor: "#fff",
            padding: "5px",
            borderRadius: "3px",
          }}
        >
          {"{baseUrl}"}/{"{applicationSlug}"}/{"{reportSlug}"}
          ?type=Day&scope=Retailer&fromDate=1234567890
        </code>
      </div>
    </div>
  );
};

export default ReportServiceExample;
