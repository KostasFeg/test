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
  Settings,
} from "lucide-react";

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
  // --- Hybrid config extensions (runtime-only) ------------------
  /**
   * If present the loader augments the node based on this value.
   * "report" (default)  – render GenericReport via slug lookup
   * "component"         – render a React component from componentRegistry
   * "action"            – call an action from actionRegistry
   */
  kind?: "report" | "component" | "action";
  /** Reference into the registry – component name for kind="component" */
  component?: string;
  /** Reference into the registry – action name for kind="action" */
  action?: string;
  /** Props passed to the loaded component */
  props?: Record<string, any>;
  /** Extra params forwarded to the action handler  */
  params?: Record<string, any>;
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

const ConfigEditor = React.lazy(
  () => import("../../components/config-editor/ConfigEditor")
);

const ReportServiceExample = React.lazy(
  () => import("../../components/ui/ReportServiceExample")
);

// HARDCODED NAVIGATION REMOVED - NOW CONFIG-DRIVEN!
// All navigation is now loaded from config.json via the dynamic config service
// This fallback navigation is only used when no config is available

/**
 * @deprecated Use dynamicConfig.getNavigation() instead
 * This is kept as an emergency fallback only
 */
export const navConfig: NavNode[] = [
  // Emergency fallback navigation when config fails to load
  {
    slug: "configuration",
    label: "Configuration",
    icon: <Settings />,
    element: () => <ConfigEditor />,
  },
];
