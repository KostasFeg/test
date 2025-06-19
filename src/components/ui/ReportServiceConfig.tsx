import React, { useState, useEffect } from "react";
import {
  updateConfig,
  setupReportService,
  getConfig,
  isApiConfigured,
  testConnection,
  ReportServiceConfig,
} from "../../services/reportService";
import Button from "../primitives/Button";

interface ReportServiceConfigProps {
  className?: string;
  onConfigChange?: (config: ReportServiceConfig) => void;
}

const ReportServiceConfig: React.FC<ReportServiceConfigProps> = ({
  className = "",
  onConfigChange,
}) => {
  const [config, setConfig] = useState<ReportServiceConfig>(getConfig());
  const [baseUrl, setBaseUrl] = useState(config.baseUrl || "");
  const [isExpanded, setIsExpanded] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Quick setup presets
  const presets = {
    "Local Development": "http://localhost:3000/api/reports",
    Staging: "https://staging-api.example.com/api/reports",
    Production: "https://api.example.com/api/reports",
  };

  const handleConfigUpdate = (newConfig: Partial<ReportServiceConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    updateConfig(updatedConfig);
    onConfigChange?.(updatedConfig);
  };

  const handleBaseUrlSubmit = () => {
    handleConfigUpdate({ baseUrl });
  };

  const handleQuickSetup = (presetUrl: string) => {
    setBaseUrl(presetUrl);
    setupReportService(presetUrl, {
      showBothRequests: true, // Enable testing mode
      useMockData: false,
    });
    setConfig(getConfig());
  };

  const handleTestConnection = async () => {
    setTestResult(null);
    try {
      const result = await testConnection();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : "Test failed",
      });
    }
  };

  const resetToMockOnly = () => {
    handleConfigUpdate({
      useMockData: true,
      showBothRequests: false,
      baseUrl: undefined,
    });
    setBaseUrl("");
    setTestResult(null);
  };

  return (
    <div className={`report-service-config ${className}`}>
      {/* Quick Status Display */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px",
          backgroundColor: isApiConfigured() ? "#e8f5e8" : "#fff3cd",
          border: "1px solid " + (isApiConfigured() ? "#d4e6d4" : "#f0e68c"),
          borderRadius: "4px",
          marginBottom: "10px",
        }}
      >
        <span style={{ fontWeight: "bold" }}>Report Service Status:</span>
        <span>
          {isApiConfigured()
            ? `🌐 API Mode (${config.baseUrl})`
            : "🎭 Mock Mode Only"}
        </span>
        {config.showBothRequests && (
          <span style={{ color: "#007bff", fontSize: "0.9em" }}>
            🔧 Testing Mode Enabled
          </span>
        )}
        <Button
          variant="secondary"
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ marginLeft: "auto", padding: "5px 10px", fontSize: "0.8em" }}
        >
          {isExpanded ? "Hide Config" : "Configure"}
        </Button>
      </div>

      {/* Expanded Configuration Panel */}
      {isExpanded && (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "20px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h3 style={{ marginTop: 0 }}>📊 Report Service Configuration</h3>

          {/* Quick Setup Section */}
          <div style={{ marginBottom: "20px" }}>
            <h4>Quick Setup (Presets)</h4>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {Object.entries(presets).map(([name, url]) => (
                <Button
                  key={name}
                  variant="secondary"
                  onClick={() => handleQuickSetup(url)}
                  style={{ fontSize: "0.9em" }}
                >
                  {name}
                </Button>
              ))}
              <Button
                variant="ghost"
                onClick={resetToMockOnly}
                style={{ fontSize: "0.9em", color: "#6c757d" }}
              >
                🎭 Mock Only
              </Button>
            </div>
          </div>

          {/* Manual Configuration */}
          <div style={{ marginBottom: "20px" }}>
            <h4>Manual Configuration</h4>
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "flex-end",
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, minWidth: "300px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Base URL:
                </label>
                <input
                  type="text"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="https://your-api.com/api/reports"
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                />
              </div>
              <Button onClick={handleBaseUrlSubmit}>Apply URL</Button>
            </div>
          </div>

          {/* Testing Options */}
          <div style={{ marginBottom: "20px" }}>
            <h4>Testing Options</h4>
            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
              <label
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <input
                  type="checkbox"
                  checked={config.useMockData ?? true}
                  onChange={(e) =>
                    handleConfigUpdate({ useMockData: e.target.checked })
                  }
                />
                Use Mock Data
              </label>
              <label
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <input
                  type="checkbox"
                  checked={config.showBothRequests ?? false}
                  onChange={(e) =>
                    handleConfigUpdate({ showBothRequests: e.target.checked })
                  }
                />
                Show Both Requests (Testing)
              </label>
            </div>
            <p style={{ fontSize: "0.9em", color: "#666", marginTop: "10px" }}>
              💡 "Show Both Requests" makes both mock and real API calls so you
              can see both in the Network tab
            </p>
          </div>

          {/* Connection Test */}
          {isApiConfigured() && (
            <div style={{ marginBottom: "20px" }}>
              <h4>Connection Test</h4>
              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <Button variant="secondary" onClick={handleTestConnection}>
                  Test Connection
                </Button>
                {testResult && (
                  <span
                    style={{
                      color: testResult.success ? "green" : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {testResult.success ? "✅" : "❌"} {testResult.message}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Current Configuration Display */}
          <details style={{ marginTop: "20px" }}>
            <summary style={{ fontWeight: "bold", cursor: "pointer" }}>
              Current Configuration
            </summary>
            <pre
              style={{
                backgroundColor: "#fff",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "0.9em",
                overflow: "auto",
              }}
            >
              {JSON.stringify(config, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default ReportServiceConfig;
