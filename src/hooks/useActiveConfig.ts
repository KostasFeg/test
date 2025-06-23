import { useState, useEffect } from 'react';
import { configManager } from '../shared/config/config.manager';
import type { MasterConfig } from '../shared/config/master.config';

export interface ActiveConfigInfo {
  isActive: boolean;
  hasNavigation: boolean;
  isEmpty: boolean;
}

/**
 * Hook to detect if there's an active configuration loaded
 * Returns information about the config state for conditional rendering
 */
export function useActiveConfig(): ActiveConfigInfo {
  const [configInfo, setConfigInfo] = useState<ActiveConfigInfo>(() => {
    const info = configManager.getActiveConfigInfo();
    const currentConfig = configManager.getCurrentConfig() as MasterConfig;
    
    return {
      isActive: info.isActive,
      hasNavigation: Array.isArray(currentConfig.navigation) && currentConfig.navigation.length > 0,
      isEmpty: !info.isActive && (!currentConfig.navigation || currentConfig.navigation.length === 0)
    };
  });

  useEffect(() => {
    // Subscribe to config changes to update our info
    const unsubscribe = configManager.subscribe((newConfig: MasterConfig) => {
      const info = configManager.getActiveConfigInfo();
      
      setConfigInfo({
        isActive: info.isActive,
        hasNavigation: Array.isArray(newConfig.navigation) && newConfig.navigation.length > 0,
        isEmpty: !info.isActive && (!newConfig.navigation || newConfig.navigation.length === 0)
      });
    });

    return unsubscribe;
  }, []);

  return configInfo;
}

/**
 * Simple hook to check if welcome screen should be shown
 */
export function useShouldShowWelcome(): boolean {
  const configInfo = useActiveConfig();
  
  // Show welcome if:
  // 1. No active config AND no navigation items, OR
  // 2. Active config exists but has no navigation
  return configInfo.isEmpty || (!configInfo.hasNavigation && configInfo.isActive);
} 