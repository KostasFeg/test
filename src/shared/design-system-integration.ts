/**
 * 🎨 Design System Integration
 * ──────────────────────────────
 * This module bridges the new design system with existing configuration
 * and provides migration utilities from the legacy styling system.
 */

import {
  buildDesignTokens,
  generateCSSVariables,
  convertLegacyConfig,
  DesignSystemConfig,
  DesignTokens,
} from "../design-system";
import { useConfig } from "./hooks/useConfig";
import { useMemo, useEffect } from "react";

// Global design tokens storage for the application
let globalDesignTokens: DesignTokens | null = null;
let globalCSSVariables: string | null = null;

/**
 * Main hook to get design tokens from configuration
 * This will replace the existing useThemeValues hook
 */
export function useDesignTokens(): DesignTokens {
  const config = useConfig();

  return useMemo(() => {
    // Convert existing config to new design system format
    const designSystemConfig = convertLegacyConfig(config);

    // Build design tokens using the new system
    const tokens = buildDesignTokens(designSystemConfig);

    // Store globally for other parts of the app
    globalDesignTokens = tokens;

    return tokens;
  }, [config]);
}

/**
 * Hook to automatically inject CSS variables when design tokens change
 */
export function useDesignSystemInjection(): void {
  const tokens = useDesignTokens();

  useEffect(() => {
    // Generate CSS variables from design tokens
    const cssVariables = generateCSSVariables(tokens);
    globalCSSVariables = cssVariables;

    // Inject CSS variables into the document
    injectCSSVariables(cssVariables);

    // Also set each variable inline on :root to guarantee they override any
    // later-added stylesheets during hot-reload.
    applyInlineCSSVariables(cssVariables);
  }, [tokens]);
}

/**
 * Inject CSS variables into the document head
 */
function injectCSSVariables(cssVariables: string): void {
  // Remove existing design system styles
  const existingStyle = document.getElementById("design-system-variables");
  if (existingStyle) {
    existingStyle.remove();
  }

  // Create new style element
  const styleElement = document.createElement("style");
  styleElement.id = "design-system-variables";
  styleElement.innerHTML = cssVariables; // Already includes :root {}

  // Append as the last <style> so it overrides earlier defaults
  document.head.appendChild(styleElement);

  console.log(
    "💉 Injected CSS variables:",
    cssVariables.split("\n").length,
    "variables"
  );
}

/**
 * Helper: parse the generated :root { ... } string and set each variable on
 * document.documentElement.style so it wins the cascade regardless of sheet
 * ordering during HMR.
 */
function applyInlineCSSVariables(cssVariables: string) {
  if (typeof document === "undefined") return;
  const rootStyle = document.documentElement.style;
  cssVariables.split(/;\s*\n?/).forEach((line) => {
    const match = line.match(/--([^:]+):\s*(.+)$/);
    if (match) {
      const [, name, value] = match;
      rootStyle.setProperty(`--${name.trim()}`, value.trim());
    }
  });
}

/**
 * Get current design tokens without React hook (for non-component usage)
 */
export function getCurrentDesignTokens(): DesignTokens | null {
  return globalDesignTokens;
}

/**
 * Get current CSS variables string without React hook
 */
export function getCurrentCSSVariables(): string | null {
  return globalCSSVariables;
}

/**
 * Manual update function for design tokens (for external config changes)
 */
export function updateDesignTokens(config: any): DesignTokens {
  const designSystemConfig = convertLegacyConfig(config);
  const tokens = buildDesignTokens(designSystemConfig);
  const cssVariables = generateCSSVariables(tokens);

  globalDesignTokens = tokens;
  globalCSSVariables = cssVariables;

  injectCSSVariables(cssVariables);

  return tokens;
}

/**
 * Enhanced hook that provides easy access to common design values
 * This will replace the existing useThemeValues hook
 */
export function useDesignValues() {
  const tokens = useDesignTokens();

  return useMemo(
    () => ({
      // Colors - simplified access
      colors: {
        primary: tokens.palette.primary.main,
        primaryLight: tokens.palette.primary.light,
        primaryDark: tokens.palette.primary.dark,
        secondary: tokens.palette.secondary.main,
        accent: tokens.palette.accent.main,
        success: tokens.palette.success.main,
        warning: tokens.palette.warning.main,
        error: tokens.palette.error.main,
        info: tokens.palette.info.main,
      },

      // Complete palette access for advanced usage
      palette: tokens.palette,

      // Typography
      typography: tokens.typography,

      // Spacing with numeric values for calculations
      spacing: Object.fromEntries(
        Object.entries(tokens.spacing).map(([key, value]) => [
          key,
          parseFloat(value.replace("rem", "")) * 16, // Convert rem to px
        ])
      ),

      // Border radius
      radius: tokens.radius,

      // Shadows
      shadows: tokens.shadows,

      // Transitions
      transitions: tokens.transitions,

      // Interactive states
      interactive: tokens.interactive,

      // Layout values
      layout: tokens.layout,
    }),
    [tokens]
  );
}

/**
 * Utility to get CSS variable name for a design token path
 */
export function getCSSVariableName(path: string): string {
  // Convert paths like 'palette.primary.main' to '--color-primary'
  const pathMap: Record<string, string> = {
    "palette.primary.main": "--color-primary",
    "palette.primary.light": "--color-primary-light",
    "palette.primary.dark": "--color-primary-dark",
    "palette.secondary.main": "--color-secondary",
    "palette.accent.main": "--color-accent",
    "palette.success.main": "--color-success",
    "palette.warning.main": "--color-warning",
    "palette.error.main": "--color-error",
    "palette.info.main": "--color-info",
    "palette.text.primary": "--text-primary",
    "palette.text.secondary": "--text-secondary",
    "palette.background.default": "--bg-default",
    "palette.background.paper": "--bg-paper",
  };

  return pathMap[path] || `--${path.replace(/\./g, "-")}`;
}

/**
 * Migration helper to convert old SCSS variable names to new CSS variables
 */
export const legacyVariableMap: Record<string, string> = {
  // Old SCSS variables -> New CSS variables
  "$blue-500": "var(--color-primary)",
  "$blue-600": "var(--color-primary-dark)",
  "$blue-100": "var(--color-primary-light)",
  "$grey-50": "var(--color-grey-50)",
  "$grey-100": "var(--color-grey-100)",
  "$grey-200": "var(--color-grey-200)",
  "$grey-300": "var(--color-grey-300)",
  "$grey-600": "var(--color-grey-600)",
  "$grey-700": "var(--color-grey-700)",
  "$grey-800": "var(--color-grey-800)",
  $white: "var(--color-grey-50)",
  "$accent-color": "var(--color-accent)",
  "$accent-color-bg": "var(--color-accent-light)",
  "$spacing-1": "var(--spacing-1)",
  "$spacing-2": "var(--spacing-2)",
  "$spacing-3": "var(--spacing-3)",
  "$spacing-4": "var(--spacing-4)",
  "$spacing-5": "var(--spacing-5)",
  "$spacing-6": "var(--spacing-6)",
  "$radius-sm": "var(--radius-small)",
  "$radius-md": "var(--radius-medium)",
  "$radius-lg": "var(--radius-large)",
  "$font-family-sans": "var(--font-family-sans)",
  "$font-family-mono": "var(--font-family-mono)",
};

/**
 * Convert MasterConfig to DesignSystemConfig for the new design system
 * This bridges the gap between the old config format and new design tokens
 */
export function convertMasterConfigToDesignSystem(
  masterConfig: any
): DesignSystemConfig {
  return {
    theme: {
      colors: {
        primary: masterConfig.theme?.colors?.primary || "#2563eb",
        secondary: masterConfig.theme?.colors?.secondary || "#64748b",
        accent: masterConfig.theme?.colors?.accent || "#06b6d4",
        success: masterConfig.theme?.colors?.success || "#10b981",
        warning: masterConfig.theme?.colors?.warning || "#f59e0b",
        error: masterConfig.theme?.colors?.error || "#ef4444",
        info: masterConfig.theme?.colors?.info || "#3b82f6",
      },
      typography: masterConfig.theme?.typography
        ? {
            fontFamilySans: masterConfig.theme.typography.fontFamilySans,
            fontFamilyMono: masterConfig.theme.typography.fontFamilyMono,
            fontSizeSmall: masterConfig.theme.typography.fontSizeSmall,
            fontSizeMedium: masterConfig.theme.typography.fontSizeMedium,
            fontSizeLarge: masterConfig.theme.typography.fontSizeLarge,
            fontSizeXLarge: masterConfig.theme.typography.fontSizeXLarge,
            fontWeightNormal: masterConfig.theme.typography.fontWeightNormal,
            fontWeightMedium: masterConfig.theme.typography.fontWeightMedium,
            fontWeightSemibold:
              masterConfig.theme.typography.fontWeightSemibold,
            fontWeightBold: masterConfig.theme.typography.fontWeightBold,
          }
        : undefined,
      spacing: masterConfig.theme?.spacing,
      borderRadius: masterConfig.theme?.borderRadius,
      shadows: masterConfig.theme?.shadows,
      transitions: masterConfig.theme?.transitions,
      interactiveStates: masterConfig.theme?.interactiveStates,
    },
    layout: masterConfig.layout,
    ui: masterConfig.ui,
    componentStyles: masterConfig.componentStyles,
    branding: masterConfig.branding,
    api: masterConfig.api,
    auth: masterConfig.auth,
    features: masterConfig.features,
    navigation: masterConfig.navigation,
  };
}

/**
 * Inject CSS variables and update design tokens for MasterConfig
 * This replaces the old injectCSSVariables function
 */
export function injectCSSVariablesFromMasterConfig(masterConfig: any): void {
  try {
    // Convert MasterConfig to design system format
    const designSystemConfig = convertMasterConfigToDesignSystem(masterConfig);

    // Build design tokens
    const tokens = buildDesignTokens(designSystemConfig);

    // Generate CSS variables
    const cssVariables = generateCSSVariables(tokens);

    // Debug logging for animation timing
    console.log("🎛️ Animation timing values being applied:");
    console.log(
      "🎛️ ui.animationFast:",
      masterConfig?.ui?.animationFast || "undefined"
    );
    console.log(
      "🎛️ ui.animationMedium:",
      masterConfig?.ui?.animationMedium || "undefined"
    );
    console.log(
      "🎛️ ui.animationSlow:",
      masterConfig?.ui?.animationSlow || "undefined"
    );

    // Update global state
    globalDesignTokens = tokens;
    globalCSSVariables = cssVariables;

    // Inject into document
    injectCSSVariables(cssVariables);

    console.log("🎨 CSS variables updated using new design system");
  } catch (error) {
    console.error("Failed to inject CSS variables from MasterConfig:", error);
  }
}

/**
 * Get semantic color variants automatically
 * This provides the enhanced color derivation that was in the old system
 */
export function getColorVariants(baseColor: string) {
  const tokens = getCurrentDesignTokens();
  if (!tokens)
    return { light: baseColor, dark: baseColor, contrast: "#000000" };

  // Find the matching color scale
  const colorScales = [
    tokens.palette.primary,
    tokens.palette.secondary,
    tokens.palette.accent,
    tokens.palette.success,
    tokens.palette.warning,
    tokens.palette.error,
    tokens.palette.info,
  ];

  const matchingScale = colorScales.find((scale) => scale.main === baseColor);

  if (matchingScale) {
    return {
      light: matchingScale.light,
      dark: matchingScale.dark,
      contrast: matchingScale.contrastText,
    };
  }

  // Fallback to the color itself
  return { light: baseColor, dark: baseColor, contrast: "#000000" };
}
