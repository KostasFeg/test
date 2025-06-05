import React from "react";

export const peripherals = [
  {
    label: "Printer",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="6" y="9" width="12" height="7" rx="2" />
        <path d="M6 18h12v2a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-2z" />
        <path d="M6 14v-2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
      </svg>
    ),
  },
  {
    label: "Scanner",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="13" width="18" height="6" rx="2" />
        <path d="M8 13V7a4 4 0 0 1 8 0v6" />
      </svg>
    ),
  },
  {
    label: "Cash Drawer",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01" />
      </svg>
    ),
  },
  {
    label: "Card Reader",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="7" width="20" height="10" rx="2" />
        <path d="M2 10h20" />
        <path d="M6 14h.01M10 14h.01" />
      </svg>
    ),
  },
  {
    label: "Barcode",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M6 8v8M10 8v8M14 8v8M18 8v8" />
      </svg>
    ),
  },
  {
    label: "Display",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="4" width="20" height="14" rx="2" />
        <path d="M8 20h8" />
      </svg>
    ),
  },
  {
    label: "UPS",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M8 16v-4a4 4 0 0 1 8 0v4" />
      </svg>
    ),
  },
  {
    label: "Router",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="8" width="20" height="8" rx="2" />
        <path d="M6 16v2M18 16v2" />
      </svg>
    ),
  },
  {
    label: "Camera",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    label: "Keyboard",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="7" width="20" height="10" rx="2" />
        <path d="M6 11h.01M10 11h.01M14 11h.01M18 11h.01" />
      </svg>
    ),
  },
];

export function TestToggles({
  sidebarVariant,
  setSidebarVariant,
  showBottomBar,
  setShowBottomBar,
}: {
  sidebarVariant: "labels" | "buttons";
  setSidebarVariant: (v: "labels" | "buttons") => void;
  showBottomBar: boolean;
  setShowBottomBar: (v: boolean) => void;
}) {
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
}
