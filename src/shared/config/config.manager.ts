import { buildConfig } from "./config.builder";
import { configPresets, getPresetById, ConfigPreset } from "./config.presets";
import { injectCSSVariables, generateCSSVariables } from "./css-variables.generator";
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
    
    // Create the active config directory if it doesn't exist
    this.initializeActiveConfigFolder();
    
    // Check for existing active config and load it
    this.loadActiveConfig();
    
    // Start watching for config changes
    this.startWatching();
    
    // Inject CSS variables on startup
    this.injectCSSVariables();
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
      await this.loadFromFileSystem();
      
      // Fallback to localStorage (for web environment persistence)
      const activeConfigData = localStorage.getItem('active-config-data');
      if (activeConfigData) {
        const configData = JSON.parse(activeConfigData);
        const timestamp = localStorage.getItem('active-config-timestamp');
        
        if (timestamp) {
          this.lastConfigModified = parseInt(timestamp);
        }
        
        // Apply the active config
        this.applyActiveConfig(configData);
        console.log('✅ Active config loaded successfully from localStorage');
        return;
      }
      
    } catch (error) {
      console.warn('Failed to load active config:', error);
    }
  }

  /**
   * Load config from physical file system (when possible)
   */
  private async loadFromFileSystem(): Promise<void> {
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
        
        return;
      }
    } catch (error) {
      // File system access not available, continue with localStorage
      console.log('📁 File system config not available, using localStorage fallback');
    }
  }

  /**
   * Apply active configuration data
   */
  private applyActiveConfig(configData: any): void {
    if (configData.config) {
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
  } {
    return {
      isActive: localStorage.getItem('active-config-data') !== null,
      folderPath: ACTIVE_CONFIG_FOLDER,
      fileName: CONFIG_FILE_NAME,
      lastModified: this.lastConfigModified,
      watchingStatus: this.isWatching
    };
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
      injectCSSVariables(this.config);
      
      // Also store the CSS variables in localStorage for SSR/hydration
      const cssVars = generateCSSVariables(this.config);
      localStorage.setItem('app-css-variables', cssVars);
      
      console.log('🎨 CSS variables updated from configuration');
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
}

// Singleton instance
export const configManager = new ConfigManager();

// Convenience functions
export const switchConfigPreset = (presetId: string) => configManager.switchToPreset(presetId);
export const getCurrentConfig = () => configManager.getCurrentConfig();
export const getAvailablePresets = () => configManager.getAvailablePresets();
export const subscribeToConfigChanges = (listener: (config: MasterConfig) => void) => configManager.subscribe(listener); 