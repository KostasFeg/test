import { MasterConfig, defaultConfig } from "./master.config";
import { navConfig } from "./navigation.config";
import { REPORTS } from "../../config/reportConfig";
import brandingConfig from "./branding.config";
import React from "react";

// ==========================================
// CONFIGURATION BUILDER
// ==========================================
// This builder merges all existing configurations into the master config.
// It allows for project-specific overrides while maintaining type safety.

export interface ConfigOverrides {
  // Allow deep partial overrides of any config section
  theme?: {
    colors?: Partial<MasterConfig['theme']['colors']>;
    typography?: Partial<MasterConfig['theme']['typography']>;
    spacing?: Partial<MasterConfig['theme']['spacing']>;
    borderRadius?: Partial<MasterConfig['theme']['borderRadius']>;
  };
  layout?: Partial<MasterConfig['layout']>;
  ui?: Partial<MasterConfig['ui']>;
  componentStyles?: Partial<MasterConfig['componentStyles']>;
  branding?: Partial<MasterConfig['branding']>;
  api?: Partial<MasterConfig['api']>;
  auth?: Partial<MasterConfig['auth']>;
  features?: Partial<MasterConfig['features']>;
  navigation?: any[]; // Allow JSON navigation items
  reports?: Partial<MasterConfig['reports']>;
}

function deepMerge<T>(target: T, source: Partial<T>): T {
  const result = { ...target } as T;
  
  for (const key in source) {
    if (source[key] !== undefined) {
      if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
        result[key] = deepMerge(target[key] as any, source[key] as any);
      } else {
        result[key] = source[key] as T[Extract<keyof T, string>];
      }
    }
  }
  
  return result;
}

/**
 * Auto-generate navigation items from reports configuration
 * This makes it super easy to add reports via config.json
 */
export function generateReportsNavigation(reports: Record<string, any>) {
  const GenericReport = React.lazy(() => import("../../components/ui/GenericReport"));
  
  return Object.entries(reports).map(([slug, config]) => ({
    slug,
    label: config.name || slug.replace(/[-_]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
    element: () => React.createElement(GenericReport),
  }));
}

/**
 * Transform JSON navigation items into proper NavNode objects with element functions
 * This is the missing piece that converts config.json navigation items into working React components
 */
export function transformJsonNavigationToNavNodes(jsonNavigation: any[], reports: Record<string, any> = {}): any[] {
  console.log('🔄 Transforming JSON navigation items:', jsonNavigation);
  console.log('🔄 Available reports for transformation:', reports);
  
  if (!Array.isArray(jsonNavigation)) {
    console.error('❌ jsonNavigation is not an array:', jsonNavigation);
    return [];
  }
  
  const GenericReport = React.lazy(() => import("../../components/ui/GenericReport"));
  const ReportRendered = React.lazy(() => import("../../components/ui/ReportRendered"));
  
  const transformedItems = jsonNavigation.map(item => {
    try {
      console.log('🔄 Processing navigation item:', item.slug, item.label);
      
      const transformedItem: any = {
        slug: item.slug,
        label: item.label,
        display: item.display,
        columns: item.columns,
      };

      // Add element function for leaf nodes (no children)
      if (!item.children || item.children.length === 0) {
        // TEMPORARILY: Use same element function for all items to test if reports are the issue
        console.log('✅ Adding element function for leaf item:', item.slug);
        transformedItem.element = () => React.createElement(GenericReport);
      } else {
        console.log('📁 Processing parent item with children:', item.slug, 'children count:', item.children.length);
      }

      // Recursively transform children
      if (item.children && item.children.length > 0) {
        transformedItem.children = transformJsonNavigationToNavNodes(item.children, reports);
      }

      return transformedItem;
    } catch (error) {
      console.error('❌ Error transforming navigation item:', item, error);
      return null;
    }
  }).filter(Boolean); // Remove any null items from errors
  
  console.log('✅ Transformation complete, result:', transformedItems);
  return transformedItems;
}

/**
 * Create a complete reports section for navigation from reports config
 * Usage in config.json: Just add reports, this function auto-creates navigation
 */
export function createReportsNavigationSection(reports: Record<string, any>, options: {
  sectionLabel?: string;
  display?: "buttons" | "tabs";
  icon?: any;
  columns?: number;
} = {}) {
  if (Object.keys(reports).length === 0) return null;
  
  return {
    slug: "auto-generated-reports",
    label: options.sectionLabel || "📊 Reports",
    display: options.display || "buttons",
    columns: options.columns || 2,
    children: generateReportsNavigation(reports)
  };
}

/**
 * Build the complete application configuration by merging:
 * 1. Default master config values
 * 2. Existing legacy configs (navigation, reports, branding)
 * 3. Project-specific overrides
 */
export function buildConfig(overrides: ConfigOverrides = {}): MasterConfig {
  // Start with default configuration
  let config = { ...defaultConfig };
  
  // Merge existing branding configuration
  config.branding = {
    ...config.branding,
    company: brandingConfig.company,
    logo: brandingConfig.logo,
    loginPage: brandingConfig.loginPage,
  };
  
  // Apply theme colors from branding if they exist
  if (brandingConfig.colors) {
    config.theme.colors = {
      ...config.theme.colors,
      primary: brandingConfig.colors.primary || config.theme.colors.primary,
      secondary: brandingConfig.colors.secondary || config.theme.colors.secondary,
      accent: brandingConfig.colors.accent || config.theme.colors.accent,
    };
  }
  
  // Merge navigation configuration
  config.navigation = navConfig;
  
  // Merge reports configuration
  config.reports = REPORTS;
  
  // Apply project-specific overrides
  if (overrides.theme) {
    if (overrides.theme.colors) {
      config.theme.colors = { ...config.theme.colors, ...overrides.theme.colors };
    }
    if (overrides.theme.typography) {
      config.theme.typography = { ...config.theme.typography, ...overrides.theme.typography };
    }
    if (overrides.theme.spacing) {
      config.theme.spacing = { ...config.theme.spacing, ...overrides.theme.spacing };
    }
    if (overrides.theme.borderRadius) {
      config.theme.borderRadius = { ...config.theme.borderRadius, ...overrides.theme.borderRadius };
    }
  }
  
  if (overrides.layout) {
    config.layout = deepMerge(config.layout, overrides.layout);
  }
  
  if (overrides.ui) {
    config.ui = deepMerge(config.ui, overrides.ui);
  }
  
  if (overrides.componentStyles) {
    config.componentStyles = deepMerge(config.componentStyles, overrides.componentStyles);
  }
  
  if (overrides.branding) {
    config.branding = deepMerge(config.branding, overrides.branding);
  }
  
  if (overrides.api) {
    config.api = deepMerge(config.api, overrides.api);
  }
  
  if (overrides.auth) {
    config.auth = deepMerge(config.auth, overrides.auth);
  }
  
  if (overrides.features) {
    config.features = deepMerge(config.features, overrides.features);
  }
  
  // Apply reports overrides FIRST - navigation transformation needs these
  if (overrides.reports) {
    console.log('🎯 Applying reports overrides from config.json');
    console.log('🎯 Existing reports:', Object.keys(config.reports));
    console.log('🎯 Custom reports to merge:', Object.keys(overrides.reports));
    
    try {
      // Use simple spread merge instead of deepMerge for reports
      config.reports = { ...config.reports, ...overrides.reports } as Record<string, any>;
      console.log('✅ Reports merge successful, final reports:', Object.keys(config.reports));
    } catch (error) {
      console.error('❌ Reports merge failed:', error);
      console.log('🔄 Falling back to custom reports only');
      config.reports = { ...overrides.reports as Record<string, any> };
    }
  }
  
  // Apply navigation overrides (replaces entire navigation array)
  if (overrides.navigation) {
    console.log('🎯 Applying navigation overrides from config.json');
    console.log('🎯 Available reports for navigation:', Object.keys(config.reports));
    // Transform JSON navigation items into proper NavNode objects with element functions
    config.navigation = transformJsonNavigationToNavNodes(overrides.navigation, config.reports);
  } else {
    console.log('📋 No navigation overrides found, using default navigation');
  }
  
  return config;
}

// ==========================================
// PROJECT-SPECIFIC CONFIGURATION
// ==========================================
// This is where you define your project's specific configuration.
// Modify these values to customize the application for your needs.

const projectOverrides: ConfigOverrides = {
  // Example: Customize theme colors
  theme: {
    colors: {
      // You can override any theme color here
      // primary: "#1f2937",
      // accent: "#059669",
    },
    // You can also override typography, spacing, etc.
  },
  
  // Example: Customize layout dimensions
  layout: {
    // sidebarWidth: {
    //   buttons: "280px",
    //   labels: "140px",
    // },
    // topBarHeight: "56px",
  },
  
  // Example: Customize UI behavior
  ui: {
    // defaultSidebarVariant: "buttons",
    // defaultShowBottomBar: true,
  },
  
  // Example: Customize component styles
  componentStyles: {
    // buttons: {
    //   borderRadius: "0.75rem",
    //   minHeight: "48px",
    // },
  },
  
  // Example: Enable/disable features
  features: {
    // enableDebugReports: false,
    // enableThemeCustomization: true,
  },
};

// ==========================================
// FINAL CONFIGURATION EXPORT
// ==========================================

// Build the final configuration with all merges applied
export const appConfig = buildConfig(projectOverrides);

// Export individual sections for convenience
export const themeConfig = appConfig.theme;
export const layoutConfig = appConfig.layout;
export const uiConfig = appConfig.ui;
export const componentStylesConfig = appConfig.componentStyles;
export const brandingConfigFinal = appConfig.branding;
export const apiConfig = appConfig.api;
export const authConfig = appConfig.auth;
export const navigationConfig = appConfig.navigation;
export const reportsConfig = appConfig.reports;
export const featuresConfig = appConfig.features;

export default appConfig; 