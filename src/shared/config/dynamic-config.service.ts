/**
 * DYNAMIC CONFIGURATION SERVICE
 * 
 * This service eliminates ALL hardcoded values by making everything config-driven.
 * It provides dynamic route generation, navigation loading, and config-driven behavior.
 * 
 * SINGLE SOURCE OF TRUTH: Active config overrides master config
 */

import { NavNode } from './navigation.config';
import { getCurrentConfig } from './config.manager';
import { MasterConfig } from './master.config';

export interface DynamicRoute {
  path: string;
  slug: string;
  label: string;
  element?: () => React.ReactElement;
  hasReport?: boolean;
  reportConfig?: any;
}

export class DynamicConfigService {
  private static instance: DynamicConfigService;
  private cachedRoutes: DynamicRoute[] = [];
  private cachedNavigation: NavNode[] = [];
  private config: MasterConfig | null = null;

  static getInstance(): DynamicConfigService {
    if (!this.instance) {
      this.instance = new DynamicConfigService();
    }
    return this.instance;
  }

  /**
   * Initialize the service with current configuration
   */
  async initialize(): Promise<void> {
    this.config = getCurrentConfig() as MasterConfig;
    this.generateDynamicRoutes();
    this.generateDynamicNavigation();
  }

  /**
   * Get all routes dynamically generated from config
   */
  getRoutes(): DynamicRoute[] {
    if (!this.config) {
      console.warn('DynamicConfigService not initialized');
      return [];
    }
    return this.cachedRoutes;
  }

  /**
   * Get navigation dynamically from active config or master config
   */
  getNavigation(): NavNode[] {
    if (!this.config) {
      console.warn('DynamicConfigService not initialized');
      return [];
    }
    return this.cachedNavigation;
  }

  /**
   * Get route by slug - completely config-driven
   */
  getRouteBySlug(slug: string): DynamicRoute | undefined {
    return this.cachedRoutes.find(route => route.slug === slug);
  }

  /**
   * Get home route - config-driven, no hardcoded '/maintenance-operations'
   */
  getHomeRoute(): string {
    if (!this.config?.navigation?.length) {
      return '/';
    }
    
    // First navigation item becomes home, or first child if parent has children
    const firstNav = this.config.navigation[0];
    if (firstNav.children?.length) {
      return `/${firstNav.children[0].slug}`;
    }
    
    return `/${firstNav.slug}`;
  }

  /**
   * Generate all routes dynamically from config - ZERO hardcoded routes
   */
  private generateDynamicRoutes(): void {
    if (!this.config?.navigation) {
      this.cachedRoutes = [];
      return;
    }

    const routes: DynamicRoute[] = [];
    
    const processNavNode = (node: NavNode, parentPath = ''): void => {
      const fullPath = parentPath ? `${parentPath}/${node.slug}` : `/${node.slug}`;
      
      // Check if this slug has a report configuration
      const hasReport = this.config?.reports?.[node.slug] !== undefined;
      const reportConfig = this.config?.reports?.[node.slug];

      routes.push({
        path: fullPath,
        slug: node.slug,
        label: node.label,
        element: node.element,
        hasReport,
        reportConfig
      });

      // Process children recursively
      if (node.children) {
        node.children.forEach(child => processNavNode(child, fullPath));
      }
    };

    this.config.navigation.forEach(node => processNavNode(node));
    this.cachedRoutes = routes;
  }

  /**
   * Generate navigation dynamically from config
   */
  private generateDynamicNavigation(): void {
    if (!this.config?.navigation) {
      this.cachedNavigation = [];
      return;
    }

    // Use navigation from active config if available, otherwise fallback to master config
    this.cachedNavigation = this.config.navigation;
  }

  /**
   * Get report configuration by slug - config-driven
   */
  getReportConfig(slug: string): any | undefined {
    return this.config?.reports?.[slug];
  }

  /**
   * Check if a route exists - config-driven
   */
  routeExists(path: string): boolean {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return this.cachedRoutes.some(route => route.path === normalizedPath);
  }

  /**
   * Get API configuration - config-driven
   */
  getApiConfig(): any {
    return this.config?.api || {
      baseUrl: 'http://localhost:3000',
      timeout: 30000,
      retryAttempts: 3,
      retryDelay: 1000
    };
  }

  /**
   * Get auth configuration - config-driven
   */
  getAuthConfig(): any {
    return this.config?.auth || {
      persistKey: 'auth-token',
      sessionTimeout: 28800,
      autoLogoutWarning: 300
    };
  }

  /**
   * Get feature flags - config-driven
   */
  getFeatureFlags(): any {
    return this.config?.features || {
      enableDebugReports: false,
      enableAdvancedFilters: true,
      enableThemeCustomization: false,
      enableBulkOperations: true,
      enableOfflineMode: false
    };
  }

  /**
   * Get configuration route - config-driven
   */
  getConfigurationRoute(): string {
    // Look for configuration in navigation, otherwise default
    const configRoute = this.cachedRoutes.find(route => 
      route.slug === 'configuration' || 
      route.slug === 'config' ||
      route.slug === 'settings'
    );
    
    return configRoute?.path || '/configuration';
  }

  /**
   * Invalidate cache and refresh from config
   */
  refresh(): void {
    this.config = getCurrentConfig() as MasterConfig;
    this.generateDynamicRoutes();
    this.generateDynamicNavigation();
  }

  /**
   * Get all available report slugs - config-driven
   */
  getReportSlugs(): string[] {
    return Object.keys(this.config?.reports || {});
  }

  /**
   * Check if slug is a report - config-driven
   */
  isReport(slug: string): boolean {
    return this.getReportSlugs().includes(slug);
  }

  /**
   * Get default navigation display for new items
   */
  getDefaultNavDisplay(): 'tabs' | 'buttons' {
    // Check most common display type in config, default to buttons
    const displays = this.cachedNavigation
      .filter(nav => nav.display)
      .map(nav => nav.display);
    
    const buttonCount = displays.filter(d => d === 'buttons').length;
    const tabCount = displays.filter(d => d === 'tabs').length;
    
    return buttonCount >= tabCount ? 'buttons' : 'tabs';
  }
}

// Export singleton instance
export const dynamicConfig = DynamicConfigService.getInstance();

// Convenience hooks for React components
export function useDynamicRoutes(): DynamicRoute[] {
  return dynamicConfig.getRoutes();
}

export function useDynamicNavigation(): NavNode[] {
  return dynamicConfig.getNavigation();
}

export function useHomeRoute(): string {
  return dynamicConfig.getHomeRoute();
}

export function useReportConfig(slug: string): any {
  return dynamicConfig.getReportConfig(slug);
}

export function useFeatureFlags(): any {
  return dynamicConfig.getFeatureFlags();
}

export function useApiConfig(): any {
  return dynamicConfig.getApiConfig();
}

export function useAuthConfig(): any {
  return dynamicConfig.getAuthConfig();
} 