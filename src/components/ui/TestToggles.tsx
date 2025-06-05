import React from "react";
import { useUI } from "../../app/providers/UIProvider";

const TestToggles: React.FC = () => {
  const { sidebarVariant, setSidebarVariant, showBottomBar, setShowBottomBar } =
    useUI();

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
