import { buildConfig } from "./config.builder";
import { configPresets, getPresetById, ConfigPreset } from "./config.presets";
import { injectCSSVariablesFromMasterConfig } from "../design-system-integration";
import { MasterConfig } from "./master.config";
import { appConfig } from "./config.builder";

// ==========================================
// DYNAMIC CONFIGURATION MANAGER
// ==========================================

const ACTIVE_CONFIG_FOLDER = "active-config";
const CONFIG_FILE_NAME = "config.json";
const WATCH_INTERVAL = 1000; // Check every second

export class ConfigManager {
  private currentPresetId: string = "professional";
  private config: MasterConfig;
  private listeners: ((config: MasterConfig) => void)[] = [];
  private watchTimer: number | null = null;
  private lastConfigModified: number = 0;
  private isWatching: boolean = false;
  private activeConfigPath: string;

  constructor() {
    this.config = appConfig;
    this.activeConfigPath = `${ACTIVE_CONFIG_FOLDER}/${CONFIG_FILE_NAME}`;
    
    // Initialize the system properly and handle async loading
    this.initialize();
  }

  /**
   * Initialize the config manager with proper async handling
   */
  private async initialize(): Promise<void> {
    try {
      // Create the active config directory if it doesn't exist
      await this.initializeActiveConfigFolder();
      
      // Check for existing active config and load it
      await this.loadActiveConfig();
      
      // Start watching for config changes
      this.startWatching();
      
      // Inject CSS variables after all config loading is complete
      this.injectCSSVariables();
    } catch (error) {
      console.warn('Failed to initialize ConfigManager:', error);
      // Fallback to default config
      this.injectCSSVariables();
    }
  }

  /**
   * Initialize the active config folder and create example config
   */
  private async initializeActiveConfigFolder(): Promise<void> {
    try {
      // Check if running in browser environment
      if (typeof window === 'undefined') return;
      
      // For web applications, we'll use localStorage to simulate file system
      const activeConfigExists = localStorage.getItem('active-config-exists');
      if (!activeConfigExists) {
        // Create example config
        const exampleConfig = {
          name: "Custom Active Config",
          description: "Place your config.json file in the active-config folder to use custom configuration",
          config: {
            theme: {
              colors: {
                primary: "#007bff",
                secondary: "#6c757d"
              }
            },
            branding: {
              company: {
                name: "Your Company Name"
              }
            }
          }
        };
        
        localStorage.setItem('active-config-example', JSON.stringify(exampleConfig, null, 2));
        localStorage.setItem('active-config-exists', 'true');
        
        console.log('📁 Active config folder initialized. Example config created in localStorage.');
        console.log('💡 To use active config system:');
        console.log('   1. Create a config.json file in the active-config folder');
        console.log('   2. The system will automatically detect and apply it');
      }
    } catch (error) {
      console.warn('Failed to initialize active config folder:', error);
    }
  }

    /**
   * Load configuration from the active config folder if it exists
   */
  private async loadActiveConfig(): Promise<void> {
    try {
      // First, try to load from physical file system (for development/local usage)
      const fileSystemConfigLoaded = await this.loadFromFileSystem();
      
      if (fileSystemConfigLoaded) {
        // File system config was loaded successfully, we're done
        return;
      }
      
      // No file system config found, check localStorage (for web environment persistence)
      const activeConfigData = localStorage.getItem('active-config-data');
      if (activeConfigData) {
        // We have localStorage data but no file system config
        // This could mean the config.json was deleted but localStorage persists
        console.log('⚠️ Found localStorage config but no file system config - this may be stale data');
        
        const configData = JSON.parse(activeConfigData);
        const timestamp = localStorage.getItem('active-config-timestamp');
        
        if (timestamp) {
          this.lastConfigModified = parseInt(timestamp);
        }
        
        // Apply the active config but warn about potential staleness
        this.applyActiveConfig(configData);
        console.log('✅ Active config loaded from localStorage (no file system config found)');
        console.log('💡 To clear this cached config, use the "Clear Active Config" button or delete localStorage data');
        return;
      }
      
      // No config found anywhere, stay with default
      console.log('📋 No active config found, using default configuration');
      
    } catch (error) {
      console.warn('Failed to load active config:', error);
    }
  }

  /**
   * Load config from physical file system (when possible)
   */
  private async loadFromFileSystem(): Promise<boolean> {
    try {
      // Try to fetch the config file via HTTP (works in development)
      const response = await fetch('/active-config/config.json');
      if (response.ok) {
        const configData = await response.json();
        
        // Get last modified from response headers if available
        const lastModified = response.headers.get('last-modified');
        if (lastModified) {
          this.lastConfigModified = new Date(lastModified).getTime();
        }
        
        // Apply the active config
        this.applyActiveConfig(configData);
        console.log('✅ Active config loaded from file system:', configData.name || 'Unnamed');
        
        // Store in localStorage as backup
        localStorage.setItem('active-config-data', JSON.stringify(configData));
        localStorage.setItem('active-config-timestamp', this.lastConfigModified.toString());
        
        return true; // Successfully loaded from file system
      }
    } catch (error) {
      // File system access not available, continue with localStorage
      console.log('📁 File system config not available, using localStorage fallback');
    }
    return false; // No file system config found
  }

  /**
   * Apply active configuration data
   */
  private applyActiveConfig(configData: any): void {
    if (configData.config) {
      console.log('🎨 Applying active config data:', configData.name || 'Unnamed');
      console.log('🎨 Config overrides:', configData.config);
      // Use the config builder to properly handle the active config
      this.config = buildConfig(configData.config);
      this.injectCSSVariables();
      this.notifyListeners();
      
      if (configData.name) {
        console.log(`🎨 Applied active config: ${configData.name}`);
      }
    }
  }

  /**
   * Start watching for changes in the active config folder
   */
  private startWatching(): void {
    if (this.isWatching) return;
    
    this.isWatching = true;
    this.watchTimer = window.setInterval(() => {
      this.checkForConfigChanges();
    }, WATCH_INTERVAL);
    
    console.log('👀 Started watching for active config changes');
  }

  /**
   * Stop watching for config changes
   */
  private stopWatching(): void {
    if (this.watchTimer) {
      clearInterval(this.watchTimer);
      this.watchTimer = null;
    }
    this.isWatching = false;
    console.log('⏹️ Stopped watching for active config changes');
  }

  /**
   * Check for changes in the active config
   */
  private async checkForConfigChanges(): Promise<void> {
    try {
      // First, check file system for changes
      await this.checkFileSystemChanges();
      
      // Then check localStorage for changes (web environment)
      const timestamp = localStorage.getItem('active-config-timestamp');
      if (timestamp) {
        const currentTimestamp = parseInt(timestamp);
        if (currentTimestamp > this.lastConfigModified) {
          this.lastConfigModified = currentTimestamp;
          await this.loadActiveConfig();
        }
      }
      
    } catch (error) {
      // Silently handle errors to avoid spamming console
    }
  }

  /**
   * Check for file system changes
   */
  private async checkFileSystemChanges(): Promise<void> {
    try {
      const response = await fetch('/active-config/config.json', { 
        method: 'HEAD' // Just check headers, don't download content
      });
      
      if (response.ok) {
        const lastModified = response.headers.get('last-modified');
        if (lastModified) {
          const modifiedTime = new Date(lastModified).getTime();
          if (modifiedTime > this.lastConfigModified) {
            console.log('🔄 Detected file system config change, reloading...');
            await this.loadFromFileSystem();
          }
        }
      } else if (response.status === 404) {
        // Config file was deleted from file system
        const hasLocalStorageConfig = localStorage.getItem('active-config-data') !== null;
        if (hasLocalStorageConfig) {
          console.log('🗑️ File system config was deleted but localStorage config exists');
          console.log('💡 You can clear the cached config using the "Clear Active Config" button');
          // We could auto-clear here, but let's be conservative and let user decide
          // this.clearActiveConfig();
        }
      }
    } catch (error) {
      // File system not available, that's okay
    }
  }

  /**
   * Manually set active config (for web environment)
   */
  setActiveConfig(configData: any): void {
    try {
      localStorage.setItem('active-config-data', JSON.stringify(configData));
      localStorage.setItem('active-config-timestamp', Date.now().toString());
      
      this.applyActiveConfig(configData);
      console.log('✅ Active config updated manually');
    } catch (error) {
      console.error('Failed to set active config:', error);
    }
  }

  /**
   * Clear active config and revert to default
   */
  clearActiveConfig(): void {
    localStorage.removeItem('active-config-data');
    localStorage.removeItem('active-config-timestamp');
    
    // Rebuild config from default
    this.config = appConfig;
    this.injectCSSVariables();
    this.notifyListeners();
    
    console.log('🔄 Active config cleared, reverted to default');
  }

  /**
   * Get information about the active config system
   */
  getActiveConfigInfo(): {
    isActive: boolean;
    folderPath: string;
    fileName: string;
    lastModified: number;
    watchingStatus: boolean;
    isStaleLocalStorage: boolean;
  } {
    const hasLocalStorageConfig = localStorage.getItem('active-config-data') !== null;
    
    return {
      isActive: hasLocalStorageConfig,
      folderPath: ACTIVE_CONFIG_FOLDER,
      fileName: CONFIG_FILE_NAME,
      lastModified: this.lastConfigModified,
      watchingStatus: this.isWatching,
      isStaleLocalStorage: hasLocalStorageConfig && this.lastConfigModified === 0 // localStorage exists but no recent file system activity
    };
  }

  /**
   * Check if current config might be stale localStorage data
   */
  isConfigStale(): boolean {
    const hasLocalStorageConfig = localStorage.getItem('active-config-data') !== null;
    return hasLocalStorageConfig && this.lastConfigModified === 0;
  }

  /**
   * Get the current active configuration
   */
  getCurrentConfig(): MasterConfig {
    return this.config;
  }

  /**
   * Get the current preset ID
   */
  getCurrentPresetId(): string {
    return this.currentPresetId;
  }

  /**
   * Get all available presets
   */
  getAvailablePresets(): ConfigPreset[] {
    return configPresets;
  }

  /**
   * Switch to a different configuration preset
   */
  switchToPreset(presetId: string): void {
    const preset = getPresetById(presetId);
    if (!preset) {
      console.warn(`Configuration preset "${presetId}" not found`);
      return;
    }

    this.currentPresetId = presetId;
    this.config = this.buildConfigFromPreset(presetId);
    this.injectCSSVariables();
    this.notifyListeners();

    console.log(`🎨 Switched to configuration preset: ${preset.name}`);
  }

  /**
   * Apply custom overrides on top of the current preset
   */
  applyOverrides(overrides: any): void {
    const currentPreset = getPresetById(this.currentPresetId);
    if (currentPreset) {
      const mergedOverrides = this.deepMerge(currentPreset.overrides, overrides);
      this.config = buildConfig(mergedOverrides);
      this.injectCSSVariables();
      this.notifyListeners();
    }
  }

  /**
   * Subscribe to configuration changes
   */
  subscribe(listener: (config: MasterConfig) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Update the current configuration directly
   */
  updateConfig(newConfig: Partial<MasterConfig>): void {
    this.config = this.deepMerge(this.config, newConfig);
    
    // Automatically inject CSS variables when config changes
    this.injectCSSVariables();
    
    // Notify listeners
    this.notifyListeners();
  }

  /**
   * Reset to default configuration
   */
  resetToDefault(): void {
    this.switchToPreset("professional");
  }

  // Private methods
  private buildConfigFromPreset(presetId: string): MasterConfig {
    const preset = getPresetById(presetId);
    return preset ? buildConfig(preset.overrides) : buildConfig();
  }

  /**
   * Injects CSS variables into the document automatically
   */
  private injectCSSVariables(): void {
    try {
      // Use the new design system to inject CSS variables
      injectCSSVariablesFromMasterConfig(this.config);
      
      console.log('🎨 CSS variables updated from configuration using new design system');
    } catch (error) {
      console.warn('Failed to inject CSS variables:', error);
    }
  }

  /**
   * Force regeneration and injection of CSS variables
   */
  refreshCSSVariables(): void {
    this.injectCSSVariables();
  }

  private notifyListeners(): void {
    console.log('🔔 Notifying', this.listeners.length, 'config listeners');
    this.listeners.forEach(listener => {
      try {
        listener(this.config);
      } catch (error) {
        console.error("Error in config change listener:", error);
      }
    });
  }

  private deepMerge(target: any, source: any): any {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] !== undefined) {
        if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
          result[key] = this.deepMerge(target[key] || {}, source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }
    
    return result;
  }

  /**
   * Force reload config from file system (debug helper)
   */
  async forceReloadFromFileSystem(): Promise<void> {
    console.log('🔄 Force reloading config from file system...');
    
    // Clear localStorage first
    localStorage.removeItem('active-config-data');
    localStorage.removeItem('active-config-timestamp');
    
    // Try to load from file system
    const loaded = await this.loadFromFileSystem();
    if (!loaded) {
      console.log('❌ Failed to load from file system');
    }
  }
}

// Singleton instance
export const configManager = new ConfigManager();

// Convenience functions
export const switchConfigPreset = (presetId: string) => configManager.switchToPreset(presetId);
export const getCurrentConfig = () => configManager.getCurrentConfig();
export const getAvailablePresets = () => configManager.getAvailablePresets();
export const subscribeToConfigChanges = (listener: (config: MasterConfig) => void) => configManager.subscribe(listener);
export const forceReloadConfig = () => configManager.forceReloadFromFileSystem();

// Debug: Make configManager available globally for debugging
(window as any).configManager = configManager; 