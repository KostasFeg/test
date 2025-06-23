import { SidebarVariant } from "../types/ui";
import brandingConfig, { BrandingConfig } from "./branding.config";

interface AppConfig {
  app: {
    name: string;
    version: string;
  };
  auth: {
    persistKey: string;
    sessionTimeout?: number;
  };
  api: {
    baseUrl: string;
    timeout: number;
  };
  ui: {
    defaultSidebarVariant: SidebarVariant;
    defaultShowBottomBar: boolean;
  };
  branding: BrandingConfig;
}

const config: AppConfig = {
  app: {
    name: "Retailer Portal",
    version: "1.0.0",
  },
  auth: {
    persistKey: "loggedIn",
    sessionTimeout: 8 * 60 * 60 * 1000, // 8 hours in milliseconds
  },
  api: {
    baseUrl:
      (import.meta as any).env?.VITE_API_BASE_URL ||
      "http://localhost:3000/api",
    timeout: 30000,
  },
  ui: {
    defaultSidebarVariant: "labels",
    defaultShowBottomBar: false,
  },
  branding: brandingConfig,
};

// Environment-based feature detection using Vite build-time variables
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

// Feature flags for development tools - configurable via environment variables
export const FEATURE_FLAGS = {
  // Enable config editor - should be false in production for retailers
  ENABLE_CONFIG_EDITOR: isDevelopment && (import.meta.env.VITE_ENABLE_CONFIG_EDITOR !== 'false'),
  
  // Enable test toggles - development only
  ENABLE_TEST_TOGGLES: isDevelopment && (import.meta.env.VITE_ENABLE_TEST_TOGGLES !== 'false'),
  
  // Enable debug tools
  ENABLE_DEBUG_TOOLS: isDevelopment && (import.meta.env.VITE_ENABLE_DEBUG_TOOLS !== 'false'),
  
  // Enable welcome screen config prompt
  ENABLE_WELCOME_CONFIG: isDevelopment && (import.meta.env.VITE_ENABLE_WELCOME_CONFIG !== 'false'),
} as const;

/**
 * Check if development tools should be available
 */
export function shouldShowDevTools(): boolean {
  return FEATURE_FLAGS.ENABLE_CONFIG_EDITOR || FEATURE_FLAGS.ENABLE_DEBUG_TOOLS;
}

/**
 * Check if config editor should be available
 */
export function shouldShowConfigEditor(): boolean {
  return FEATURE_FLAGS.ENABLE_CONFIG_EDITOR;
}

/**
 * Get environment-appropriate route configuration
 */
export function getEnvironmentRoutes() {
  const routes: string[] = [];
  
  if (FEATURE_FLAGS.ENABLE_CONFIG_EDITOR) {
    routes.push('/configuration');
  }
  
  return routes;
}

/**
 * Production vs Development user experience settings
 */
export const UX_CONFIG = {
  // Show advanced features in development
  showAdvancedFeatures: isDevelopment,
  
  // Enable keyboard shortcuts for developers
  enableKeyboardShortcuts: isDevelopment,
  
  // Show performance metrics
  showPerformanceMetrics: isDevelopment,
  
  // Default theme for different environments
  defaultTheme: isProduction ? 'retail' : 'development',
} as const;

export default config;
