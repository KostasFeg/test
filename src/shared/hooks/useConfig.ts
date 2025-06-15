import { useMemo, useState, useEffect } from 'react';
import type { MasterConfig } from '../config/master.generated';
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
      console.log('📱 useConfig hook: Received config update');
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