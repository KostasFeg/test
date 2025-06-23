/**
 * DYNAMIC ROUTES SYSTEM
 * 
 * This replaces the hardcoded routes.ts file with a config-driven approach.
 * Routes are now generated dynamically from the master configuration.
 * 
 * NO MORE HARDCODED ROUTES!
 */

import { dynamicConfig } from '../config/dynamic-config.service';

/**
 * Get all available routes from configuration
 */
export function getAllRoutes(): string[] {
  return dynamicConfig.getRoutes().map(route => route.path);
}

/**
 * Get route by slug - config-driven
 */
export function getRouteBySlug(slug: string): string | undefined {
  const route = dynamicConfig.getRouteBySlug(slug);
  return route?.path;
}

/**
 * Get home route - config-driven
 */
export function getHomeRoute(): string {
  return dynamicConfig.getHomeRoute();
}

/**
 * Check if route exists - config-driven
 */
export function routeExists(path: string): boolean {
  return dynamicConfig.routeExists(path);
}

/**
 * Get configuration route - config-driven
 */
export function getConfigurationRoute(): string {
  return dynamicConfig.getConfigurationRoute();
}

/**
 * Get all report routes - config-driven
 */
export function getReportRoutes(): string[] {
  return dynamicConfig.getRoutes()
    .filter(route => route.hasReport)
    .map(route => route.path);
}

/**
 * Legacy compatibility layer for existing code
 * These will be gradually phased out as we move to config-driven approach
 */
export const DYNAMIC_ROUTES = {
  get HOME() {
    return getHomeRoute();
  },
  get CONFIGURATION() {
    return getConfigurationRoute();
  },
  // Add more as needed, but prefer using the functions above
};

/**
 * Helper to migrate from hardcoded ROUTES to dynamic routes
 */
export function migrateFromHardcodedRoute(hardcodedPath: string): string {
  // Extract slug from hardcoded path
  const segments = hardcodedPath.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];
  
  // Try to find corresponding route in config
  const configRoute = getRouteBySlug(lastSegment);
  
  // Return config route if found, otherwise fallback to hardcoded
  return configRoute || hardcodedPath;
}

/**
 * Get parent route for a given route
 */
export function getParentRoute(path: string): string | undefined {
  const segments = path.split('/').filter(Boolean);
  if (segments.length <= 1) return undefined;
  
  segments.pop(); // Remove last segment
  return '/' + segments.join('/');
}

/**
 * Get child routes for a given parent route
 */
export function getChildRoutes(parentPath: string): string[] {
  const allRoutes = getAllRoutes();
  return allRoutes.filter(route => {
    const parentRoute = getParentRoute(route);
    return parentRoute === parentPath;
  });
} 