// nav-config.ts
import React, { JSX } from "react";
import { Printer } from "lucide-react";

export type NavNode = {
  /** URL segment, *not* the full path */
  slug: string;
  /** Human-readable label for side- or top-bars */
  label: string;
  /** Icon component for the sidebar variant that shows icons */
  icon?: React.ReactNode;
  /** Function returning a React element that lives in the MAIN area */
  element?: () => JSX.Element;
  /** Children = render an "inner menu" AND create nested routes */
  children?: NavNode[];
  /** Display style for children: 'tabs' (default) or 'buttons' */
  display?: "tabs" | "buttons";
};

// lazy helpers
const ReportRendered = React.lazy(
  () => import("./components/ui/ReportRendered")
);
const GenericReport = React.lazy(() => import("./components/ui/GenericReport"));

const BursterSelectionPanel = React.lazy(
  () => import("./components/bursters/BursterSelectionPanel")
);

export const navConfig: NavNode[] = [
  {
    slug: "maintenance-operations", // "
    label: "Maintenance Operations",
    icon: <Printer />,
    display: "buttons",
    children: [
      {
        slug: "load-full-pack",
        label: "Load Full Pack",
        element: () => <BursterSelectionPanel />,
      },
      {
        slug: "load-combined-pack",
        label: "Load Combined Pack",
        element: () => <GenericReport />,
      },
      {
        slug: "unload-pack",
        label: "Unload Pack",
        element: () => <ReportRendered />,
      },
      {
        slug: "close-shift",
        label: "Close Shift",
        element: () => <ReportRendered />,
      },
      {
        slug: "important-telephone-numbers",
        label: "Important Telephone Numbers",
        element: () => <GenericReport />,
      },
      {
        slug: "clear-customer-credits",
        label: "Clear Customer Credits",
        element: () => <ReportRendered />,
      },
      {
        slug: "pack-operations",
        label: "Pack Operations",
        element: () => <ReportRendered />,
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
        element: () => <ReportRendered />,
      },
      {
        slug: "scratch-cashes",
        label: "Scratch Cashes",
        element: () => <GenericReport />,
      },
      {
        slug: "weekly-statement",
        label: "Current Weekly Statement",
        element: () => <ReportRendered />,
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
        element: () => <ReportRendered />,
      },
      {
        slug: "adjustments",
        label: "Adjustements",
        element: () => <ReportRendered />,
      },
      {
        slug: "field-order",
        label: "Field Order",
        element: () => <ReportRendered />,
      },
      {
        slug: "retailer-order",
        label: "Retailer Order",
        element: () => <ReportRendered />,
      },
      {
        slug: "order-pararamets",
        label: "Order Parameters",
        element: () => <ReportRendered />,
      },
      {
        slug: "lsr-order",
        label: "LSR Order",
        element: () => <ReportRendered />,
      },
      {
        slug: "stock-recovery",
        label: "Stock Recovery",
        element: () => <ReportRendered />,
      },
      {
        slug: "order-detail",
        label: "Order Detail",
        element: () => <ReportRendered />,
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
        element: () => <ReportRendered />,
      },
      {
        slug: "cash-reconciliation-report-final",
        label: "Cash Reconciliation Report (Final)",
        element: () => <ReportRendered />,
      },
      {
        slug: "inventory-report",
        label: "Inventory Report",
        element: () => <ReportRendered />,
      },
      {
        slug: "transaction-history-report",
        label: "Transtaction History Report",
        element: () => <ReportRendered />,
      },
      {
        slug: "sales-report",
        label: "Sales Report With Calendar",
        element: () => <ReportRendered />,
      },
      {
        slug: "bin-out-of-stock-report",
        label: "Bin Out of Stock Report",
        element: () => <ReportRendered />,
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
        element: () => <ReportRendered />,
      },
      {
        slug: "device-status-report",
        label: "Device Status Report",
        element: () => <ReportRendered />,
      },
      {
        slug: "configuration",
        label: "Configuration",
        element: () => <ReportRendered />,
      },
      {
        slug: "logged-events",
        label: "Logged Events",
        element: () => <ReportRendered />,
      },
      {
        slug: "security",
        label: "Security",
        element: () => <ReportRendered />,
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
        element: () => <ReportRendered />,
      },
      {
        slug: "scratch-cashes",
        label: "Scratch Cashes",
        element: () => <GenericReport />,
      },
      {
        slug: "weekly-statement",
        label: "Current Weekly Statement",
        element: () => <ReportRendered />,
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
        element: () => <ReportRendered />,
      },
      {
        slug: "password-change",
        label: "Password Change",
        element: () => <GenericReport />,
      },
      {
        slug: "new-password",
        label: "New Password",
        element: () => <ReportRendered />,
      },
      {
        slug: "training",
        label: "Training",
        element: () => <ReportRendered />,
      },
      {
        slug: "field-settings",
        label: "Field Settings",
        element: () => <GenericReport />,
      },
      {
        slug: "message-resend",
        label: "Message Resend",
        element: () => <ReportRendered />,
      },
    ],
  },

  /* …the rest of your sections… */
];
