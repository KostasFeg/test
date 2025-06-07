import React from "react";
import { Printer } from "lucide-react";
import { REPORTS, getReportSlugs } from "../config/reportConfig";
import type { NavNode } from "../shared/config/navigation.config";

// Lazy-loaded GenericReport
const GenericReport = React.lazy(
  () => import("../components/ui/GenericReport")
);

/**
 * 🎯 DEAD SIMPLE: Auto-generate navigation from report config
 * Just add reports to REPORTS in reportConfig.ts and they appear here!
 */
export const AUTO_GENERATED_REPORTS: NavNode[] = [
  {
    slug: "reports",
    label: "Reports",
    icon: <Printer />,
    display: "buttons",
    columns: 2,
    children: getReportSlugs().map((slug) => ({
      slug: slug,
      label: REPORTS[slug].name,
      element: () => <GenericReport />,
    })),
  },
];
