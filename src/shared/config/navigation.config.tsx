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
  {
    slug: "reports",
    label: "Reports",
    icon: <FileText />,
    display: "buttons",
    columns: 2,
    children: [
      {
        slug: "shift-report",
        label: "Shift-Report (interim)",
        element: () => <BursterSelectionPanel />,
      },
      {
        slug: "daily-sales-report",
        label: "Daily Sales Report",
        element: () => <GenericReport />,
      },
      {
        slug: "daily-adjustment-report",
        label: "Daily Adjustment Report",
        element: () => <GenericReport />,
      },
      {
        slug: "summary-report",
        label: "Summary Report",
        element: () => <GenericReport />,
      },
      {
        slug: "daily-cashes-report",
        label: "Daily Cashes Report",
        element: () => <GenericReport />,
      },
      {
        slug: "commissions-report",
        label: "Commissions Report",
        element: () => <GenericReport />,
      },
      {
        slug: "machine-settings-report",
        label: "Machinbe Settings Report",
        element: () => <GenericReport />,
      },
      {
        slug: "current-jackpots-report",
        label: "Current Jackpots Report",
        element: () => <GenericReport />,
      },
      {
        slug: "winning-numbers-last-draw-all-games",
        label: "Winning Numbers Last Draw All Games",
        element: () => <GenericReport />,
      },
      {
        slug: "terminal-reports",
        label: "Terminal Reports",
        element: () => <GenericReport />,
      },
      {
        slug: "terminal-reports",
        label: "Winning Numbers Last Draw All Games",
        element: () => <GenericReport />,
      },
      {
        slug: "shift-report",
        label: "Shift Report (Closed)",
        element: () => <GenericReport />,
      },
      {
        slug: "last-play-receipts-report",
        label: "Last Play Receipts Report",
        element: () => <GenericReport />,
      },
    ],
  },
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
