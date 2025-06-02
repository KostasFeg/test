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
import GenericReport from "../components/ui/GenericReport";
import BursterActionPanel, {
  BursterAction,
} from "../components/bursters/BursterActionPanel";
import LoginPage from "./LoginPage";
import Panel from "../components/modal/Modal";
import ReportRendered from "../components/ui/ReportRendered";

const sidebarItems = [
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
    onClick: () => {},
  },
  {
    label: "Generic Report",
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
    onClick: () => {},
  },
  {
    label: "Burster Selection",
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
        <circle cx="12" cy="12" r="6" />
      </svg>
    ),
    onClick: () => {},
  },
  {
    label: "Report Rendered",
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
        <path d="M8 8h8v8H8z" />
      </svg>
    ),
    onClick: () => {},
  },
  { label: "Financial\nReports", onClick: () => {} },
  { label: "Lottery\nSales Rep", onClick: () => {} },
  { label: "DreamTouch\nOperations", onClick: () => {} },
  { label: "System\nReports", onClick: () => {} },
  { label: "Diagnostics", onClick: () => {} },
  { label: "Terminal", onClick: () => {} },
  { label: "Support", onClick: () => {} },
  { label: "Settings", onClick: () => {} },
  { label: "Logout", onClick: () => {} },
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

function MainAreaContent({
  sidebarVariant,
  setSidebarVariant,
  showBottomBar,
  setShowBottomBar,
  setPatchedSidebarItems,
}: any) {
  const navigate = useNavigate();
  const location = useLocation();
  React.useEffect(() => {
    const patched = sidebarItems.map((item) => {
      let active = false;
      if (item.label === "Dashboard" && location.pathname === "/")
        active = true;
      if (
        item.label === "Generic Report" &&
        location.pathname === "/generic-report"
      )
        active = true;
      if (
        item.label === "Burster Selection" &&
        location.pathname === "/burster-selection"
      )
        active = true;
      return {
        ...item,
        onClick:
          item.label === "Dashboard"
            ? () => navigate("/")
            : item.label === "Generic Report"
            ? () => navigate("/generic-report")
            : item.label === "Burster Selection"
            ? () => navigate("/burster-selection")
            : item.label === "Report Rendered"
            ? () => navigate("/report-rendered")
            : item.onClick || (() => {}),
        active,
      };
    });
    setPatchedSidebarItems(patched);
  }, [setPatchedSidebarItems, navigate, location]);
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxSizing: "border-box",
              padding: 0,
              margin: 0,
              height: "100%",
              justifyContent: "flex-start",
            }}
          >
            <div style={{ height: 24 }} />
            {/* main area buttons */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                boxSizing: "border-box",
              }}
            >
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
            </div>
          </div>
        }
      />
      <Route path="/generic-report" element={<GenericReport />} />
      <Route
        path="/burster-selection"
        element={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <Panel title="Burster Selection" onClose={() => {}}>
              {(() => {
                // Mock implementations for actions
                const loadFullPack = (ctx: any) => {
                  alert(
                    "Load Full Pack: " +
                      ctx.selected.map((b: any) => b.id).join(", ")
                  );
                };
                const unloadPack = (ctx: any) => {
                  alert(
                    "Unload Pack: " +
                      ctx.selected.map((b: any) => b.id).join(", ")
                  );
                };
                const actions: BursterAction[] = [
                  {
                    id: "load-full",
                    label: "Load Full Pack",
                    variant: "primary",
                    disabled: (c) => c.selected.length !== 1,
                    onExecute: loadFullPack,
                  },
                  {
                    id: "multi-pack",
                    label: "Multi Pack Load",
                    disabled: (c) => c.selected.length === 0,
                    onExecute: (c) => console.log("multi", c.selected),
                  },
                  {
                    id: "unload",
                    label: "Unload Pack",
                    variant: "danger",
                    onExecute: unloadPack,
                  },
                  {
                    id: "park",
                    label: "Park Blade",
                    onExecute: () => console.log("parking…"),
                  },
                ];
                return <BursterActionPanel actions={actions} />;
              })()}
            </Panel>
          </div>
        }
      />
      <Route path="/report-rendered" element={<ReportRendered />} />
    </Routes>
  );
}

export const MaintenancePage: React.FC = () => {
  const [sidebarVariant, setSidebarVariant] = useState<"labels" | "buttons">(
    "buttons"
  );
  const [showBottomBar, setShowBottomBar] = useState(true);
  const [patchedSidebarItems, setPatchedSidebarItems] = useState(sidebarItems);
  return (
    <Router>
      <Layout
        sidebarVariant={sidebarVariant}
        sidebarItems={patchedSidebarItems}
        topCenter={
          <TestToggles
            sidebarVariant={sidebarVariant}
            setSidebarVariant={setSidebarVariant}
            showBottomBar={showBottomBar}
            setShowBottomBar={setShowBottomBar}
          />
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
          setPatchedSidebarItems={setPatchedSidebarItems}
        />
      </Layout>
    </Router>
  );
};

export default MaintenancePage;
