import { NavNode } from "./navigation.config";
import { ReportConfig } from "../../config/reportConfig";
import { SidebarVariant } from "../types/ui";

// ==========================================
// MASTER CONFIGURATION INTERFACE
// ==========================================
// This configuration contains EVERY configurable variable in the application.
// Everything defined here MUST be implemented in the layout/components.

export interface LogoConfig {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface ThemeColors {
  // Brand Colors - Essential user-configurable colors
  primary: string;
  secondary: string;
  accent: string;
  
  // Status Colors - For feedback and notifications  
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Auto-generated variants (computed)
  primaryLight?: string;
  primaryDark?: string;
  secondaryLight?: string;
  secondaryDark?: string;
  accentBackground?: string;
  
  // Neutral Colors (auto-derived if not specified)
  white?: string;
  grey50?: string;
  grey100?: string;
  grey200?: string;
  grey300?: string;
  grey400?: string;
  grey500?: string;
  grey600?: string;
  grey700?: string;
  grey800?: string;
  grey900?: string;
}

export interface ThemeShadows {
  shadowSmall: string;
  shadowMedium: string;
  shadowLarge: string;
  shadowXLarge: string;
  shadowInner: string;
  shadowFocus: string;
}

export interface ThemeTransitions {
  transitionFast: string;
  transitionMedium: string;
  transitionSlow: string;
  easingDefault: string;
  easingBounce: string;
  easingSharp: string;
}

export interface ThemeInteractiveStates {
  hoverOpacity: number;
  activeScale: number;
  focusRingWidth: string;
  focusRingOffset: string;
  disabledOpacity: number;
}

export interface TypographyConfig {
  fontFamilySans: string;
  fontFamilyMono: string;
  
  // Font sizes
  fontSizeSmall: string;
  fontSizeMedium: string;
  fontSizeLarge: string;
  fontSizeXLarge: string;
  
  // Font weights
  fontWeightNormal: number;
  fontWeightMedium: number;
  fontWeightSemibold: number;
  fontWeightBold: number;
}

export interface SpacingConfig {
  spacing1: string; // 0.25rem
  spacing2: string; // 0.5rem
  spacing3: string; // 0.75rem
  spacing4: string; // 1rem
  spacing5: string; // 1.25rem
  spacing6: string; // 1.5rem
  spacing8: string; // 2rem
  spacing12: string; // 3rem
}

export interface BorderRadiusConfig {
  radiusSmall: string;
  radiusMedium: string;
  radiusLarge: string;
  radiusXLarge: string;
}

export interface LayoutConfig {
  // Sidebar configuration
  sidebarWidth: {
    buttons: string;
    labels: string;
    mobile: string; // For mobile/compact view
  };
  
  // Top/bottom bar heights
  topBarHeight: string;
  bottomBarHeight: string;
  
  // Mobile-specific heights
  mobile: {
    topBarHeight: string;
    sidebarWidthButtons: string;
    sidebarWidthLabels: string;
  };
  
  // Responsive breakpoints
  breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
  
  // Z-index layers
  zIndex: {
    topbar: number;
    sidebar: number;
    bottombar: number;
    modal: number;
    dropdown: number;
  };
}

export interface UIBehaviorConfig {
  // Default UI state
  defaultSidebarVariant: SidebarVariant;
  defaultShowBottomBar: boolean;
  
  // Animation durations
  animationFast: string;
  animationMedium: string;
  animationSlow: string;
  
  // Transition easings
  easingDefault: string;
  easingBounce: string;
  easingSharp: string;
}

export interface ComponentStylesConfig {
  // Button styles
  buttons: {
    borderRadius: string;
    paddingVertical: string;
    paddingHorizontal: string;
    fontWeight: number;
    minHeight: string;
    minWidth: string;
    hoverTransform: string;
    hoverShadow: string;
    focusRingStyle: string;
  };
  
  // Input styles
  inputs: {
    borderRadius: string;
    padding: string;
    fontSize: string;
    borderWidth: string;
    focusRingWidth: string;
    focusRingColor: string;
    placeholderOpacity: string;
  };
  
  // Card styles
  cards: {
    borderRadius: string;
    padding: string;
    shadowLight: string;
    shadowMedium: string;
    shadowHeavy: string;
    borderWidth: string;
    borderStyle: string;
    hoverElevation: string;
  };
  
  // Navigation styles
  navigation: {
    buttonGrid: {
      gap: string;
      itemMinWidth: string;
      itemMaxWidth: string;
      itemPadding: string;
      hoverScale: string;
      activeScale: string;
    };
    tabs: {
      height: string;
      borderRadius: string;
      gap: string;
      activeIndicatorHeight: string;
      hoverBackground: string;
    };
  };
  
  // Modal styles
  modals: {
    backdropBlur: string;
    borderRadius: string;
    padding: string;
    maxWidth: string;
    shadow: string;
    animationDuration: string;
  };
  
  // Loading styles
  loading: {
    spinnerSize: string;
    spinnerThickness: string;
    pulseOpacity: string;
    skeletonBackground: string;
    skeletonHighlight: string;
  };
  
  // Scrollbar styles
  scrollbar: {
    width: string;
    thumbColor: string;
    trackColor: string;
    thumbHoverColor: string;
    borderRadius: string;
  };
}

export interface BrandingConfig {
  // Company information
  company: {
    name: string;
    displayName?: string;
  };
  
  // Logo configuration
  logo: LogoConfig;
  
  // Login page branding
  loginPage: {
    title: string;
    logo?: LogoConfig;
  };
  
  // App metadata
  app: {
    name: string;
    version: string;
    description?: string;
  };
}

export interface APIConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

export interface AuthConfig {
  persistKey: string;
  sessionTimeout?: number;
  autoLogoutWarning?: number;
}

export interface FeatureFlags {
  enableDebugReports: boolean;
  enableAdvancedFilters: boolean;
  enableThemeCustomization: boolean;
  enableBulkOperations: boolean;
  enableOfflineMode: boolean;
}

// ==========================================
// MASTER CONFIGURATION INTERFACE
// ==========================================

export interface MasterConfig {
  theme: {
    colors: {
      primary: string;
      primaryLight?: string;
      primaryDark?: string;
      secondary: string;
      secondaryLight?: string;
      secondaryDark?: string;
      accent: string;
      accentBackground?: string;
      success: string;
      warning: string;
      error: string;
      info: string;
      white?: string;
      grey50?: string;
      grey100?: string;
      grey200?: string;
      grey300?: string;
      grey400?: string;
      grey500?: string;
      grey600?: string;
      grey700?: string;
      grey800?: string;
      grey900?: string;
      [key: string]: any;
    };
    shadows?: {
      shadowSmall?: string;
      shadowMedium?: string;
      shadowLarge?: string;
      shadowXLarge?: string;
      shadowInner?: string;
      shadowFocus?: string;
      [key: string]: any;
    };
    transitions?: {
      transitionFast?: string;
      transitionMedium?: string;
      transitionSlow?: string;
      easingDefault?: string;
      easingBounce?: string;
      easingSharp?: string;
      [key: string]: any;
    };
    interactiveStates?: {
      hoverOpacity?: number;
      activeScale?: number;
      focusRingWidth?: string;
      focusRingOffset?: string;
      disabledOpacity?: number;
      [key: string]: any;
    };
    typography?: {
      fontFamilySans?: string;
      fontFamilyMono?: string;
      fontSizeSmall?: string;
      fontSizeMedium?: string;
      fontSizeLarge?: string;
      fontSizeXLarge?: string;
      fontWeightNormal?: number;
      fontWeightMedium?: number;
      fontWeightSemibold?: number;
      fontWeightBold?: number;
      [key: string]: any;
    };
    spacing?: {
      spacing1?: string;
      spacing2?: string;
      spacing3?: string;
      spacing4?: string;
      spacing5?: string;
      spacing6?: string;
      spacing8?: string;
      spacing12?: string;
      [key: string]: any;
    };
    borderRadius?: {
      radiusSmall?: string;
      radiusMedium?: string;
      radiusLarge?: string;
      radiusXLarge?: string;
      [key: string]: any;
    };
    [key: string]: any;
  };
  layout: {
    sidebarWidth?: {
      buttons?: string;
      labels?: string;
      mobile?: string;
      [key: string]: any;
    };
    topBarHeight?: string;
    bottomBarHeight?: string;
    mobile?: {
      topBarHeight?: string;
      sidebarWidthButtons?: string;
      sidebarWidthLabels?: string;
      [key: string]: any;
    };
    breakpoints?: {
      mobile?: string;
      tablet?: string;
      desktop?: string;
      [key: string]: any;
    };
    zIndex?: {
      topbar?: number;
      sidebar?: number;
      bottombar?: number;
      modal?: number;
      dropdown?: number;
      [key: string]: any;
    };
    [key: string]: any;
  };
  ui: {
    defaultSidebarVariant?: string;
    defaultShowBottomBar?: boolean;
    animationFast?: string;
    animationMedium?: string;
    animationSlow?: string;
    easingDefault?: string;
    easingBounce?: string;
    easingSharp?: string;
    [key: string]: any;
  };
  componentStyles?: {
    buttons?: {
      borderRadius?: string;
      paddingVertical?: string;
      paddingHorizontal?: string;
      fontWeight?: number;
      minHeight?: string;
      minWidth?: string;
      hoverTransform?: string;
      hoverShadow?: string;
      focusRingStyle?: string;
      [key: string]: any;
    };
    inputs?: {
      borderRadius?: string;
      padding?: string;
      fontSize?: string;
      borderWidth?: string;
      focusRingWidth?: string;
      focusRingColor?: string;
      placeholderOpacity?: string;
      [key: string]: any;
    };
    cards?: {
      borderRadius?: string;
      padding?: string;
      shadowLight?: string;
      shadowMedium?: string;
      shadowHeavy?: string;
      borderWidth?: string;
      borderStyle?: string;
      hoverElevation?: string;
      [key: string]: any;
    };
    navigation?: {
      buttonGrid?: {
        gap?: string;
        itemMinWidth?: string;
        itemMaxWidth?: string;
        itemPadding?: string;
        hoverScale?: string;
        activeScale?: string;
        [key: string]: any;
      };
      tabs?: {
        height?: string;
        borderRadius?: string;
        gap?: string;
        activeIndicatorHeight?: string;
        hoverBackground?: string;
        [key: string]: any;
      };
      [key: string]: any;
    };
    modals?: {
      backdropBlur?: string;
      borderRadius?: string;
      padding?: string;
      maxWidth?: string;
      shadow?: string;
      animationDuration?: string;
      [key: string]: any;
    };
    [key: string]: any;
  };
  branding?: {
    company?: {
      name?: string;
      displayName?: string;
      [key: string]: any;
    };
    logo?: {
      src?: string;
      alt?: string;
      width?: number;
      height?: number;
      [key: string]: any;
    };
    loginPage?: {
      title?: string;
      logo?: {
        src?: string;
        alt?: string;
        width?: number;
        height?: number;
        [key: string]: any;
      };
      [key: string]: any;
    };
    app?: {
      name?: string;
      version?: string;
      description?: string;
      [key: string]: any;
    };
    [key: string]: any;
  };
  api?: {
    baseUrl?: string;
    timeout?: number;
    retryAttempts?: number;
    retryDelay?: number;
    [key: string]: any;
  };
  auth?: {
    persistKey?: string;
    sessionTimeout?: number;
    autoLogoutWarning?: number;
    [key: string]: any;
  };
  navigation: any[];
  reports?: {
    [key: string]: any;
  };
  features?: {
    enableDebugReports?: boolean;
    enableAdvancedFilters?: boolean;
    enableThemeCustomization?: boolean;
    enableBulkOperations?: boolean;
    enableOfflineMode?: boolean;
    [key: string]: any;
  };
  [key: string]: any;
}

// ==========================================
// DEFAULT CONFIGURATION VALUES
// ==========================================

export const defaultConfig: MasterConfig = {
  theme: {
    colors: {
      primary: "#1d4ed8",
      secondary: "#2563eb",
      accent: "#2563eb",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#dc2626",
      info: "#3b82f6",
    },
    shadows: {
      shadowSmall: "0 1px 2px rgba(0, 0, 0, 0.05)",
      shadowMedium: "0 4px 6px rgba(0, 0, 0, 0.07)",
      shadowLarge: "0 10px 15px rgba(0, 0, 0, 0.1)",
      shadowXLarge: "0 20px 25px rgba(0, 0, 0, 0.15)",
      shadowInner: "inset 0 1px 2px rgba(0, 0, 0, 0.06)",
      shadowFocus: "0 0 0 3px rgba(29, 78, 216, 0.1)",
    },
    transitions: {
      transitionFast: "0.15s",
      transitionMedium: "0.3s",
      transitionSlow: "0.5s",
      easingDefault: "cubic-bezier(0.4, 0, 0.2, 1)",
      easingBounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      easingSharp: "cubic-bezier(0.4, 0, 0.6, 1)",
    },
    interactiveStates: {
      hoverOpacity: 0.8,
      activeScale: 0.98,
      focusRingWidth: "2px",
      focusRingOffset: "2px",
      disabledOpacity: 0.5,
    },
    typography: {
      fontFamilySans: '"Inter", system-ui, sans-serif',
      fontFamilyMono: '"Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", monospace',
      fontSizeSmall: "0.875rem",
      fontSizeMedium: "1rem",
      fontSizeLarge: "1.125rem",
      fontSizeXLarge: "1.25rem",
      fontWeightNormal: 400,
      fontWeightMedium: 500,
      fontWeightSemibold: 600,
      fontWeightBold: 700,
    },
    spacing: {
      spacing1: "0.25rem",
      spacing2: "0.5rem",
      spacing3: "0.75rem",
      spacing4: "1rem",
      spacing5: "1.25rem",
      spacing6: "1.5rem",
      spacing8: "2rem",
      spacing12: "3rem",
    },
    borderRadius: {
      radiusSmall: "0.25rem",
      radiusMedium: "0.5rem",
      radiusLarge: "1rem",
      radiusXLarge: "1.5rem",
    },
  },
  
  layout: {
    sidebarWidth: {
      buttons: "80px",
      labels: "280px",
      mobile: "64px",
    },
    topBarHeight: "64px",
    bottomBarHeight: "72px",
    mobile: {
      topBarHeight: "56px",
      sidebarWidthButtons: "64px",
      sidebarWidthLabels: "240px",
    },
    breakpoints: {
      mobile: "768px",
      tablet: "1024px",
      desktop: "1280px",
    },
    zIndex: {
      topbar: 100,
      sidebar: 50,
      bottombar: 200,
      modal: 1000,
      dropdown: 500,
    },
  },
  
  ui: {
    defaultSidebarVariant: "labels",
    defaultShowBottomBar: false,
    animationFast: "0.15s",
    animationMedium: "0.3s",
    animationSlow: "0.5s",
    easingDefault: "cubic-bezier(0.4, 0, 0.2, 1)",
    easingBounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    easingSharp: "cubic-bezier(0.4, 0, 0.6, 1)",
  },
  
  componentStyles: {
    buttons: {
      borderRadius: "0.5rem",
      paddingVertical: "0.75rem",
      paddingHorizontal: "1rem",
      fontWeight: 600,
      minHeight: "40px",
      minWidth: "120px",
      hoverTransform: "translateY(-1px)",
      hoverShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      focusRingStyle: "0 0 0 3px rgba(59, 130, 246, 0.3)",
    },
    inputs: {
      borderRadius: "0.5rem",
      padding: "0.75rem 1rem",
      fontSize: "0.875rem",
      borderWidth: "1px",
      focusRingWidth: "3px",
      focusRingColor: "rgba(59, 130, 246, 0.3)",
      placeholderOpacity: "0.5",
    },
    cards: {
      borderRadius: "1rem",
      padding: "1rem",
      shadowLight: "0 1px 3px rgba(0, 0, 0, 0.05)",
      shadowMedium: "0 4px 6px rgba(0, 0, 0, 0.07)",
      shadowHeavy: "0 8px 24px rgba(0, 0, 0, 0.15)",
      borderWidth: "0px",
      borderStyle: "solid",
      hoverElevation: "0 8px 16px rgba(0, 0, 0, 0.12)",
    },
    navigation: {
      buttonGrid: {
        gap: "36px",
        itemMinWidth: "280px",
        itemMaxWidth: "350px",
        itemPadding: "25px 18px",
        hoverScale: "1.02",
        activeScale: "0.98",
      },
      tabs: {
        height: "40px",
        borderRadius: "12px",
        gap: "12px",
        activeIndicatorHeight: "3px",
        hoverBackground: "rgba(0, 0, 0, 0.05)",
      },
    },
    modals: {
      backdropBlur: "8px",
      borderRadius: "1rem",
      padding: "2rem",
      maxWidth: "600px",
      shadow: "0 20px 25px rgba(0, 0, 0, 0.3)",
      animationDuration: "0.3s",
    },
    loading: {
      spinnerSize: "24px",
      spinnerThickness: "2px",
      pulseOpacity: "0.5",
      skeletonBackground: "#f3f4f6",
      skeletonHighlight: "#e5e7eb",
    },
    scrollbar: {
      width: "8px",
      thumbColor: "#d1d5db",
      trackColor: "transparent",
      thumbHoverColor: "#9ca3af",
      borderRadius: "4px",
    },
  },
  
  branding: {
    company: {
      name: "NH Lottery",
      displayName: "New Hampshire Lottery Commission",
    },
    logo: {
      src: "/nhlottery-logo.png",
      alt: "NH Lottery Logo",
      width: 180,
    },
    loginPage: {
      title: "Retailer Portal Login",
      logo: {
        src: "/nhlottery-logo.png",
        alt: "NH Lottery Logo", 
        width: 180,
      },
    },
    app: {
      name: "Retailer Portal",
      version: "1.0.0",
      description: "Comprehensive lottery retailer management system",
    },
  },
  
  api: {
    baseUrl: (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:3000/api",
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
  },
  
  auth: {
    persistKey: "loggedIn",
    sessionTimeout: 8 * 60 * 60 * 1000, // 8 hours
    autoLogoutWarning: 5 * 60 * 1000, // 5 minutes before timeout
  },
  
  navigation: [], // Will be populated from navigation.config.tsx
  reports: {}, // Will be populated from reportConfig.ts
  
  features: {
    enableDebugReports: true,
    enableAdvancedFilters: true,
    enableThemeCustomization: false,
    enableBulkOperations: false,
    enableOfflineMode: false,
  },
};

export default defaultConfig; 