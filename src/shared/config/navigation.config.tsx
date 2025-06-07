import React from "react";
import {
  RefreshCw,
  FileText,
  RotateCcw,
  Power,
  PowerOff,
  Monitor,
  Clock,
  Wrench,
  Printer,
} from "lucide-react";
import { AUTO_GENERATED_REPORTS } from "../../utils/reportNavigation";

export type NavNode = {
  /** URL segment, *not* the full path */
  slug: string;
  /** Human-readable label for side- or top-bars */
  label: string;
  /** Icon component for the sidebar variant that shows icons */
  icon?: React.ReactNode;
  /** Function returning a React element that lives in the MAIN area */
  element?: () => React.ReactElement;
  /** Children = render an "inner menu" AND create nested routes */
  children?: NavNode[];
  /** Display style for children: 'tabs' (default) or 'buttons' */
  display?: "tabs" | "buttons";
  /** Number of columns for button layout (only used when display is 'buttons') */
  columns?: number;
  /**
   * Optional callback function to execute when this navigation item is clicked.
   *
   * Behavior:
   * - If only onCallback is provided (no element): Executes callback without navigation
   * - If both onCallback and element are provided: Executes callback then navigates
   * - If only element is provided: Normal navigation behavior
   *
   * Use cases:
   * - Action buttons (save, export, shutdown) that don't need UI pages
   * - Pre-navigation actions (validation, loading, API calls)
   * - Combined actions (backup system then show backup UI)
   */
  onCallback?: () => void | Promise<void>;
};

// Lazy-loaded components
const ReportRendered = React.lazy(
  () => import("../../components/ui/ReportRendered")
);
const GenericReport = React.lazy(
  () => import("../../components/ui/GenericReport")
);
const BursterSelectionPanel = React.lazy(
  () => import("../../components/bursters/BursterSelectionPanel")
);

export const navConfig: NavNode[] = [
  {
    slug: "reload",
    label: "Reload",
    icon: <RefreshCw />,
    display: "buttons",
    onCallback: async () => {
      // await sendAlarm({ type: "reload" });
      // window.location.reload();
      console.log("hi");
    },
  },
  // 🎯 REMOVED: Manual report definitions - now using AUTO_GENERATED_REPORTS only!
  // Just add reports to SIMPLE_REPORTS in reportConfig.ts and they appear automatically
  {
    slug: "restart",
    label: "Restart",
    icon: <RotateCcw />,
    display: "buttons",
    onCallback: async () => {
      // app.peripheralManager.restartApp();
    },
  },
  {
    slug: "reboot",
    label: "Reboot",
    icon: <Power />,
    display: "buttons",
    onCallback: async () => {
      // app.peripheralsManager.rebootDevice();
    },
  },
  {
    slug: "shutdown",
    label: "Shutdown",
    icon: <PowerOff />,
    display: "buttons",
    onCallback: async () => {
      // app.peripheralsManager.shutdownDevice();
    },
  },
  {
    slug: "open-dmc-app",
    label: "Open DMC App",
    icon: <Monitor />,
    display: "buttons",
    onCallback: async () => {
      // app.middleware.displayDmclientApp();
    },
  },
  {
    slug: "end-shift",
    label: "End Shift",
    icon: <Clock />,
    display: "buttons",
    onCallback: async () => {
      // closeShift();
    },
  },
  {
    slug: "open-diagnostics-app",
    label: "Open Diagnostics App",
    icon: <Wrench />,
    display: "buttons",
    onCallback: async () => {
      // app.middleware.displayDiagnostics();
    },
  },

  {
    slug: "maintenance-operations",
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
      // Example of callback-only functionality (no navigation)
      {
        slug: "emergency-shutdown",
        label: "Emergency Shutdown",
        onCallback: async () => {
          console.log("Emergency shutdown initiated...");
          // Example: Could trigger system shutdown, show confirmation dialog, etc.
          await new Promise((resolve) => setTimeout(resolve, 1000));
          alert("Emergency shutdown completed");
        },
      },
      // Example of callback + navigation functionality
      {
        slug: "system-backup",
        label: "System Backup",
        element: () => <GenericReport />,
        onCallback: async () => {
          console.log("Starting system backup...");
          // Example: Could trigger backup process before showing backup interface
          await new Promise((resolve) => setTimeout(resolve, 500));
          console.log("Backup initiated, navigating to backup interface...");
        },
      },
    ],
  },

  // ✨ ULTRA-SIMPLE: All reports auto-generated from single config file!
  // Add new reports by editing ONLY src/config/reportConfig.ts
  ...AUTO_GENERATED_REPORTS,

  // 📊 Tab Layout Examples with Mock Reports
  {
    slug: "financial-reports",
    label: "Financial Reports",
    icon: <FileText />,
    display: "tabs", // Using tabs layout instead of buttons
    children: [
      {
        slug: "daily-sales-summary",
        label: "Daily Sales Summary",
        element: () => <GenericReport reportSlug="daily-sales-summary" />,
      },
      {
        slug: "weekly-revenue-analysis",
        label: "Weekly Revenue Analysis",
        element: () => <GenericReport reportSlug="weekly-revenue-analysis" />,
      },
      {
        slug: "monthly-profit-loss",
        label: "Monthly P&L Statement",
        element: () => <GenericReport reportSlug="monthly-profit-loss" />,
      },
      {
        slug: "quarterly-financial-overview",
        label: "Quarterly Overview",
        element: () => (
          <GenericReport reportSlug="quarterly-financial-overview" />
        ),
      },
    ],
  },

  // 📈 Analytics Tab Section
  {
    slug: "analytics-dashboard",
    label: "Analytics Dashboard",
    icon: <Monitor />,
    display: "tabs",
    children: [
      {
        slug: "customer-analytics",
        label: "Customer Analytics",
        element: () => <GenericReport reportSlug="customer-analytics" />,
      },
      {
        slug: "product-performance",
        label: "Product Performance",
        element: () => <GenericReport reportSlug="product-performance" />,
      },
      {
        slug: "regional-comparison",
        label: "Regional Comparison",
        element: () => <GenericReport reportSlug="regional-comparison" />,
      },
      {
        slug: "trend-analysis",
        label: "Trend Analysis",
        element: () => <GenericReport reportSlug="trend-analysis" />,
      },
    ],
  },

  // 🐛 Debug Reports with Long Content
  {
    slug: "debug-reports",
    label: "Debug Reports",
    icon: <Wrench />,
    display: "tabs",
    children: [
      {
        slug: "super-long-report",
        label: "Super Long Report",
        element: () => <GenericReport reportSlug="super-long-report" />,
      },
      {
        slug: "image-heavy-report",
        label: "Image Heavy Report",
        element: () => <GenericReport reportSlug="image-heavy-report" />,
      },
      {
        slug: "mixed-content-report",
        label: "Mixed Content Report",
        element: () => <GenericReport reportSlug="mixed-content-report" />,
      },
      {
        slug: "minimal-content-report",
        label: "Minimal Content Report",
        element: () => <GenericReport reportSlug="minimal-content-report" />,
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
        label: "Adjustments",
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
        slug: "order-parameters",
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
        slug: "cash-reconciliation-report",
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
        label: "Transaction History Report",
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
  // {
  //   slug: "system-reports",
  //   label: "System Reports",
  //   icon: <Printer />,
  //   children: [
  //     {
  //       slug: "component-versions",
  //       label: "Component Versions",
  //       element: () => <ReportRendered />,
  //     },
  //     {
  //       slug: "device-status-report",
  //       label: "Device Status Report",
  //       element: () => <ReportRendered />,
  //     },
  //     {
  //       slug: "configuration",
  //       label: "Configuration",
  //       element: () => <ReportRendered />,
  //     },
  //   ],
  // },
];
