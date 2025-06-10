import React, { useState, useCallback, useEffect } from "react";
import { MasterConfig } from "../../shared/config/master.config";
import { useConfig } from "../../shared/hooks/useConfig";
import styles from "./ConfigEditor.module.scss";
import { configManager } from "../../shared/config/config.manager";
import { generateColorPalette } from "../../shared/utils/colorUtils";
import ActiveConfigManager from "./ActiveConfigManager";
import "./ConfigEditor.scss";

interface ImportedConfig {
  name: string;
  description: string;
  config: Partial<MasterConfig>;
  isBuiltIn?: boolean;
  savedAt?: string;
}

interface ConfigEditorProps {
  className?: string;
}

const ConfigEditor: React.FC<ConfigEditorProps> = ({ className }) => {
  const currentConfig = useConfig();
  const [editedConfig, setEditedConfig] = useState<MasterConfig>(currentConfig);
  const [activeSection, setActiveSection] = useState<string>("active-config");
  const [isDragActive, setIsDragActive] = useState(false);
  const [importedConfigs, setImportedConfigs] = useState<ImportedConfig[]>([]);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [availableConfigs, setAvailableConfigs] = useState<ImportedConfig[]>(
    []
  );
  const [showProfileManager, setShowProfileManager] = useState(false);

  // Color utility functions
  const lightenColor = (hex: string, percent: number): string => {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  };

  const darkenColor = (hex: string, percent: number): string => {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = ((num >> 8) & 0x00ff) - amt;
    const B = (num & 0x0000ff) - amt;
    return (
      "#" +
      (
        0x1000000 +
        (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
        (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
        (B > 255 ? 255 : B < 0 ? 0 : B)
      )
        .toString(16)
        .slice(1)
    );
  };

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem("config-editor-state", JSON.stringify(editedConfig));
  }, [editedConfig]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("config-editor-state");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setEditedConfig(parsed);
      } catch (e) {
        console.warn("Failed to load saved config:", e);
      }
    }
  }, []);

  // Apply configuration changes in real-time
  const handleConfigChange = useCallback(
    (path: string, value: any) => {
      const newConfig = { ...editedConfig };
      const keys = path.split(".");
      let current: any = newConfig;

      // Navigate to the parent object
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }

      // Set the value
      current[keys[keys.length - 1]] = value;

      // Validate the change
      const error = validateConfigValue(path, value);
      if (error) {
        setValidationErrors((prev) => ({ ...prev, [path]: error }));
      } else {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[path];
          return newErrors;
        });
      }

      setEditedConfig(newConfig);
      setHasUnsavedChanges(true);
    },
    [editedConfig]
  );

  // Validation function
  const validateConfigValue = (path: string, value: any): string | null => {
    if (path.includes("colors.") && typeof value === "string") {
      const colorRegex = /^#[0-9A-Fa-f]{6}$|^rgb\(|^rgba\(|^hsl\(|^hsla\(/;
      if (!colorRegex.test(value)) {
        return "Invalid color format. Use hex, rgb, rgba, hsl, or hsla.";
      }
    }

    if (
      path.includes("timeout") ||
      path.includes("retryAttempts") ||
      path.includes("retryDelay")
    ) {
      if (typeof value !== "number" || value < 0) {
        return "Must be a positive number.";
      }
    }

    if (path.includes("baseUrl") && typeof value === "string") {
      try {
        new URL(value);
      } catch {
        return "Must be a valid URL.";
      }
    }

    return null;
  };

  // File handling
  const handleFileImport = useCallback((files: FileList) => {
    Array.from(files).forEach((file) => {
      if (file.type === "application/json" || file.name.endsWith(".json")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const imported: ImportedConfig = JSON.parse(
              e.target?.result as string
            );
            setImportedConfigs((prev) => [...prev, imported]);
          } catch (error) {
            alert("Invalid JSON file format");
          }
        };
        reader.readAsText(file);
      }
    });
  }, []);

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragActive(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragActive(false);
      const files = e.dataTransfer.files;
      handleFileImport(files);
    },
    [handleFileImport]
  );

  // Load available configurations from localStorage and samples
  const loadAvailableConfigs = useCallback(async () => {
    try {
      const configs: ImportedConfig[] = [];

      // Load built-in sample configurations
      const sampleConfigs = ["demo-config.json"];

      for (const configFile of sampleConfigs) {
        try {
          const response = await fetch(`/sample-configs/${configFile}`);
          if (response.ok) {
            const config = await response.json();
            // Mark as built-in sample
            config.isBuiltIn = true;
            configs.push(config);
          }
        } catch (error) {
          console.warn(`Failed to load ${configFile}:`, error);
        }
      }

      // Load user-saved configurations from localStorage
      try {
        const savedConfigs = localStorage.getItem("saved-configurations");
        if (savedConfigs) {
          const userConfigs: ImportedConfig[] = JSON.parse(savedConfigs);
          // Mark as user-saved and add to list
          userConfigs.forEach((config) => {
            config.isBuiltIn = false;
            config.savedAt = config.savedAt || new Date().toISOString();
          });
          configs.push(...userConfigs);
        }
      } catch (error) {
        console.warn(
          "Failed to load saved configurations from localStorage:",
          error
        );
      }

      setAvailableConfigs(configs);
    } catch (error) {
      console.error("Failed to load available configurations:", error);
    }
  }, []);

  // Load available configs on mount
  useEffect(() => {
    loadAvailableConfigs();
  }, [loadAvailableConfigs]);

  // Apply imported configuration
  const applyImportedConfig = useCallback(
    (importedConfig: ImportedConfig) => {
      const mergedConfig = { ...editedConfig, ...importedConfig.config };
      setEditedConfig(mergedConfig);
      configManager.updateConfig(mergedConfig);
      setHasUnsavedChanges(false);
    },
    [editedConfig]
  );

  // Apply current changes
  const applyChanges = useCallback(() => {
    if (Object.keys(validationErrors).length === 0) {
      configManager.updateConfig(editedConfig);
      setHasUnsavedChanges(false);
    }
  }, [editedConfig, validationErrors]);

  // Save configuration to localStorage
  const saveConfigToStorage = useCallback((config: ImportedConfig) => {
    try {
      const savedConfigs = localStorage.getItem("saved-configurations");
      const configs: ImportedConfig[] = savedConfigs
        ? JSON.parse(savedConfigs)
        : [];

      // Check if config with same name exists
      const existingIndex = configs.findIndex((c) => c.name === config.name);
      if (existingIndex >= 0) {
        // Update existing config
        configs[existingIndex] = config;
      } else {
        // Add new config
        configs.push(config);
      }

      localStorage.setItem("saved-configurations", JSON.stringify(configs));
      return true;
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
      return false;
    }
  }, []);

  // Export configuration with localStorage persistence
  const exportConfig = useCallback(async () => {
    const configName = prompt(
      "Enter a name for this configuration:",
      `Custom Config ${new Date().toLocaleDateString()}`
    );
    if (!configName) return;

    const exportData: ImportedConfig = {
      name: configName,
      description: `Custom configuration created on ${new Date().toLocaleString()}`,
      config: editedConfig,
      isBuiltIn: false,
      savedAt: new Date().toISOString(),
    };

    try {
      // Save to localStorage
      const saved = saveConfigToStorage(exportData);
      if (!saved) {
        throw new Error("Failed to save to localStorage");
      }

      // Update available configs immediately
      setAvailableConfigs((prev) => {
        const filtered = prev.filter((c) => c.name !== configName);
        return [...filtered, exportData];
      });

      // Also trigger a browser download as backup
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${configName
        .replace(/[^a-zA-Z0-9]/g, "-")
        .toLowerCase()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert(
        `Configuration "${configName}" saved successfully! It persists across browser sessions and is available in the Profile Manager.`
      );
    } catch (error) {
      console.error("Failed to save configuration:", error);
      alert("Failed to save configuration. Please try again.");
    }
  }, [editedConfig, saveConfigToStorage]);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    if (confirm("Are you sure you want to reset all settings to defaults?")) {
      setEditedConfig(currentConfig);
      configManager.updateConfig(currentConfig);
      localStorage.removeItem("config-editor-state");
      setHasUnsavedChanges(false);
    }
  }, [currentConfig]);

  // Get human-readable label for a configuration variable
  const getVariableLabel = (key: string): string => {
    const labelMap: Record<string, string> = {
      // Essential Theme Colors
      "theme.colors.primary": "Primary Color",
      "theme.colors.secondary": "Secondary Color",
      "theme.colors.accent": "Accent Color",
      "theme.colors.success": "Success Color",
      "theme.colors.warning": "Warning Color",
      "theme.colors.error": "Error Color",
      "theme.colors.info": "Info Color",

      // Essential Neutrals - Core grey colors that dramatically affect the app
      "theme.colors.grey100": "Light Background",
      "theme.colors.grey200": "Border Color",
      "theme.colors.grey700": "Secondary Text",
      "theme.colors.grey900": "Primary Text",

      // Typography
      "theme.typography.fontFamilySans": "Sans-serif Font",
      "theme.typography.fontFamilyMono": "Monospace Font",
      "theme.typography.fontSizeSmall": "Small Font Size",
      "theme.typography.fontSizeMedium": "Medium Font Size",
      "theme.typography.fontSizeLarge": "Large Font Size",
      "theme.typography.fontSizeXLarge": "Extra Large Font Size",

      // Spacing
      "theme.spacing.spacing1": "Spacing 1",
      "theme.spacing.spacing2": "Spacing 2",
      "theme.spacing.spacing3": "Spacing 3",
      "theme.spacing.spacing4": "Spacing 4",
      "theme.spacing.spacing5": "Spacing 5",
      "theme.spacing.spacing6": "Spacing 6",
      "theme.spacing.spacing8": "Spacing 8",
      "theme.spacing.spacing12": "Spacing 12",

      // Border Radius
      "theme.borderRadius.radiusSmall": "Small Border Radius",
      "theme.borderRadius.radiusMedium": "Medium Border Radius",
      "theme.borderRadius.radiusLarge": "Large Border Radius",
      "theme.borderRadius.radiusXLarge": "Extra Large Border Radius",

      // Shadows
      "theme.shadows.shadowSmall": "Small Shadow",
      "theme.shadows.shadowMedium": "Medium Shadow",
      "theme.shadows.shadowLarge": "Large Shadow",
      "theme.shadows.shadowXLarge": "Extra Large Shadow",
      "theme.shadows.shadowInner": "Inner Shadow",
      "theme.shadows.shadowFocus": "Focus Shadow",

      // Transitions
      "theme.transitions.transitionFast": "Fast Transition",
      "theme.transitions.transitionMedium": "Medium Transition",
      "theme.transitions.transitionSlow": "Slow Transition",
      "theme.transitions.easingDefault": "Default Easing",
      "theme.transitions.easingBounce": "Bounce Easing",
      "theme.transitions.easingSharp": "Sharp Easing",

      // Layout
      "layout.sidebarWidth.buttons": "Sidebar Width (Buttons)",
      "layout.sidebarWidth.labels": "Sidebar Width (Labels)",
      "layout.topBarHeight": "Top Bar Height",
      "layout.bottomBarHeight": "Bottom Bar Height",

      // UI Behavior
      "ui.defaultSidebarVariant": "Default Sidebar Style",
      "ui.defaultShowBottomBar": "Show Bottom Bar",
      "ui.animationFast": "Fast Animation Duration",
      "ui.animationMedium": "Medium Animation Duration",
      "ui.animationSlow": "Slow Animation Duration",

      // Features
      "features.enableDebugReports": "Debug Reports",
      "features.enableAdvancedFilters": "Advanced Filters",
      "features.enableThemeCustomization": "Theme Customization",
      "features.enableBulkOperations": "Bulk Operations",
      "features.enableOfflineMode": "Offline Mode",

      // Branding
      "branding.company.name": "Company Name",
      "branding.app.name": "Application Name",
      "branding.app.version": "Application Version",

      // API
      "api.baseUrl": "API Base URL",
      "api.timeout": "Request Timeout (ms)",
      "api.retryAttempts": "Retry Attempts",
      "api.retryDelay": "Retry Delay (ms)",

      // Auth
      "auth.sessionTimeout": "Session Timeout (minutes)",
      "auth.persistUserSession": "Persist User Session",
      "auth.tokenStorageKey": "Token Storage Key",
      "auth.refreshTokenKey": "Refresh Token Key",
    };

    return labelMap[key] || key.split(".").pop() || key;
  };

  // Render input field based on type
  const renderInput = (
    key: string,
    value: any,
    type: "string" | "number" | "boolean" | "color"
  ) => {
    const label = getVariableLabel(key);
    const validationError = validateConfigValue(key, value);

    return (
      <div key={key} className="config-item">
        <label htmlFor={key}>{label}</label>

        {type === "color" && (
          <div className="color-input-wrapper">
            <input
              type="color"
              id={key}
              value={value}
              onChange={(e) => handleConfigChange(key, e.target.value)}
              className="color-input"
            />
            <input
              type="text"
              value={value}
              onChange={(e) => handleConfigChange(key, e.target.value)}
              className="color-text-input"
              placeholder="#000000"
            />
          </div>
        )}

        {type === "string" && (
          <input
            type="text"
            id={key}
            value={value}
            onChange={(e) => handleConfigChange(key, e.target.value)}
            className={validationError ? "error" : ""}
          />
        )}

        {type === "number" && (
          <input
            type="number"
            id={key}
            value={value}
            onChange={(e) =>
              handleConfigChange(key, parseFloat(e.target.value))
            }
            className={validationError ? "error" : ""}
          />
        )}

        {type === "boolean" && (
          <input
            type="checkbox"
            id={key}
            checked={value}
            onChange={(e) => handleConfigChange(key, e.target.checked)}
          />
        )}

        {validationError && (
          <span className="error-message">{validationError}</span>
        )}
      </div>
    );
  };

  // Get nested value from config
  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  };

  const sections = [
    { key: "active-config", label: "Active Config System", icon: "🚀" },
    { key: "theme.colors", label: "Colors & Theming", icon: "🎨" },
    { key: "theme.shadows", label: "Shadows & Elevation", icon: "🌟" },
    { key: "theme.transitions", label: "Transitions & Animations", icon: "⚡" },
    { key: "theme.interactive", label: "Interactive States", icon: "🖱️" },
    { key: "layout", label: "Layout & Navigation", icon: "📐" },
    { key: "ui.behavior", label: "Animations & Feel", icon: "⚡" },
    { key: "branding", label: "Branding & Identity", icon: "🏢" },
    { key: "advanced", label: "Advanced Settings", icon: "⚙️" },
  ];

  return (
    <div className={`${styles.configEditor} ${className || ""}`}>
      <div className={styles.header}>
        <h2>Configuration Editor</h2>
        <div className={styles.headerActions}>
          <button
            onClick={() => setShowProfileManager(!showProfileManager)}
            className="btn-profiles"
          >
            🎨 Profiles ({availableConfigs.length})
          </button>
          <button
            onClick={applyChanges}
            disabled={
              !hasUnsavedChanges || Object.keys(validationErrors).length > 0
            }
            className={`btn-apply ${hasUnsavedChanges ? "primary" : ""}`}
          >
            ✅ Apply Changes {hasUnsavedChanges && "(Unsaved)"}
          </button>
          <button onClick={exportConfig} className="btn-export">
            💾 Save Config
          </button>
          <button onClick={resetToDefaults} className="btn-reset">
            🔄 Reset to Defaults
          </button>
        </div>
      </div>

      {/* Profile Manager */}
      {showProfileManager && (
        <div className={styles.profileManager}>
          <div className={styles.profileHeader}>
            <h3>Configuration Profiles</h3>
            <button
              onClick={() => setShowProfileManager(false)}
              className={styles.closeButton}
            >
              ×
            </button>
          </div>
          <div className={styles.profileGrid}>
            {availableConfigs.length === 0 ? (
              <div className={styles.noProfiles}>
                <p>No saved configurations found.</p>
                <p>
                  Export your current configuration to create your first
                  profile!
                </p>
              </div>
            ) : (
              availableConfigs.map((config, index) => (
                <div key={index} className={styles.profileCard}>
                  <div className={styles.profileInfo}>
                    <div className={styles.profileTitle}>
                      <h4>{config.name}</h4>
                      {config.isBuiltIn ? (
                        <span className={styles.builtInBadge}>Built-in</span>
                      ) : (
                        <span className={styles.userBadge}>User Saved</span>
                      )}
                    </div>
                    <p>{config.description}</p>
                    {config.savedAt && (
                      <small className={styles.savedDate}>
                        Saved: {new Date(config.savedAt).toLocaleDateString()}
                      </small>
                    )}
                  </div>
                  <div className={styles.profileActions}>
                    <button
                      onClick={() => {
                        const mergedConfig = {
                          ...editedConfig,
                          ...config.config,
                        };
                        setEditedConfig(mergedConfig);
                        configManager.updateConfig(mergedConfig);
                        setHasUnsavedChanges(false);
                        setShowProfileManager(false);
                        alert(`Applied configuration: ${config.name}`);
                      }}
                      className={styles.applyButton}
                    >
                      Apply
                    </button>
                    <button
                      onClick={() => {
                        const blob = new Blob(
                          [JSON.stringify(config, null, 2)],
                          {
                            type: "application/json",
                          }
                        );
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `${config.name
                          .replace(/[^a-zA-Z0-9]/g, "-")
                          .toLowerCase()}.json`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                      className={styles.downloadButton}
                    >
                      Download
                    </button>
                    {!config.isBuiltIn && (
                      <button
                        onClick={() => {
                          if (
                            confirm(
                              `Are you sure you want to delete "${config.name}"?`
                            )
                          ) {
                            // Remove from localStorage
                            try {
                              const savedConfigs = localStorage.getItem(
                                "saved-configurations"
                              );
                              if (savedConfigs) {
                                const configs: ImportedConfig[] =
                                  JSON.parse(savedConfigs);
                                const filtered = configs.filter(
                                  (c) => c.name !== config.name
                                );
                                localStorage.setItem(
                                  "saved-configurations",
                                  JSON.stringify(filtered)
                                );

                                // Update UI
                                setAvailableConfigs((prev) =>
                                  prev.filter((c) => c.name !== config.name)
                                );
                                alert(
                                  `Configuration "${config.name}" deleted successfully.`
                                );
                              }
                            } catch (error) {
                              console.error(
                                "Failed to delete configuration:",
                                error
                              );
                              alert("Failed to delete configuration.");
                            }
                          }
                        }}
                        className={styles.deleteButton}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className={styles.profileFooter}>
            <div className={styles.dragDropArea}>
              <p>📁 Drag & drop JSON configuration files here to import them</p>
              <input
                type="file"
                accept=".json"
                multiple
                onChange={(e) =>
                  e.target.files && handleFileImport(e.target.files)
                }
                className={styles.fileInput}
              />
            </div>
          </div>
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.navigation}>
          <nav className={styles.sectionNav}>
            {sections.map((section) => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={`${styles.navItem} ${
                  activeSection === section.key ? styles.active : ""
                }`}
              >
                <span className={styles.navIcon}>{section.icon}</span>
                <span className={styles.navLabel}>{section.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className={styles.editor}>
          {/* Active Config System */}
          {activeSection === "active-config" && (
            <div className="config-section">
              <ActiveConfigManager />
            </div>
          )}

          {/* Colors & Theming */}
          {activeSection === "theme.colors" && (
            <div className="config-section">
              <h2 className={styles.sectionHeader}>🎨 Colors & Theming</h2>
              <p className="section-description">
                Change these colors to transform your entire application theme.
                The primary color affects buttons, links, and key interface
                elements.
              </p>

              <div className="config-subsections">
                <div className="subsection">
                  <h3>Brand Colors</h3>
                  <p className="subsection-description">
                    Define your brand identity - all other interface colors are
                    automatically derived
                  </p>
                  <div className="config-grid">
                    {renderInput(
                      "theme.colors.primary",
                      editedConfig.theme.colors.primary,
                      "color"
                    )}
                    {renderInput(
                      "theme.colors.secondary",
                      editedConfig.theme.colors.secondary,
                      "color"
                    )}
                    {renderInput(
                      "theme.colors.accent",
                      editedConfig.theme.colors.accent,
                      "color"
                    )}
                  </div>
                </div>

                <div className="subsection">
                  <h3>Status Colors</h3>
                  <p className="subsection-description">
                    Colors for user feedback and notifications
                  </p>
                  <div className="config-grid">
                    {renderInput(
                      "theme.colors.success",
                      editedConfig.theme.colors.success,
                      "color"
                    )}
                    {renderInput(
                      "theme.colors.warning",
                      editedConfig.theme.colors.warning,
                      "color"
                    )}
                    {renderInput(
                      "theme.colors.error",
                      editedConfig.theme.colors.error,
                      "color"
                    )}
                    {renderInput(
                      "theme.colors.info",
                      editedConfig.theme.colors.info,
                      "color"
                    )}
                  </div>
                </div>

                <div className="subsection">
                  <h3>Essential Neutrals</h3>
                  <p className="subsection-description">
                    Core neutral colors that define your interface foundation
                  </p>
                  <div className="config-grid">
                    {renderInput(
                      "theme.colors.grey100",
                      editedConfig.theme.colors.grey100 || "#f5f5f5",
                      "color"
                    )}
                    {renderInput(
                      "theme.colors.grey200",
                      editedConfig.theme.colors.grey200 || "#e5e5e5",
                      "color"
                    )}
                    {renderInput(
                      "theme.colors.grey700",
                      editedConfig.theme.colors.grey700 || "#404040",
                      "color"
                    )}
                    {renderInput(
                      "theme.colors.grey900",
                      editedConfig.theme.colors.grey900 || "#171717",
                      "color"
                    )}
                  </div>
                </div>

                <div className="subsection">
                  <h3>✨ Smart Color System</h3>
                  <div className="secondary-demo">
                    <p className="subsection-description">
                      🎨{" "}
                      <strong>
                        Most interface colors are automatically generated!
                      </strong>
                      <br />
                      Additional neutral greys, hover states, and variants are
                      derived from your core colors for perfect harmony.
                    </p>

                    <div className="demo-grid">
                      <div className="demo-item">
                        <strong>🎯 Auto-Generated Variants</strong>
                        <p>
                          Light/dark versions of all your colors, plus 5
                          additional grey shades
                        </p>
                      </div>

                      <div className="demo-item">
                        <strong>🎨 Smart Backgrounds</strong>
                        <p>
                          Surface colors and subtle backgrounds derived from
                          your palette
                        </p>
                      </div>

                      <div className="demo-item">
                        <strong>🔲 Interactive States</strong>
                        <p>
                          Hover, focus, and active states automatically match
                          your design
                        </p>
                      </div>

                      <div className="demo-item">
                        <strong>⚙️ Advanced Control</strong>
                        <p>
                          Need full control? Import/export custom configuration
                          files
                        </p>
                      </div>
                    </div>

                    <div className="color-hierarchy">
                      <div className="color-example primary">
                        <span>Primary</span>
                        <small>Critical actions</small>
                      </div>
                      <div className="color-example secondary">
                        <span>Secondary</span>
                        <small>Supporting elements</small>
                      </div>
                      <div className="color-example accent">
                        <span>Accent</span>
                        <small>Highlights</small>
                      </div>
                    </div>
                  </div>

                  <div className="auto-derived-section">
                    <h4>Auto-derived Variants</h4>
                    <p className="subsection-description">
                      These variants are automatically generated from your brand
                      colors
                    </p>
                    <div className="config-grid">
                      <div className="derived-color-preview">
                        <label>Primary Light</label>
                        <div
                          className="color-swatch"
                          style={{
                            backgroundColor: lightenColor(
                              editedConfig.theme.colors.primary,
                              15
                            ),
                          }}
                        ></div>
                        <span>
                          {lightenColor(editedConfig.theme.colors.primary, 15)}
                        </span>
                      </div>
                      <div className="derived-color-preview">
                        <label>Primary Dark</label>
                        <div
                          className="color-swatch"
                          style={{
                            backgroundColor: darkenColor(
                              editedConfig.theme.colors.primary,
                              15
                            ),
                          }}
                        ></div>
                        <span>
                          {darkenColor(editedConfig.theme.colors.primary, 15)}
                        </span>
                      </div>
                      <div className="derived-color-preview">
                        <label>Secondary Light</label>
                        <div
                          className="color-swatch"
                          style={{
                            backgroundColor: lightenColor(
                              editedConfig.theme.colors.secondary,
                              15
                            ),
                          }}
                        ></div>
                        <span>
                          {lightenColor(
                            editedConfig.theme.colors.secondary,
                            15
                          )}
                        </span>
                      </div>
                      <div className="derived-color-preview">
                        <label>Secondary Dark</label>
                        <div
                          className="color-swatch"
                          style={{
                            backgroundColor: darkenColor(
                              editedConfig.theme.colors.secondary,
                              15
                            ),
                          }}
                        ></div>
                        <span>
                          {darkenColor(editedConfig.theme.colors.secondary, 15)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Shadows Section */}
          {activeSection === "theme.shadows" && (
            <div className="config-section">
              <h2 className={styles.sectionHeader}>🌟 Shadows & Elevation</h2>
              <p className="section-description">
                Configure shadow values for depth and elevation. These shadows
                create visual hierarchy and focus states throughout the
                interface.
              </p>
              <div className="config-subsections">
                <div className="subsection">
                  <h3>Elevation Shadows</h3>
                  <div className="config-grid">
                    {renderInput(
                      "theme.shadows.shadowSmall",
                      editedConfig.theme.shadows.shadowSmall,
                      "string"
                    )}
                    {renderInput(
                      "theme.shadows.shadowMedium",
                      editedConfig.theme.shadows.shadowMedium,
                      "string"
                    )}
                    {renderInput(
                      "theme.shadows.shadowLarge",
                      editedConfig.theme.shadows.shadowLarge,
                      "string"
                    )}
                    {renderInput(
                      "theme.shadows.shadowXLarge",
                      editedConfig.theme.shadows.shadowXLarge,
                      "string"
                    )}
                  </div>
                </div>
                <div className="subsection">
                  <h3>Special Effects</h3>
                  <div className="config-grid">
                    {renderInput(
                      "theme.shadows.shadowInner",
                      editedConfig.theme.shadows.shadowInner,
                      "string"
                    )}
                    {renderInput(
                      "theme.shadows.shadowFocus",
                      editedConfig.theme.shadows.shadowFocus,
                      "string"
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Transitions Section */}
          {activeSection === "theme.transitions" && (
            <div className="config-section">
              <h2 className={styles.sectionHeader}>
                ⚡ Transitions & Animations
              </h2>
              <p className="section-description">
                Configure animation timing and easing functions for smooth,
                responsive interactions that feel natural and polished.
              </p>
              <div className="config-subsections">
                <div className="subsection">
                  <h3>Duration</h3>
                  <div className="config-grid">
                    {renderInput(
                      "theme.transitions.transitionFast",
                      editedConfig.theme.transitions.transitionFast,
                      "string"
                    )}
                    {renderInput(
                      "theme.transitions.transitionMedium",
                      editedConfig.theme.transitions.transitionMedium,
                      "string"
                    )}
                    {renderInput(
                      "theme.transitions.transitionSlow",
                      editedConfig.theme.transitions.transitionSlow,
                      "string"
                    )}
                  </div>
                </div>
                <div className="subsection">
                  <h3>Easing Functions</h3>
                  <div className="config-grid">
                    {renderInput(
                      "theme.transitions.easingDefault",
                      editedConfig.theme.transitions.easingDefault,
                      "string"
                    )}
                    {renderInput(
                      "theme.transitions.easingBounce",
                      editedConfig.theme.transitions.easingBounce,
                      "string"
                    )}
                    {renderInput(
                      "theme.transitions.easingSharp",
                      editedConfig.theme.transitions.easingSharp,
                      "string"
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Interactive States Section */}
          {activeSection === "theme.interactive" && (
            <div className="config-section">
              <h2 className={styles.sectionHeader}>🖱️ Interactive States</h2>
              <p className="section-description">
                Configure how UI elements respond to user interactions like
                hover, focus, and disabled states for consistent behavior.
              </p>
              <div className="config-subsections">
                <div className="subsection">
                  <h3>Interaction Values</h3>
                  <div className="config-grid">
                    {renderInput(
                      "theme.interactiveStates.hoverOpacity",
                      editedConfig.theme.interactiveStates.hoverOpacity,
                      "number"
                    )}
                    {renderInput(
                      "theme.interactiveStates.activeScale",
                      editedConfig.theme.interactiveStates.activeScale,
                      "number"
                    )}
                    {renderInput(
                      "theme.interactiveStates.disabledOpacity",
                      editedConfig.theme.interactiveStates.disabledOpacity,
                      "number"
                    )}
                  </div>
                </div>
                <div className="subsection">
                  <h3>Focus Styling</h3>
                  <div className="config-grid">
                    {renderInput(
                      "theme.interactiveStates.focusRingWidth",
                      editedConfig.theme.interactiveStates.focusRingWidth,
                      "string"
                    )}
                    {renderInput(
                      "theme.interactiveStates.focusRingOffset",
                      editedConfig.theme.interactiveStates.focusRingOffset,
                      "string"
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Layout & Navigation */}
          {activeSection === "layout" && (
            <div className="config-section">
              <h2 className={styles.sectionHeader}>📐 Layout & Navigation</h2>
              <p className="section-description">
                Control layout dimensions, navigation behavior, and UI variants
              </p>

              <div className="config-subsections">
                <div className="subsection">
                  <h3>📱 Navigation Configuration</h3>
                  <div className="config-grid">
                    <div className="input-group">
                      <label htmlFor="sidebar-variant">
                        Default Sidebar Variant
                      </label>
                      <select
                        id="sidebar-variant"
                        value={editedConfig.ui.defaultSidebarVariant}
                        onChange={(e) =>
                          handleConfigChange(
                            "ui.defaultSidebarVariant",
                            e.target.value
                          )
                        }
                        className="enhanced-select"
                      >
                        <option value="labels">
                          📝 Labels (Wide sidebar with text)
                        </option>
                        <option value="buttons">
                          🔘 Buttons (Narrow sidebar with icons)
                        </option>
                      </select>
                      <small>
                        Choose how the sidebar displays navigation items
                      </small>
                    </div>

                    <div className="input-group">
                      <label>Show Bottom Bar</label>
                      <div className="checkbox-group">
                        <input
                          type="checkbox"
                          checked={editedConfig.ui.defaultShowBottomBar}
                          onChange={(e) =>
                            handleConfigChange(
                              "ui.defaultShowBottomBar",
                              e.target.checked
                            )
                          }
                          id="show-bottom-bar"
                        />
                        <label htmlFor="show-bottom-bar">
                          Enable bottom navigation bar
                        </label>
                      </div>
                      <small>
                        Shows peripheral devices and secondary navigation
                      </small>
                    </div>
                  </div>
                </div>

                <div className="subsection">
                  <h3>📏 Sidebar Dimensions</h3>
                  <div className="config-grid">
                    {renderInput(
                      "layout.sidebarWidth.buttons",
                      editedConfig.layout.sidebarWidth.buttons,
                      "string"
                    )}
                    {renderInput(
                      "layout.sidebarWidth.labels",
                      editedConfig.layout.sidebarWidth.labels,
                      "string"
                    )}
                  </div>
                </div>

                <div className="subsection">
                  <h3>📐 Bar Heights</h3>
                  <div className="config-grid">
                    {renderInput(
                      "layout.topBarHeight",
                      editedConfig.layout.topBarHeight,
                      "string"
                    )}
                    {renderInput(
                      "layout.bottomBarHeight",
                      editedConfig.layout.bottomBarHeight,
                      "string"
                    )}
                  </div>
                </div>

                <div className="subsection">
                  <h3>🎯 Content Navigation Types</h3>
                  <div className="info-panel">
                    <div className="nav-type-showcase">
                      <div className="nav-type">
                        <h4>📑 Tab Navigation</h4>
                        <p>
                          Horizontal tabs for content sections (Financial
                          Reports, Analytics, etc.)
                        </p>
                        <div className="preview-tabs">
                          <span className="tab active">Daily Sales</span>
                          <span className="tab">Weekly Revenue</span>
                          <span className="tab">Monthly P&L</span>
                        </div>
                      </div>
                      <div className="nav-type">
                        <h4>🔘 Button Navigation</h4>
                        <p>
                          Grid-based buttons for action pages (Operations,
                          Maintenance, etc.)
                        </p>
                        <div className="preview-buttons">
                          <span className="btn-preview">Cash Report</span>
                          <span className="btn-preview">Inventory</span>
                          <span className="btn-preview">Sales Report</span>
                        </div>
                      </div>
                    </div>
                    <p>
                      <strong>Note:</strong> These are configured per-section in
                      the navigation config using <code>display: "tabs"</code>{" "}
                      or <code>display: "buttons"</code>.
                    </p>
                  </div>
                </div>

                <div className="subsection">
                  <h3>📏 Spacing & Border Radius</h3>
                  <div className="config-grid">
                    {renderInput(
                      "theme.spacing.spacing4",
                      editedConfig.theme.spacing.spacing4,
                      "string"
                    )}
                    {renderInput(
                      "theme.spacing.spacing8",
                      editedConfig.theme.spacing.spacing8,
                      "string"
                    )}
                    {renderInput(
                      "theme.borderRadius.radiusMedium",
                      editedConfig.theme.borderRadius.radiusMedium,
                      "string"
                    )}
                    {renderInput(
                      "theme.borderRadius.radiusLarge",
                      editedConfig.theme.borderRadius.radiusLarge,
                      "string"
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Animations & Feel */}
          {activeSection === "ui.behavior" && (
            <div className="config-section">
              <h2 className={styles.sectionHeader}>⚡ Animations & Feel</h2>
              <p className="section-description">
                Control how your application feels through animations and
                interactions
              </p>

              <div className="config-subsections">
                <div className="subsection">
                  <h3>Animation Timing</h3>
                  <div className="config-grid">
                    {renderInput(
                      "ui.animationFast",
                      editedConfig.ui.animationFast,
                      "string"
                    )}
                    {renderInput(
                      "ui.animationMedium",
                      editedConfig.ui.animationMedium,
                      "string"
                    )}
                    {renderInput(
                      "ui.animationSlow",
                      editedConfig.ui.animationSlow,
                      "string"
                    )}
                  </div>
                </div>

                <div className="subsection">
                  <h3>Sidebar Behavior</h3>
                  <div className="config-grid">
                    {renderInput(
                      "ui.defaultSidebarVariant",
                      editedConfig.ui.defaultSidebarVariant,
                      "string"
                    )}
                    {renderInput(
                      "ui.defaultShowBottomBar",
                      editedConfig.ui.defaultShowBottomBar,
                      "boolean"
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Branding */}
          {activeSection === "branding" && (
            <div className="config-section">
              <h2 className={styles.sectionHeader}>🏢 Branding & Identity</h2>
              <div className="config-subsections">
                <div className="subsection">
                  <h3>Company Information</h3>
                  <div className="config-grid">
                    {Object.entries(editedConfig.branding.company).map(
                      ([key, value]) => (
                        <div key={key} className="config-item">
                          {renderInput(
                            `branding.company.${key}`,
                            value,
                            "string"
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="subsection">
                  <h3>Application Details</h3>
                  <div className="config-grid">
                    {Object.entries(editedConfig.branding.app).map(
                      ([key, value]) => (
                        <div key={key} className="config-item">
                          {renderInput(`branding.app.${key}`, value, "string")}
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="subsection">
                  <h3>Logo Configuration</h3>
                  <div className="config-grid">
                    {Object.entries(editedConfig.branding.logo).map(
                      ([key, value]) => (
                        <div key={key} className="config-item">
                          {renderInput(
                            `branding.logo.${key}`,
                            value,
                            typeof value === "number" ? "number" : "string"
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Advanced Settings */}
          {activeSection === "advanced" && (
            <div className="config-section">
              <h2 className={styles.sectionHeader}>⚙️ Advanced Settings</h2>

              <div className="config-subsections">
                <div className="subsection">
                  <h3>Feature Flags</h3>
                  <div className="config-grid">
                    {Object.entries(editedConfig.features).map(
                      ([key, value]) => (
                        <div key={key} className="config-item">
                          {renderInput(`features.${key}`, value, "boolean")}
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="subsection">
                  <h3>API Configuration</h3>
                  <div className="config-grid">
                    {Object.entries(editedConfig.api).map(([key, value]) => (
                      <div key={key} className="config-item">
                        {renderInput(
                          `api.${key}`,
                          value,
                          typeof value === "number" ? "number" : "string"
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="subsection">
                  <h3>Authentication Settings</h3>
                  <div className="config-grid">
                    {Object.entries(editedConfig.auth).map(([key, value]) => (
                      <div key={key} className="config-item">
                        {renderInput(
                          `auth.${key}`,
                          value,
                          typeof value === "number" ? "number" : "string"
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfigEditor;

// Quick basic styling for the simplified config editor
const editorStyles = `
  .config-item {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    margin-bottom: 1.5rem;
  }

  .config-item label {
    font-weight: 500;
    color: var(--text-primary);
    font-size: 0.875rem;
    margin-bottom: 0.25rem;
  }

  .color-input-wrapper {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }

  .color-input {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 0.5rem;
    border: 1px solid var(--border-primary);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .color-input:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .color-text-input {
    flex: 1;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--border-primary);
    border-radius: 0.375rem;
    font-family: 'SF Mono', Monaco, monospace;
    font-size: 0.875rem;
    background: var(--surface-primary);
    transition: border-color 0.2s ease;
  }

  .color-text-input:focus {
    outline: none;
    border-color: var(--color-primary);
  }

  .config-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
  }

  .subsection {
    margin-bottom: 3rem;
    padding: 0;
  }

  .subsection:not(:last-child) {
    border-bottom: 1px solid var(--border-primary);
    padding-bottom: 2rem;
  }

  .subsection h3 {
    margin: 0 0 0.5rem 0;
    color: var(--text-primary);
    font-size: 1.125rem;
    font-weight: 600;
  }

  .subsection-description {
    margin: 0 0 2rem 0;
    color: var(--text-secondary);
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .auto-derived-section {
    margin-top: 2rem;
    padding: 1.5rem;
    background: var(--surface-secondary);
    border-radius: 0.75rem;
    border: 1px solid var(--border-primary);
  }

  .auto-derived-section h4 {
    margin: 0 0 0.75rem 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .derived-color-preview {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
    text-align: center;
  }

  .color-swatch {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.5rem;
    border: 1px solid var(--border-primary);
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .derived-color-preview label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 0;
  }

  .derived-color-preview span {
    font-size: 0.6875rem;
    font-family: 'SF Mono', Monaco, monospace;
    color: var(--text-tertiary);
    background: var(--surface-primary);
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    border: 1px solid var(--border-primary);
  }

  .demo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin: 1.5rem 0;
  }

  .demo-item {
    padding: 1.25rem;
    background: var(--surface-secondary);
    border-radius: 0.5rem;
    border: 1px solid var(--border-primary);
  }

  .demo-item strong {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
    font-size: 0.875rem;
  }

  .demo-item p {
    margin: 0;
    font-size: 0.8125rem;
    color: var(--text-secondary);
    line-height: 1.4;
  }

  .color-hierarchy {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
    justify-content: center;
  }

  .color-example {
    padding: 0.75rem 1.25rem;
    border-radius: 0.5rem;
    text-align: center;
    color: white;
    font-weight: 500;
    font-size: 0.875rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    transition: transform 0.2s ease;
  }

  .color-example:hover {
    transform: translateY(-1px);
  }

  .color-example.primary {
    background: var(--color-primary);
  }

  .color-example.secondary {
    background: var(--color-secondary);
  }

  .color-example.accent {
    background: var(--color-accent);
  }

  .color-example small {
    display: block;
    font-size: 0.6875rem;
    opacity: 0.85;
    margin-top: 0.25rem;
    font-weight: 400;
  }

  .error-message {
    color: var(--color-error);
    font-size: 0.75rem;
    margin-top: 0.375rem;
    font-weight: 500;
  }

  input.error {
    border-color: var(--color-error);
    background: rgba(var(--color-error), 0.05);
  }

  /* Clean checkbox styling */
  input[type="checkbox"] {
    width: 1rem;
    height: 1rem;
    accent-color: var(--color-primary);
  }

  /* Clean number/text input styling */
  input[type="text"], input[type="number"] {
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--border-primary);
    border-radius: 0.375rem;
    background: var(--surface-primary);
    font-size: 0.875rem;
    transition: border-color 0.2s ease;
  }

  input[type="text"]:focus, input[type="number"]:focus {
    outline: none;
    border-color: var(--color-primary);
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleElement = document.createElement("style");
  styleElement.textContent = editorStyles;
  document.head.appendChild(styleElement);
}
