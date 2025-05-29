import React, { useState } from "react";
import { Layout } from "../components/layout/Layout";
import { MenuButton } from "../components/ui/MenuButton";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";

const sidebarButtons = [
  {
    label: "Dashboard",
    icon: (
      <svg
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <rect x="3" y="3" width="7" height="9" />
        <rect x="14" y="3" width="7" height="5" />
        <rect x="14" y="12" width="7" height="9" />
        <rect x="3" y="16" width="7" height="5" />
      </svg>
    ),
  },
  {
    label: "Sales",
    icon: (
      <svg
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <path d="M3 17v-6a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v6" />
        <rect x="7" y="13" width="10" height="8" rx="2" />
      </svg>
    ),
  },
  {
    label: "Inventory",
    icon: (
      <svg
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M16 3v4M8 3v4" />
      </svg>
    ),
  },
  {
    label: "Reports",
    icon: (
      <svg
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 9h6v6H9z" />
      </svg>
    ),
  },
  {
    label: "Settings",
    icon: (
      <svg
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 8.6 15a1.65 1.65 0 0 0-1.82-.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 5 8.6a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 15.4 9a1.65 1.65 0 0 0 1.82.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19 15.4z" />
      </svg>
    ),
  },
  {
    label: "Users",
    icon: (
      <svg
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="7" r="4" />
        <path d="M5.5 21a7.5 7.5 0 0 1 13 0" />
      </svg>
    ),
  },
  {
    label: "Notifications",
    icon: (
      <svg
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
  {
    label: "Help",
    icon: (
      <svg
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 1 1 5.82 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
      </svg>
    ),
  },
  {
    label: "Support",
    icon: (
      <svg
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    ),
  },
  {
    label: "Logout",
    icon: (
      <svg
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    ),
  },
];

const sidebarLabels = [
  { label: "Maintenance\nOperations", active: true },
  { label: "Financial\nReports" },
  { label: "Lottery\nSales Rep" },
  { label: "DreamTouch\nOperations" },
  { label: "System\nReports" },
  { label: "Diagnostics" },
  { label: "Terminal" },
  { label: "Support" },
  { label: "Settings" },
  { label: "Logout" },
];

const peripherals = [
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

function TestToggles({
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
    <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
      <button
        onClick={() =>
          setSidebarVariant(sidebarVariant === "labels" ? "buttons" : "labels")
        }
      >
        Toggle Sidebar Variant
      </button>
      <button onClick={() => setShowBottomBar(!showBottomBar)}>
        {showBottomBar ? "Hide" : "Show"} Bottom Bar
      </button>
    </div>
  );
}

function ReportDemoButton({ type }: { type: "dropdown" | "date" }) {
  const navigate = useNavigate();
  return (
    <button
      style={{ marginRight: 16 }}
      onClick={() => navigate(`/report/${type}`)}
    >
      Open Report Demo ({type})
    </button>
  );
}

function ReportPage() {
  const { type } = useParams<{ type: "dropdown" | "date" }>();
  const navigate = useNavigate();
  const [dropdownValue, setDropdownValue] = useState("Option 1");
  const [date1, setDate1] = useState<Date | null>(new Date());
  const [date2, setDate2] = useState<Date | null>(new Date());
  return (
    <div
      style={{
        width: "100%",
        padding: "32px 24px",
        boxSizing: "border-box",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          marginBottom: 24,
        }}
      >
        <h2 style={{ flex: 1, textAlign: "center", margin: 0 }}>
          Mock Report Name
        </h2>
        <button
          onClick={() => navigate(-1)}
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            fontSize: 20,
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          &times;
        </button>
      </div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        <div style={{ flex: 1 }}>
          {type === "dropdown" ? (
            <select
              value={dropdownValue}
              onChange={(e) => setDropdownValue(e.target.value)}
            >
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <DatePicker selected={date1} onChange={setDate1} />
              <DatePicker selected={date2} onChange={setDate2} />
            </div>
          )}
        </div>
        <button
          style={{
            marginLeft: "auto",
            background: "#1d4ed8",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "8px 16px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Print
        </button>
      </div>
      <div
        style={{
          flex: 1,
          overflow: "auto",
          background: "#f5f5f5",
          borderRadius: 4,
          padding: 16,
        }}
      >
        <pre style={{ margin: 0, fontFamily: "monospace", fontSize: 14 }}>
          {`[b]RECEIPT[/b]
----------------------
Date: 2024-06-01
Time: 12:34:56

[b]Items[/b]
- Widget A x2  $10.00
- Widget B x1  $5.00

[b]Total:[/b] $25.00
----------------------
Thank you!`}
        </pre>
      </div>
    </div>
  );
}

function MainAreaContent({
  sidebarVariant,
  setSidebarVariant,
  showBottomBar,
  setShowBottomBar,
}: any) {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 24,
              }}
            >
              <TestToggles
                sidebarVariant={sidebarVariant}
                setSidebarVariant={setSidebarVariant}
                showBottomBar={showBottomBar}
                setShowBottomBar={setShowBottomBar}
              />
              <ReportDemoButton type="dropdown" />
              <ReportDemoButton type="date" />
            </div>
            {/* main area buttons */}
            {[
              "Load Full Pack",
              "Load Full Pack (Smart Load)",
              "Load Partial Pack",
              "Load Combined Pack",
              "Multi Pack Load",
              "Unload Pack",
              "Close Shift",
              "Important Telephone Numbers",
              "Clear Customer Credits",
              "Pack Operations",
            ].map((label) => (
              <MenuButton key={label}>{label}</MenuButton>
            ))}
          </>
        }
      />
      <Route path="/report/:type" element={<ReportPage />} />
    </Routes>
  );
}

export const MaintenancePage: React.FC = () => {
  const [sidebarVariant, setSidebarVariant] = useState<"labels" | "buttons">(
    "buttons"
  );
  const [showBottomBar, setShowBottomBar] = useState(true);
  return (
    <Router>
      <Layout
        sidebarVariant={sidebarVariant}
        sidebarItems={
          sidebarVariant === "labels" ? sidebarLabels : sidebarButtons
        }
        topLeft={<span>Login ID: Admin</span>}
        topRight={<span>Serial Number: 10906006</span>}
        bottomItems={showBottomBar ? peripherals : undefined}
      >
        <MainAreaContent
          sidebarVariant={sidebarVariant}
          setSidebarVariant={setSidebarVariant}
          showBottomBar={showBottomBar}
          setShowBottomBar={setShowBottomBar}
        />
      </Layout>
    </Router>
  );
};
