import { useMemo, useState, useEffect } from 'react';
import { MasterConfig } from '../config/master.config';
import { configManager } from '../config/config.manager';

/**
 * Hook to access the complete application configuration
 * Automatically updates when configuration changes
 */
export function useConfig(): MasterConfig {
  const [config, setConfig] = useState<MasterConfig>(() => configManager.getCurrentConfig());

  useEffect(() => {
    console.log('📱 useConfig hook: Setting up subscription');
    // Subscribe to config changes
    const unsubscribe = configManager.subscribe((newConfig) => {
      console.log('📱 useConfig hook: Received config update', newConfig.ui);
      setConfig(newConfig);
    });

    // Cleanup subscription on unmount
    return () => {
      console.log('📱 useConfig hook: Cleaning up subscription');
      unsubscribe();
    };
  }, []);

  return config;
}

/**
 * Hook to access theme configuration (colors, typography, spacing, etc.)
 */
export function useThemeConfig() {
  const config = useConfig();
  return useMemo(() => config.theme, [config.theme]);
}

/**
 * Hook to access layout configuration (sidebar widths, heights, breakpoints, etc.)
 */
export function useLayoutConfig() {
  const config = useConfig();
  return useMemo(() => config.layout, [config.layout]);
}

/**
 * Hook to access UI configuration (animations, transitions, etc.)
 */
export function useUIConfig() {
  const config = useConfig();
  return useMemo(() => config.ui, [config.ui]);
}

/**
 * Hook to access component styles configuration
 */
export function useComponentStylesConfig() {
  const config = useConfig();
  return useMemo(() => config.componentStyles, [config.componentStyles]);
}

/**
 * Hook to access branding configuration
 */
export function useBrandingConfig() {
  const config = useConfig();
  return useMemo(() => config.branding, [config.branding]);
}

/**
 * Hook to access API configuration
 */
export function useAPIConfig() {
  const config = useConfig();
  return useMemo(() => config.api, [config.api]);
}

/**
 * Hook to access auth configuration
 */
export function useAuthConfig() {
  const config = useConfig();
  return useMemo(() => config.auth, [config.auth]);
}

/**
 * Hook to access navigation configuration
 */
export function useNavigationConfig() {
  const config = useConfig();
  return useMemo(() => config.navigation, [config.navigation]);
}

/**
 * Hook to access reports configuration
 */
export function useReportsConfig() {
  const config = useConfig();
  return useMemo(() => config.reports, [config.reports]);
}

/**
 * Hook to access features configuration
 */
export function useFeaturesConfig() {
  const config = useConfig();
  return useMemo(() => config.features, [config.features]);
}

/**
 * Hook to check if a specific feature is enabled
 */
export function useFeature(featureName: keyof MasterConfig['features']): boolean {
  const config = useConfig();
  return useMemo(() => config.features[featureName], [config.features, featureName]);
}

/**
 * Hook to get CSS custom property values from the theme configuration
 * Useful for inline styles that need to match the theme
 */
export function useThemeValues() {
  const config = useConfig();
  const theme = config.theme;
  
  return useMemo(() => ({
    // Colors
    primary: theme.colors.primary,
    accent: theme.colors.accent,
    success: theme.colors.success,
    warning: theme.colors.warning,
    error: theme.colors.error,
    
    // Spacing values for JavaScript calculations
    spacing: {
      1: parseInt(theme.spacing.spacing1),
      2: parseInt(theme.spacing.spacing2),
      3: parseInt(theme.spacing.spacing3),
      4: parseInt(theme.spacing.spacing4),
      5: parseInt(theme.spacing.spacing5),
      6: parseInt(theme.spacing.spacing6),
      8: parseInt(theme.spacing.spacing8),
      12: parseInt(theme.spacing.spacing12),
    },
    
    // Border radius values
    borderRadius: {
      small: theme.borderRadius.radiusSmall,
      medium: theme.borderRadius.radiusMedium,
      large: theme.borderRadius.radiusLarge,
      xlarge: theme.borderRadius.radiusXLarge,
    },
    
    // Typography
    fontFamily: {
      sans: theme.typography.fontFamilySans,
      mono: theme.typography.fontFamilyMono,
    },
  }), [theme]);
}

/**
 * Hook to get responsive breakpoint values
 * Useful for media queries in styled-components or conditional rendering
 */
export function useBreakpoints() {
  const layout = useLayoutConfig();
  
  return useMemo(() => ({
    mobile: parseInt(layout.breakpoints.mobile),
    tablet: parseInt(layout.breakpoints.tablet),
    desktop: parseInt(layout.breakpoints.desktop),
    
    // Helper functions
    isMobile: () => window.innerWidth < parseInt(layout.breakpoints.mobile),
    isTablet: () => {
      const width = window.innerWidth;
      return width >= parseInt(layout.breakpoints.mobile) && width < parseInt(layout.breakpoints.desktop);
    },
    isDesktop: () => window.innerWidth >= parseInt(layout.breakpoints.desktop),
  }), [layout]);
} 