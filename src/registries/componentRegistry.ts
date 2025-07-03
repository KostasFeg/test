import React from "react";

/**
 * MAP OF COMPONENT NAMES TO LAZY-LOADED REACT COMPONENTS
 *
 * Usage in config.json (leaf nav item):
 *   {
 *     "slug": "sales-performance",
 *     "label": "Sales Performance",
 *     "kind": "component",
 *     "component": "SalesPerfPage",
 *     "props": { "defaultTab": "trend" }
 *   }
 *
 * At runtime DynamicConfigService will look up the key in this registry and
 * render <Component {...props} />.
 */

export const componentRegistry: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  HelloWorldPage: React.lazy(() => import("../views/HelloWorldPage")),
  StatsPanel: React.lazy(() => import("../views/StatsPanel")),
  BursterSelection: React.lazy(() => import("../components/bursters/BursterSelectionPanel")),
  BursterAction: React.lazy(() => import("../components/bursters/BursterActionPanel")),
  // Example placeholder — replace with real pages as you build them
}; 