import type { MasterConfig } from "./master.generated";
import type { ConfigOverrides } from "./overrides.types";

// ==========================================
// CONFIGURATION PRESETS
// ==========================================

export interface ConfigPreset {
  id: string;
  name: string;
  description: string;
  overrides: ConfigOverrides;
}

// Default/Professional preset (clean, modern)
export const professionalPreset: ConfigPreset = {
  id: "professional",
  name: "Professional",
  description: "Clean, modern design with subtle interactions",
  overrides: {
    // This represents the current default configuration
    theme: {
      colors: {
        primary: "#1d4ed8",
        primaryDark: "#1e40af",
        primaryLight: "#3b82f6",
        accent: "#2563eb",
        accentBackground: "#dbeafe",
      },
    },
  },
};

// Playful/Vibrant preset (colorful, bouncy)
export const playfulPreset: ConfigPreset = {
  id: "playful",
  name: "Playful",
  description: "Colorful, vibrant design with bouncy animations",
  overrides: {
    theme: {
      colors: {
        primary: "#7c3aed", // Purple
        primaryDark: "#6d28d9",
        primaryLight: "#8b5cf6",
        secondary: "#ec4899", // Pink
        secondaryDark: "#db2777",
        secondaryLight: "#f472b6",
        accent: "#10b981", // Green
        accentBackground: "#d1fae5",
        success: "#06d6a0",
        warning: "#f59e0b",
        error: "#ef4444",
        info: "#3b82f6",
      },
      spacing: {
        spacing1: "0.375rem", // Slightly larger
        spacing2: "0.625rem",
        spacing3: "1rem",
        spacing4: "1.25rem",
        spacing5: "1.75rem",
        spacing6: "2rem",
        spacing8: "2.5rem",
        spacing12: "3.5rem",
      },
      borderRadius: {
        radiusSmall: "0.75rem", // Much more rounded
        radiusMedium: "1rem",
        radiusLarge: "1.5rem",
        radiusXLarge: "2rem",
      },
    },
    ui: {
      animationFast: "0.2s",
      animationMedium: "0.4s",
      animationSlow: "0.6s",
      easingDefault: "cubic-bezier(0.68, -0.55, 0.265, 1.55)", // Bouncy
      easingBounce: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      easingSharp: "cubic-bezier(0.55, 0, 0.1, 1)",
    },
    componentStyles: {
      buttons: {
        borderRadius: "1rem",
        paddingVertical: "1rem",
        paddingHorizontal: "1.5rem",
        fontWeight: 700,
        minHeight: "48px",
        minWidth: "140px",
        hoverTransform: "translateY(-2px) scale(1.02)",
        hoverShadow: "0 8px 20px rgba(124, 58, 237, 0.3)",
        focusRingStyle: "0 0 0 4px rgba(124, 58, 237, 0.3)",
      },
      inputs: {
        borderRadius: "1rem",
        padding: "1rem 1.25rem",
        fontSize: "1rem",
        borderWidth: "2px",
        focusRingWidth: "4px",
        focusRingColor: "rgba(124, 58, 237, 0.3)",
        placeholderOpacity: "0.6",
      },
      cards: {
        borderRadius: "1.5rem",
        padding: "1.5rem",
        shadowLight: "0 4px 6px rgba(124, 58, 237, 0.1)",
        shadowMedium: "0 8px 15px rgba(124, 58, 237, 0.15)",
        shadowHeavy: "0 20px 40px rgba(124, 58, 237, 0.2)",
        borderWidth: "2px",
        borderStyle: "solid",
        hoverElevation: "0 15px 30px rgba(124, 58, 237, 0.25)",
      },
      navigation: {
        buttonGrid: {
          gap: "24px",
          itemMinWidth: "260px",
          itemMaxWidth: "320px",
          itemPadding: "20px 16px",
          hoverScale: "1.05",
          activeScale: "0.95",
        },
        tabs: {
          height: "48px",
          borderRadius: "1.5rem",
          gap: "8px",
          activeIndicatorHeight: "4px",
          hoverBackground: "rgba(124, 58, 237, 0.1)",
        },
      },
      modals: {
        backdropBlur: "12px",
        borderRadius: "1.5rem",
        padding: "2.5rem",
        maxWidth: "700px",
        shadow: "0 25px 50px rgba(124, 58, 237, 0.25)",
        animationDuration: "0.4s",
      },
      loading: {
        spinnerSize: "32px",
        spinnerThickness: "3px",
        pulseOpacity: "0.7",
        skeletonBackground: "#f3e8ff",
        skeletonHighlight: "#e9d5ff",
      },
      scrollbar: {
        width: "12px",
        thumbColor: "#c084fc",
        trackColor: "#f3e8ff",
        thumbHoverColor: "#a855f7",
        borderRadius: "6px",
      },
    },
    branding: {
      company: {
        name: "FunCorp Studios",
        displayName: "FunCorp 🎉",
      },
      app: {
        name: "PlayfulApp",
        version: "2.0.0-fun",
        description: "The most fun app ever!",
      },
      loginPage: {
        title: "Welcome to the Fun Zone! 🎈",
      },
    },
    features: {
      enableDebugReports: true,
      enableAdvancedFilters: true,
      enableThemeCustomization: true,
      enableBulkOperations: true,
      enableOfflineMode: false,
    },
    api: {
      baseUrl: "https://api-fun.example.com",
      timeout: 8000,
      retryAttempts: 5,
      retryDelay: 2000,
    },
  },
};

// Minimal/Zen preset (ultra-clean, monochrome)
export const minimalPreset: ConfigPreset = {
  id: "minimal",
  name: "Minimal",
  description: "Ultra-clean, monochromatic design with precise spacing",
  overrides: {
    theme: {
      colors: {
        primary: "#000000",
        primaryDark: "#1f2937",
        primaryLight: "#4b5563",
        secondary: "#6b7280",
        secondaryDark: "#374151",
        secondaryLight: "#9ca3af",
        accent: "#000000",
        accentBackground: "#f9fafb",
        success: "#059669",
        warning: "#d97706",
        error: "#dc2626",
        info: "#0284c7",
        grey50: "#ffffff",
        grey100: "#f9fafb",
        grey200: "#f3f4f6",
        grey300: "#e5e7eb",
        grey600: "#6b7280",
        grey700: "#374151",
        grey800: "#1f2937",
      },
      spacing: {
        spacing1: "0.25rem", // Precise, exact spacing
        spacing2: "0.5rem",
        spacing3: "0.75rem",
        spacing4: "1rem",
        spacing5: "1.25rem",
        spacing6: "1.5rem",
        spacing8: "2rem",
        spacing12: "3rem",
      },
      borderRadius: {
        radiusSmall: "0px", // Sharp corners
        radiusMedium: "0px",
        radiusLarge: "0px",
        radiusXLarge: "0px",
      },
    },
    ui: {
      animationFast: "0.1s",
      animationMedium: "0.2s",
      animationSlow: "0.3s",
      easingDefault: "cubic-bezier(0.4, 0, 0.6, 1)", // Linear, no bounce
      easingBounce: "cubic-bezier(0.4, 0, 0.6, 1)",
      easingSharp: "cubic-bezier(0.4, 0, 1, 1)",
    },
    componentStyles: {
      buttons: {
        borderRadius: "0px",
        paddingVertical: "0.75rem",
        paddingHorizontal: "1.5rem",
        fontWeight: 400,
        minHeight: "40px",
        minWidth: "120px",
        hoverTransform: "none",
        hoverShadow: "none",
        focusRingStyle: "0 0 0 1px #000000",
      },
      inputs: {
        borderRadius: "0px",
        padding: "0.75rem 1rem",
        fontSize: "0.875rem",
        borderWidth: "1px",
        focusRingWidth: "1px",
        focusRingColor: "#000000",
        placeholderOpacity: "0.4",
      },
      cards: {
        borderRadius: "0px",
        padding: "1.5rem",
        shadowLight: "none",
        shadowMedium: "none",
        shadowHeavy: "none",
        borderWidth: "1px",
        borderStyle: "solid",
        hoverElevation: "none",
      },
      navigation: {
        buttonGrid: {
          gap: "24px",
          itemMinWidth: "240px",
          itemMaxWidth: "300px",
          itemPadding: "20px 16px",
          hoverScale: "1.0",
          activeScale: "1.0",
        },
        tabs: {
          height: "40px",
          borderRadius: "0px",
          gap: "0px",
          activeIndicatorHeight: "2px",
          hoverBackground: "rgba(0, 0, 0, 0.05)",
        },
      },
      modals: {
        backdropBlur: "0px",
        borderRadius: "0px",
        padding: "2rem",
        maxWidth: "600px",
        shadow: "0 0 0 1px #e5e7eb",
        animationDuration: "0.2s",
      },
      loading: {
        spinnerSize: "20px",
        spinnerThickness: "1px",
        pulseOpacity: "0.3",
        skeletonBackground: "#f3f4f6",
        skeletonHighlight: "#ffffff",
      },
      scrollbar: {
        width: "1px",
        thumbColor: "#000000",
        trackColor: "transparent",
        thumbHoverColor: "#374151",
        borderRadius: "0px",
      },
    },
  },
};

// Dark/Gaming preset (dark theme, neon accents)
export const darkPreset: ConfigPreset = {
  id: "dark",
  name: "Dark Gaming",
  description: "Dark theme with neon accents and gaming aesthetics",
  overrides: {
    theme: {
      colors: {
        primary: "#00ff88", // Neon green
        primaryDark: "#00cc6a",
        primaryLight: "#33ffaa",
        secondary: "#ff0080", // Neon pink
        secondaryDark: "#cc0066",
        secondaryLight: "#ff33aa",
        accent: "#00ffff", // Cyan
        accentBackground: "#1a1a2e",
        success: "#00ff88",
        warning: "#ffaa00",
        error: "#ff4444",
        info: "#00bbff",
        grey50: "#16213e",
        grey100: "#1a1a2e",
        grey200: "#16213e",
        grey300: "#0f3460",
        grey600: "#e94560",
        grey700: "#0f3460",
        grey800: "#16213e",
        white: "#eee",
      },
      typography: {
        fontFamilySans: '"Orbitron", "Roboto Mono", monospace',
        fontFamilyMono: '"Fira Code", "Consolas", monospace',
      },
      borderRadius: {
        radiusSmall: "0.125rem",
        radiusMedium: "0.25rem",
        radiusLarge: "0.5rem",
        radiusXLarge: "1rem",
      },
    },
    ui: {
      animationFast: "0.12s",
      animationMedium: "0.25s",
      animationSlow: "0.4s",
      easingDefault: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      easingBounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      easingSharp: "cubic-bezier(0.55, 0, 0.1, 1)",
    },
    componentStyles: {
      buttons: {
        borderRadius: "0.25rem",
        paddingVertical: "0.75rem",
        paddingHorizontal: "1.25rem",
        fontWeight: 600,
        minHeight: "44px",
        minWidth: "130px",
        hoverTransform: "translateY(-1px)",
        hoverShadow: "0 4px 20px rgba(0, 255, 136, 0.4)",
        focusRingStyle: "0 0 0 2px rgba(0, 255, 136, 0.5)",
      },
      inputs: {
        borderRadius: "0.25rem",
        padding: "0.875rem 1rem",
        fontSize: "0.875rem",
        borderWidth: "1px",
        focusRingWidth: "2px",
        focusRingColor: "rgba(0, 255, 136, 0.5)",
        placeholderOpacity: "0.6",
      },
      cards: {
        borderRadius: "0.5rem",
        padding: "1.25rem",
        shadowLight: "0 0 10px rgba(0, 255, 136, 0.1)",
        shadowMedium: "0 0 20px rgba(0, 255, 136, 0.2)",
        shadowHeavy: "0 0 40px rgba(0, 255, 136, 0.3)",
        borderWidth: "1px",
        borderStyle: "solid",
        hoverElevation: "0 0 30px rgba(0, 255, 136, 0.4)",
      },
      navigation: {
        buttonGrid: {
          gap: "20px",
          itemMinWidth: "260px",
          itemMaxWidth: "320px",
          itemPadding: "18px 16px",
          hoverScale: "1.03",
          activeScale: "0.97",
        },
        tabs: {
          height: "42px",
          borderRadius: "0.25rem",
          gap: "8px",
          activeIndicatorHeight: "2px",
          hoverBackground: "rgba(0, 255, 136, 0.1)",
        },
      },
      modals: {
        backdropBlur: "10px",
        borderRadius: "0.5rem",
        padding: "2rem",
        maxWidth: "650px",
        shadow: "0 0 50px rgba(0, 255, 136, 0.3)",
        animationDuration: "0.3s",
      },
      loading: {
        spinnerSize: "28px",
        spinnerThickness: "2px",
        pulseOpacity: "0.8",
        skeletonBackground: "#1a1a2e",
        skeletonHighlight: "#0f3460",
      },
      scrollbar: {
        width: "10px",
        thumbColor: "#00ff88",
        trackColor: "#1a1a2e",
        thumbHoverColor: "#33ffaa",
        borderRadius: "5px",
      },
    },
    branding: {
      company: {
        name: "NeonTech Gaming",
        displayName: "NeonTech ⚡",
      },
      app: {
        name: "CyberApp",
        version: "3.0.0-dark",
        description: "Elite gaming platform",
      },
      loginPage: {
        title: "Enter the Matrix 🌐",
      },
    },
    features: {
      enableDebugReports: true,
      enableAdvancedFilters: true,
      enableThemeCustomization: true,
      enableBulkOperations: true,
      enableOfflineMode: true,
    },
    api: {
      baseUrl: "https://api-cyber.neontech.io",
      timeout: 5000,
      retryAttempts: 3,
      retryDelay: 1500,
    },
  },
};

// Export all presets
export const configPresets: ConfigPreset[] = [
  professionalPreset,
  playfulPreset,
  minimalPreset,
  darkPreset,
];

export function getPresetById(id: string): ConfigPreset | undefined {
  return configPresets.find(preset => preset.id === id);
} 