import React, { useState, useCallback } from "react";
import { configManager } from "../../shared/config/config.manager";
import styles from "./ActiveConfigManager.module.scss";

interface ActiveConfigManagerProps {
  className?: string;
}

const ActiveConfigManager: React.FC<ActiveConfigManagerProps> = ({
  className = "",
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [activeConfigInfo, setActiveConfigInfo] = useState(() =>
    configManager.getActiveConfigInfo()
  );
  const [message, setMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  const refreshInfo = () => {
    setActiveConfigInfo(configManager.getActiveConfigInfo());
  };

  const showMessage = (type: "success" | "error" | "info", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // File handling
  const handleFileImport = useCallback((files: FileList) => {
    Array.from(files).forEach((file) => {
      if (file.type === "application/json" || file.name.endsWith(".json")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const configData = JSON.parse(e.target?.result as string);
            configManager.setActiveConfig(configData);
            refreshInfo();
            showMessage(
              "success",
              `Active config loaded: ${configData.name || "Unnamed Config"}`
            );
          } catch (error) {
            showMessage("error", "Invalid JSON file format");
          }
        };
        reader.readAsText(file);
      } else {
        showMessage("error", "Please upload a JSON file");
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFileImport(files);
    }
  };

  const clearActiveConfig = () => {
    configManager.clearActiveConfig();
    refreshInfo();
    showMessage("info", "Active config cleared, reverted to default");
  };

  const forceReloadConfig = () => {
    // Clear localStorage completely and force reload
    localStorage.removeItem("active-config-data");
    localStorage.removeItem("active-config-timestamp");
    localStorage.removeItem("active-config-exists");
    localStorage.removeItem("active-config-example");

    // Force reload from file system
    window.location.reload();
    showMessage("info", "Force reloading config from file system...");
  };

  const debugConfigState = () => {
    const localStorageData = localStorage.getItem("active-config-data");
    const timestamp = localStorage.getItem("active-config-timestamp");
    const configInfo = configManager.getActiveConfigInfo();

    console.log("=== CONFIG DEBUG INFO ===");
    console.log("Has localStorage config:", !!localStorageData);
    console.log("localStorage timestamp:", timestamp);
    console.log("ConfigManager info:", configInfo);
    console.log(
      "localStorage data:",
      localStorageData ? JSON.parse(localStorageData) : null
    );
    console.log("=== END DEBUG INFO ===");

    showMessage("info", "Debug info logged to console (F12)");
  };

  const downloadExampleConfig = () => {
    const exampleConfig = {
      name: "Example Active Config",
      description: "Example configuration for your application",
      config: {
        theme: {
          colors: {
            primary: "#007bff",
            secondary: "#6c757d",
            accent: "#17a2b8",
            background: "#ffffff",
            surface: "#f8f9fa",
            text: "#212529",
          },
          typography: {
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSizes: {
              xs: "0.75rem",
              sm: "0.875rem",
              md: "1rem",
              lg: "1.125rem",
              xl: "1.25rem",
            },
          },
        },
        branding: {
          company: {
            name: "Your Company Name",
            displayName: "Your Company Display Name",
          },
        },
        ui: {
          animations: {
            enabled: true,
            duration: 300,
          },
          notifications: {
            position: "top-right",
            autoHide: true,
            duration: 5000,
          },
        },
      },
    };

    const blob = new Blob([JSON.stringify(exampleConfig, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "config.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showMessage("success", "Example config.json downloaded");
  };

  return (
    <div className={`${styles.activeConfigManager} ${className}`}>
      <div className={styles.header}>
        <h3>🚀 Active Config System</h3>
        <p className={styles.description}>
          Ultra-simple config management - just drop a config.json file to apply
          instantly!
        </p>
      </div>

      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      <div className={styles.statusCard}>
        <div className={styles.statusHeader}>
          <span
            className={`${styles.statusIndicator} ${
              activeConfigInfo.isActive ? styles.active : styles.inactive
            }`}
          >
            {activeConfigInfo.isActive ? "🟢 Active" : "⚪ Default"}
          </span>
          <div className={styles.statusInfo}>
            {activeConfigInfo.isActive ? (
              <>
                <div>Config is loaded and active</div>
                {activeConfigInfo.isStaleLocalStorage ? (
                  <div className={styles.staleWarning}>
                    ⚠️ May be cached data - no recent file system activity
                  </div>
                ) : (
                  <div className={styles.timestamp}>
                    Last modified:{" "}
                    {new Date(activeConfigInfo.lastModified).toLocaleString()}
                  </div>
                )}
              </>
            ) : (
              <div>Using default configuration</div>
            )}
          </div>
        </div>

        <div className={styles.actionButtons}>
          {activeConfigInfo.isActive && (
            <button
              className={styles.clearButton}
              onClick={clearActiveConfig}
              title="Clear active config and revert to default"
            >
              Clear Active Config
            </button>
          )}
          <button
            className={styles.debugButton}
            onClick={debugConfigState}
            title="Debug config state (check console)"
          >
            Debug Config
          </button>
          <button
            className={styles.forceReloadButton}
            onClick={forceReloadConfig}
            title="Force reload from file system (clears all cache)"
          >
            Force Reload
          </button>
        </div>
      </div>

      <div
        className={`${styles.dropZone} ${
          isDragActive ? styles.dragActive : ""
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className={styles.dropContent}>
          <div className={styles.dropIcon}>📁</div>
          <div className={styles.dropText}>
            <strong>Drop config.json here</strong>
            <br />
            or click to select file
          </div>
          <input
            type="file"
            accept=".json,application/json"
            onChange={handleFileSelect}
            className={styles.fileInput}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.actionButton} onClick={downloadExampleConfig}>
          📥 Download Example Config
        </button>
      </div>

      <div className={styles.instructions}>
        <h4>📋 Team Instructions</h4>
        <ol>
          <li>Click "Download Example Config" to get a template</li>
          <li>Modify the config.json file with your desired settings</li>
          <li>
            <strong>Option A:</strong> Drag and drop the file here
          </li>
          <li>
            <strong>Option B:</strong> Place the file in the{" "}
            <code>active-config/</code> folder as <code>config.json</code>
          </li>
          <li>The configuration applies instantly!</li>
          <li>To revert, click "Clear Active Config"</li>
        </ol>

        <div className={styles.note}>
          <strong>💡 Physical Folder:</strong> You can also drop config files
          directly into the
          <code>active-config/</code> folder in your project root as{" "}
          <code>config.json</code>. The system automatically watches both the
          folder and this interface for changes.
        </div>
      </div>
    </div>
  );
};

export default ActiveConfigManager;
