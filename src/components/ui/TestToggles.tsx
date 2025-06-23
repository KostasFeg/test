import React from "react";
import { useUI } from "../../app/providers/UIProvider";
import { FEATURE_FLAGS } from "../../shared/config/app.config";

const TestToggles: React.FC = () => {
  const { sidebarVariant, setSidebarVariant, showBottomBar, setShowBottomBar } =
    useUI();

  // Don't render in production
  if (!FEATURE_FLAGS.ENABLE_TEST_TOGGLES) {
    return null;
  }

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <button
        style={{
          fontSize: 12,
          padding: "2px 8px",
          borderRadius: 4,
          border: "1px solid #ccc",
          background: "#f3f4f6",
          cursor: "pointer",
        }}
        onClick={() =>
          setSidebarVariant(sidebarVariant === "labels" ? "buttons" : "labels")
        }
      >
        Toggle Sidebar
      </button>
      <button
        style={{
          fontSize: 12,
          padding: "2px 8px",
          borderRadius: 4,
          border: "1px solid #ccc",
          background: "#f3f4f6",
          cursor: "pointer",
        }}
        onClick={() => setShowBottomBar(!showBottomBar)}
      >
        {showBottomBar ? "Hide" : "Show"} Bottom Bar
      </button>
    </div>
  );
};

export default TestToggles;
