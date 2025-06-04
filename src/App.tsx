import React, { useState, Suspense, JSX, lazy } from "react";
import LoginPage from "./pages/LoginPage";
import { BrowserRouter, Routes } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import MaintenancePage from "./pages/MaintenancePage";
import { buildRoutes } from "./RouteBuilder";
import { Printer, X } from "lucide-react";
import GenericReport from "./components/ui/GenericReport";

const ReportRenderedLazy = React.lazy(
  () => import("./components/ui/ReportRendered")
);

const GenericReportLazy = React.lazy(
  () => import("./components/ui/GenericReport")
);

export type NavNode = {
  /** URL segment, *not* the full path */
  slug: string;
  /** Human-readable label for side- or top-bars */
  label: string;
  /** Icon component for the sidebar variant that shows icons */
  icon?: React.ReactNode;
  /** React node that lives in the MAIN area */
  element?: React.ReactNode;
  /** Children = render an “inner menu” AND create nested routes */
  children?: NavNode[];
  /** Display style for children: 'tabs' (default) or 'buttons' */
  display?: "tabs" | "buttons";
};

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

export const nav: NavNode[] = [
  {
    slug: "maintenance-operations", // "
    label: "Maintenance Operations",
    icon: <Printer />,
    display: "buttons",
    children: [
      {
        slug: "load-full-pack",
        label: "Load Full Pack",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ReportRenderedLazy />
          </Suspense>
        ),
      },
      {
        slug: "load-combined-pack",
        label: "Load Combined Pack",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <GenericReportLazy />
          </Suspense>
        ),
      },
      {
        slug: "unload-pack",
        label: "Unload Pack",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ReportRenderedLazy />
          </Suspense>
        ),
      },
      {
        slug: "close-shift",
        label: "Close Shift",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ReportRenderedLazy />
          </Suspense>
        ),
      },
      {
        slug: "important-telephone-numbers",
        label: "Important Telephone Numbers",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <GenericReportLazy />
          </Suspense>
        ),
      },
      {
        slug: "clear-customer-credits",
        label: "Clear Customer Credits",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ReportRenderedLazy />
          </Suspense>
        ),
      },
      {
        slug: "pack-operations",
        label: "Pack Operations",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ReportRenderedLazy />
          </Suspense>
        ),
      },
    ],
  },
  {
    slug: "financial-reports",
    label: "Financial Reports",
    icon: <Printer />,
    children: [
      {
        slug: "pack-settlements",
        label: "Pack Settlements",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ReportRenderedLazy />
          </Suspense>
        ),
      },
      {
        slug: "scratch-cashes",
        label: "Scratch Cashes",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <GenericReportLazy />
          </Suspense>
        ),
      },
      {
        slug: "weekly-statement",
        label: "Current Weekly Statement",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ReportRenderedLazy />
          </Suspense>
        ),
      },
    ],
  },
  {
    slug: "lottery-sales-reports",
    label: "Lottery Sales Rep",
    icon: <Printer />,
    children: [
      {
        slug: "return-tickets",
        label: "Return Tickets",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ReportRenderedLazy />
          </Suspense>
        ),
      },
      {
        slug: "adjustments",
        label: "Adjustements",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ReportRenderedLazy />
          </Suspense>
        ),
      },
      {
        slug: "field-order",
        label: "Field Order",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ReportRenderedLazy />
          </Suspense>
        ),
      },
      {
        slug: "retailer-order",
        label: "Retailer Order",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ReportRenderedLazy />
          </Suspense>
        ),
      },
      {
        slug: "order-pararamets",
        label: "Order Parameters",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ReportRenderedLazy />
          </Suspense>
        ),
      },
      {
        slug: "lsr-order",
        label: "LSR Order",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ReportRenderedLazy />
          </Suspense>
        ),
      },
      {
        slug: "stock-recovery",
        label: "Stock Recovery",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ReportRenderedLazy />
          </Suspense>
        ),
      },
      {
        slug: "order-detail",
        label: "Order Detail",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ReportRenderedLazy />
          </Suspense>
        ),
      },
    ],
  },
  {
    slug: "dreamtouch-operations",
    label: "Dreamtouch Operations",
    icon: <Printer />,
    display: "buttons",
    children: [
      {
        slug: " cash-reconciliation-report",
        label: "Cash Reconciliation Report (Interim)",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ReportRenderedLazy />
          </Suspense>
        ),
      },
      {
        slug: "cash-reconciliation-report-final",
        label: "Cash Reconciliation Report (Final)",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ReportRenderedLazy />
          </Suspense>
        ),
      },
      {
        slug: "inventory-report",
        label: "Inventory Report",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ReportRenderedLazy />
          </Suspense>
        ),
      },
      {
        slug: "transaction-history-report",
        label: "Transtaction History Report",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ReportRenderedLazy />
          </Suspense>
        ),
      },
      {
        slug: "sales-report",
        label: "Sales Report With Calendar",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ReportRenderedLazy />
          </Suspense>
        ),
      },
      {
        slug: "bin-out-of-stock-report",
        label: "Bin Out of Stock Report",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ReportRenderedLazy />
          </Suspense>
        ),
      },
    ],
  },
  {
    slug: "system-reports",
    label: "System Reports",
    icon: <Printer />,
    children: [
      {
        slug: "component-versions",
        label: "Component Versions",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ReportRenderedLazy />
          </Suspense>
        ),
      },
      {
        slug: "device-status-report",
        label: "Device Status Report",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ReportRenderedLazy />
          </Suspense>
        ),
      },
      {
        slug: "configuration",
        label: "Configuration",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ReportRenderedLazy />
          </Suspense>
        ),
      },
      {
        slug: "logged-events",
        label: "Logged Events",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ReportRenderedLazy />
          </Suspense>
        ),
      },
      {
        slug: "security",
        label: "Security",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ReportRenderedLazy />
          </Suspense>
        ),
      },
    ],
  },
  {
    slug: "diagnostics",
    label: "Diagnostics",
    icon: <Printer />,
    children: [
      {
        slug: "pack-settlements",
        label: "Pack Settlements",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ReportRenderedLazy />
          </Suspense>
        ),
      },
      {
        slug: "scratch-cashes",
        label: "Scratch Cashes",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <GenericReport />
          </Suspense>
        ),
      },
      {
        slug: "weekly-statement",
        label: "Current Weekly Statement",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ReportRenderedLazy />
          </Suspense>
        ),
      },
    ],
  },
  {
    slug: "terminal",
    label: "Terminal",
    icon: <Printer />,
    display: "buttons",
    children: [
      {
        slug: "sign-off",
        label: "Sign Off",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ReportRenderedLazy />
          </Suspense>
        ),
      },
      {
        slug: "password-change",
        label: "Password Change",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <GenericReport />
          </Suspense>
        ),
      },
      {
        slug: "new-password",
        label: "New Password",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ReportRenderedLazy />
          </Suspense>
        ),
      },
      {
        slug: "training",
        label: "Training",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ReportRenderedLazy />
          </Suspense>
        ),
      },
      {
        slug: "field-settings",
        label: "Field Settings",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <GenericReport />
          </Suspense>
        ),
      },
      {
        slug: "message-resend",
        label: "Message Resend",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ReportRenderedLazy />
          </Suspense>
        ),
      },
    ],
  },

  /* …the rest of your sections… */
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

const App: React.FC = () => {
  const [sidebarVariant, setSidebarVariant] = useState<"labels" | "buttons">(
    "labels"
  );
  const [showBottomBar, setShowBottomBar] = useState(false);

  const [loggedIn, setLoggedIn] = useState(() => {
    return localStorage.getItem("loggedIn") === "true";
  });

  const handleLoginSuccess = () => {
    localStorage.setItem("loggedIn", "true");
    setLoggedIn(true);
  };

  if (!loggedIn) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <BrowserRouter>
      <Layout
        sidebarItems={nav}
        sidebarVariant={sidebarVariant}
        topLeft={"Retailer Portal"}
        topRight={"retailerId: 32324d"}
        bottomItems={showBottomBar ? peripherals : undefined}
        topCenter={
          <TestToggles
            sidebarVariant={sidebarVariant}
            setSidebarVariant={setSidebarVariant}
            showBottomBar={showBottomBar}
            setShowBottomBar={setShowBottomBar}
          />
        }
        // any other layout props you already support …
      >
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>{buildRoutes(nav)}</Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
