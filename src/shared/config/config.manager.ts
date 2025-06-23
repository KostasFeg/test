import { configPresets, getPresetById, ConfigPreset } from "./config.presets";
import { injectCSSVariablesFromMasterConfig } from "../design-system-integration";
import type { MasterConfig } from "./master.config";
import { defaultConfig } from "./defaultConfig";
import Ajv from "ajv";
import schema from "../../config/master.schema.json";

// ==========================================
// DYNAMIC CONFIGURATION MANAGER
// ==========================================

// The original on-disk override mechanism (folder + polling) has been removed.
// Retain these constants only if other parts of the codebase still reference
// them. Since they are no longer used inside this file we can safely delete
// them to avoid the "declared but never read" TypeScript warning.

const ajv = new Ajv({ allErrors: true });
// compile returns a type-guarding function
// @ts-ignore – json import typing
const validate = ajv.compile(schema);

function deepMerge<T>(base: T, override: Partial<T>): T {
  const out: any = { ...base };
  Object.keys(override || {}).forEach((k) => {
    const key = k as keyof T;
    const val = override[key];
    if (val && typeof val === "object" && !Array.isArray(val)) {
      out[key] = deepMerge((base as any)[key] || {}, val as any);
    } else if (val !== undefined) {
      out[key] = val;
    }
  });
  return out as T;
}

// Remove React element functions from navigation structure so config stays pure JSON
function sanitizeNavigation(nav?: any[]): any[] | undefined {
  if (!Array.isArray(nav)) return nav;
  return nav.map((n) => {
    const { element: _drop, children, ...rest } = n;
    if (children?.length) {
      return { ...rest, children: sanitizeNavigation(children) };
    }
    return rest;
  });
}

export class ConfigManager {
  private current: MasterConfig = defaultConfig;
  private listeners: ((cfg: MasterConfig) => void)[] = [];

  /** Boot-time init: load cached overrides then try file */
  async init() {
    try {
      const cached = localStorage.getItem("active-config-cache");
      if (cached) {
        this.set(JSON.parse(cached));
      }
      this.reloadFromDisk().catch(() => {});
    } catch (_) {}
  }

  getCurrentConfig(): MasterConfig {
    return this.current;
  }

  subscribe(cb: (cfg: MasterConfig) => void) {
    this.listeners.push(cb);
    return () => {
      const i = this.listeners.indexOf(cb);
      if (i >= 0) this.listeners.splice(i, 1);
    };
  }

  /** Validate + merge overrides */
  set(overrides: any) {
    // Accept the "active-config" wrapper format { name, description, config: {...} }
    if (overrides && typeof overrides === "object" && "config" in overrides) {
      overrides = overrides.config;
    }
    const partial: Partial<MasterConfig> = overrides ?? {};
    // strip non-serialisable fields before merge/validate
    const cleanedOverrides: Partial<MasterConfig> = Object.assign({}, partial) as any;
    (cleanedOverrides as any).navigation = sanitizeNavigation((partial as any).navigation);
    const merged: MasterConfig = deepMerge(defaultConfig, cleanedOverrides);
    // Validate a JSON-serialisable snapshot ‒ strip React elements etc. so Ajv
    // doesn't choke while still keeping them for runtime use.
    const serialisableForValidation = Object.assign({}, merged, {
      navigation: sanitizeNavigation(merged.navigation as any),
    }) as MasterConfig;

    if (!validate(serialisableForValidation)) {
      console.error("❌ Config validation failed", validate.errors);
      return;
    }
    this.current = merged;
    // Inject latest CSS variables via design system helper
    try {
      injectCSSVariablesFromMasterConfig(this.current);
    } catch (e) {
      console.warn("Failed to inject CSS variables", e);
    }
    this.listeners.forEach((cb) => cb(this.current));
  }

  updateConfig = this.set.bind(this); // keep old API

  async reloadFromDisk() {
    try {
      const res = await fetch("/active-config/config.json", { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const json = await res.json();
      localStorage.setItem("active-config-cache", JSON.stringify(json));
      this.set(json);
    } catch (e) {
      console.warn("No active-config file", e);
    }
  }

  /**
   * Get the current preset ID
   */
  getCurrentPresetId(): string {
    return "professional"; // Assuming default preset
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

    this.current = this.buildConfigFromPreset(presetId);
    this.injectCSSVariables();
    this.notifyListeners();

    console.log(`🎨 Switched to configuration preset: ${preset.name}`);
  }

  /**
   * Merge arbitrary overrides on top of the *current* configuration.
   * This uses the same deep-merge helper as the rest of the manager so the
   * behaviour is now consistent across presets and manual edits.
   */
  applyOverrides(overrides: Partial<MasterConfig>): void {
    this.current = deepMerge(this.current, overrides);
    this.injectCSSVariables();
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
    if (!preset) return defaultConfig;
    return deepMerge(defaultConfig, preset.overrides as any);
  }

  /**
   * Injects CSS variables into the document automatically
   */
  private injectCSSVariables(): void {
    try {
      // Use the new design system to inject CSS variables
      injectCSSVariablesFromMasterConfig(this.current);
      
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
        listener(this.current);
      } catch (error) {
        console.error("Error in config change listener:", error);
      }
    });
  }

  /* -------- Compatibility helpers used by ActiveConfigManager ---------- */
  /** Information about whether an override is active (mirrors previous API) */
  getActiveConfigInfo() {
    const hasCache = localStorage.getItem("active-config-cache") !== null;
    return {
      isActive: hasCache,
      folderPath: "active-config",
      fileName: "config.json",
      lastModified: 0,
      watchingStatus: false,
      isStaleLocalStorage: false,
    } as const;
  }

  /** Apply a full active-config JSON object (same format as file) */
  setActiveConfig(cfg: any) {
    try {
      localStorage.setItem("active-config-cache", JSON.stringify(cfg));
      this.set(cfg.config ?? cfg);
    } catch (e) {
      console.error("Failed to set active config", e);
    }
  }

  /** Clear any active config overrides and revert to defaults */
  clearActiveConfig() {
    localStorage.removeItem("active-config-cache");
    this.current = defaultConfig;
    try {
      injectCSSVariablesFromMasterConfig(this.current);
    } catch {
      /* ignore */
    }
    this.listeners.forEach(cb => cb(this.current));
  }
}

// Singleton instance
export const configManager = new ConfigManager();

// Convenience functions
export const switchConfigPreset = (presetId: string) => configManager.switchToPreset(presetId);
export const getCurrentConfig = () => configManager.getCurrentConfig();
export const getAvailablePresets = () => configManager.getAvailablePresets();
export const subscribeToConfigChanges = (cb: (c: MasterConfig) => void) => configManager.subscribe(cb);

// Debug: Make configManager available globally for debugging
(window as any).configManager = configManager;

// initialise immediately
configManager.init(); 