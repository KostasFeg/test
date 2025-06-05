import React from "react";
import { Printer } from "lucide-react";
import {
  REPORTS,
  REPORT_CATEGORIES,
  generateReportNavigation,
  getReportBySlug,
} from "../config/reportConfig";

export type NavNode = {
  slug: string;
  label: string;
  icon?: React.ReactNode;
  element?: () => React.ReactElement;
  children?: NavNode[];
  display?: "tabs" | "buttons";
};

// Lazy-loaded UniversalReportsPage
const UniversalReportsPage = React.lazy(
  () => import("../pages/UniversalReportsPage")
);

/**
 * Creates a navigation node for a specific report
 */
function createReportNavNode(reportSlug: string): NavNode {
  const report = getReportBySlug(reportSlug);
  if (!report) {
    throw new Error(`Report with slug "${reportSlug}" not found`);
  }

  return {
    slug: reportSlug,
    label: report.navigation.label,
    element: () => <UniversalReportsPage />,
  };
}

/**
 * Creates navigation structure from report configuration
 */
export function createReportNavigation(): NavNode[] {
  const navigation = generateReportNavigation();

  return navigation.map((category) => ({
    slug: category.slug,
    label: category.label,
    icon: <Printer />,
    children: category.reports.map((report) =>
      createReportNavNode(report.slug)
    ),
  }));
}

/**
 * Creates navigation structure with custom options
 */
export function createReportNavigationWithOptions(
  options: {
    icon?: React.ReactNode;
    display?: "tabs" | "buttons";
  } = {}
): NavNode[] {
  const navigation = generateReportNavigation();

  return navigation.map((category) => ({
    slug: category.slug,
    label: category.label,
    icon: options.icon || <Printer />,
    display: options.display,
    children: category.reports.map((report) =>
      createReportNavNode(report.slug)
    ),
  }));
}

/**
 * ✨ ULTIMATE SIMPLICITY: Single export that automatically provides ALL reports
 * Just import and spread this in your navigation config - NO OTHER SETUP REQUIRED!
 */
export const AUTO_GENERATED_REPORTS = createReportNavigationWithOptions({
  icon: <Printer />,
});

/**
 * Alternative: Get reports by category for custom layouts
 */
export function getReportsByCategory(categoryKey: string): NavNode[] {
  const navigation = generateReportNavigation();
  const category = navigation.find((cat) => cat.slug.includes(categoryKey));

  if (!category) {
    return [];
  }

  return category.reports.map((report) => createReportNavNode(report.slug));
}

/**
 * Get all available report categories
 */
export function getReportCategories(): string[] {
  return Object.keys(REPORT_CATEGORIES);
}
