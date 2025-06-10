import { MasterConfig } from "./master.config";
import { lightenColor, darkenColor, alphaColor, hexToRgb as hexToRgbUtil, getContrastColor } from "../utils/colorUtils";

/**
 * Converts hex color to RGB values for use in rgba() functions
 */
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '0, 0, 0';
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}

/**
 * Generates comprehensive semantic color variables following Material UI and Tailwind conventions
 */
function generateSemanticColorVariables(colors: any): string[] {
  const primary = colors.primary;
  const accent = colors.accent;
  const secondary = colors.secondary;
  
  // Auto-generate variants if they don't exist
  const primaryLight = colors.primaryLight || lightenColor(primary, 15);
  const primaryDark = colors.primaryDark || darkenColor(primary, 15);
  const accentBg = colors.accentBackground || lightenColor(accent, 40);
  
  // Generate contrast-safe text colors
  const primaryContrast = getContrastColor(primary);
  const secondaryContrast = getContrastColor(secondary);
  const accentContrast = getContrastColor(accent);
  
  // Auto-derive neutral colors if not provided (smart color system)
  const white = colors.white || '#ffffff';
  const grey50 = colors.grey50 || '#fafafa';
  const grey100 = colors.grey100 || '#f5f5f5';
  const grey200 = colors.grey200 || '#e5e5e5';
  const grey300 = colors.grey300 || '#d4d4d4';
  const grey400 = colors.grey400 || '#a3a3a3';
  const grey500 = colors.grey500 || '#737373';
  const grey600 = colors.grey600 || '#525252';
  const grey700 = colors.grey700 || '#404040';
  const grey800 = colors.grey800 || '#262626';
  const grey900 = colors.grey900 || '#171717';
  
  return [
    // ==========================================
    // CORE COLORS (Material UI Pattern)
    // ==========================================
    '  /* Core Brand Colors */',
    `  --color-primary: ${primary};`,
    `  --color-primary-light: ${primaryLight};`,
    `  --color-primary-dark: ${primaryDark};`,
    `  --color-primary-contrast: ${primaryContrast};`,
    
    `  --color-secondary: ${secondary};`,
    `  --color-secondary-light: ${lightenColor(secondary, 15)};`,
    `  --color-secondary-dark: ${darkenColor(secondary, 15)};`,
    `  --color-secondary-contrast: ${secondaryContrast};`,
    
    `  --color-accent: ${accent};`,
    `  --color-accent-light: ${lightenColor(accent, 15)};`,
    `  --color-accent-dark: ${darkenColor(accent, 15)};`,
    `  --color-accent-contrast: ${accentContrast};`,
    
    // RGB variants for alpha compositing
    `  --color-primary-rgb: ${hexToRgb(primary)};`,
    `  --color-secondary-rgb: ${hexToRgb(secondary)};`,
    `  --color-accent-rgb: ${hexToRgb(accent)};`,
    
    // ==========================================
    // SURFACE COLORS (Material UI Pattern)
    // ==========================================
    '  /* Surface & Background Colors */',
    `  --surface-primary: ${white};`,
    `  --surface-secondary: ${grey50};`,
    `  --surface-tertiary: ${grey100};`,
    `  --surface-paper: ${white};`,
    `  --surface-elevated: ${white};`,
    `  --surface-overlay: ${alphaColor(grey800, 0.6)};`,
    `  --surface-backdrop: ${alphaColor(grey900, 0.5)};`,
    
    // Background variants
    `  --bg-primary: ${white};`,
    `  --bg-secondary: ${grey50};`,
    `  --bg-tertiary: ${grey100};`,
    `  --bg-accent: ${accentBg};`,
    `  --bg-inverse: ${grey900};`,
    
    // ==========================================
    // TEXT COLORS (Material UI Pattern)
    // ==========================================
    '  /* Text Colors */',
    `  --text-primary: ${grey900};`,
    `  --text-secondary: ${grey700};`,
    `  --text-tertiary: ${grey600};`,
    `  --text-quaternary: ${grey500};`,
    `  --text-disabled: ${grey400};`,
    `  --text-inverse: ${white};`,
    `  --text-link: ${primary};`,
    `  --text-link-hover: ${primaryDark};`,
    
    // ==========================================
    // BORDER COLORS (Tailwind Pattern)  
    // ==========================================
    '  /* Border Colors */',
    `  --border-primary: ${grey200};`,
    `  --border-secondary: ${grey300};`,
    `  --border-tertiary: ${grey400};`,
    `  --border-accent: ${accent};`,
    `  --border-focus: ${primary};`,
    `  --border-error: ${colors.error || '#dc2626'};`,
    `  --border-success: ${colors.success || '#10b981'};`,
    `  --border-warning: ${colors.warning || '#f59e0b'};`,
    
    // ==========================================
    // INTERACTIVE STATES (Material UI Pattern)
    // ==========================================
    '  /* Interactive States */',
    `  --state-hover: ${alphaColor(primary, 0.08)};`,
    `  --state-pressed: ${alphaColor(primary, 0.12)};`,
    `  --state-focus: ${alphaColor(primary, 0.12)};`,
    `  --state-selected: ${alphaColor(primary, 0.16)};`,
    `  --state-disabled: ${alphaColor(grey500, 0.12)};`,
    
    // Action colors
    `  --action-active: ${primary};`,
    `  --action-hover: ${alphaColor(primary, 0.04)};`,
    `  --action-selected: ${alphaColor(primary, 0.08)};`,
    `  --action-disabled: ${alphaColor(grey500, 0.26)};`,
    `  --action-focus: ${alphaColor(primary, 0.12)};`,
    
    // ==========================================
    // COMPONENT-SPECIFIC COLORS
    // ==========================================
    
    // SIDEBAR - MINIMAL DESIGN
    '  /* Sidebar Colors */',
    `  --sidebar-bg: var(--surface-primary);`,
    `  --sidebar-border: var(--border-primary);`,
    `  --sidebar-shadow: ${alphaColor(grey900, 0.03)};`,
    `  --sidebar-item-bg: transparent;`,
    `  --sidebar-item-hover: rgba(var(--color-primary-rgb), 0.04);`,
    `  --sidebar-item-active: rgba(var(--color-primary-rgb), 0.08);`,
    `  --sidebar-item-text: var(--text-secondary);`,
    `  --sidebar-item-text-hover: var(--text-primary);`,
    `  --sidebar-item-text-active: var(--color-primary);`,
    `  --sidebar-indicator: var(--color-primary);`,
    
    // TOP BAR
    '  /* Top Bar Colors */',
    `  --topbar-bg: var(--surface-primary);`,
    `  --topbar-bg-elevated: var(--surface-elevated);`,
    `  --topbar-border: var(--border-primary);`,
    `  --topbar-border-subtle: ${alphaColor(grey300, 0.5)};`,
    `  --topbar-shadow: 0 1px 3px ${alphaColor(grey900, 0.03)};`,
    `  --topbar-shadow-elevated: 0 2px 8px ${alphaColor(grey900, 0.1)};`,
    `  --topbar-text: var(--text-primary);`,
    `  --topbar-text-hover: var(--color-primary);`,
    `  --topbar-text-secondary: var(--text-secondary);`,
    
    // BOTTOM BAR
    '  /* Bottom Bar Colors */',
    `  --bottombar-bg: var(--surface-elevated);`,
    `  --bottombar-border: var(--border-primary);`,
    `  --bottombar-shadow: ${alphaColor(grey900, 0.15)};`,
    `  --bottombar-item-bg: transparent;`,
    `  --bottombar-item-hover: var(--state-hover);`,
    `  --bottombar-item-active: var(--color-primary);`,
    `  --bottombar-item-text: var(--text-secondary);`,
    `  --bottombar-item-text-active: var(--color-primary-contrast);`,
    
    // BUTTONS
    '  /* Button Colors */',
    `  --btn-primary-bg: var(--color-primary);`,
    `  --btn-primary-hover: var(--color-primary-dark);`,
    `  --btn-primary-active: ${darkenColor(primary, 20)};`,
    `  --btn-primary-text: var(--color-primary-contrast);`,
    `  --btn-primary-border: var(--color-primary);`,
    
    `  --btn-secondary-bg: var(--color-secondary);`,
    `  --btn-secondary-hover: var(--color-secondary-dark);`,
    `  --btn-secondary-active: ${darkenColor(secondary, 20)};`,
    `  --btn-secondary-text: var(--color-secondary-contrast);`,
    `  --btn-secondary-border: var(--color-secondary);`,
    
    `  --btn-accent-bg: var(--color-accent);`,
    `  --btn-accent-hover: var(--color-accent-dark);`,
    `  --btn-accent-active: ${darkenColor(accent, 20)};`,
    `  --btn-accent-text: var(--color-accent-contrast);`,
    `  --btn-accent-border: var(--color-accent);`,
    
    `  --btn-ghost-bg: transparent;`,
    `  --btn-ghost-hover: var(--state-hover);`,
    `  --btn-ghost-active: var(--state-pressed);`,
    `  --btn-ghost-text: var(--color-primary);`,
    `  --btn-ghost-border: transparent;`,
    `  --btn-ghost-border-hover: var(--border-primary);`,
    
    // New: Ghost Secondary variant
    `  --btn-ghost-secondary-bg: transparent;`,
    `  --btn-ghost-secondary-hover: ${alphaColor(secondary, 0.08)};`,
    `  --btn-ghost-secondary-active: ${alphaColor(secondary, 0.12)};`,
    `  --btn-ghost-secondary-text: var(--color-secondary);`,
    `  --btn-ghost-secondary-border: transparent;`,
    `  --btn-ghost-secondary-border-hover: var(--color-secondary);`,
    
    '  /* Button Shadows */',
    `  --btn-shadow-hover: 0 2px 8px ${alphaColor(primary, 0.3)};`,
    `  --btn-shadow-secondary: 0 2px 8px ${alphaColor(secondary, 0.3)};`,
    `  --btn-primary-border-hover: var(--color-primary-dark);`,
    `  --btn-secondary-border-hover: var(--color-secondary-dark);`,
    
    // NAVIGATION BUTTONS
    '  /* Navigation Button Colors */',
    `  --nav-btn-bg: var(--surface-primary);`,
    `  --nav-btn-hover: var(--surface-tertiary);`,
    `  --nav-btn-active: var(--bg-accent);`,
    `  --nav-btn-text: var(--text-primary);`,
    `  --nav-btn-text-active: var(--color-accent);`,
    `  --nav-btn-border: var(--border-primary);`,
    `  --nav-btn-shadow: ${alphaColor(grey900, 0.05)};`,
    `  --nav-btn-shadow-hover: ${alphaColor(grey900, 0.1)};`,
    
    // Secondary navigation elements
    `  --nav-btn-secondary-bg: ${alphaColor(secondary, 0.08)};`,
    `  --nav-btn-secondary-hover: ${alphaColor(secondary, 0.12)};`,
    `  --nav-btn-secondary-active: var(--color-secondary);`,
    `  --nav-btn-secondary-text: var(--color-secondary);`,
    `  --nav-btn-secondary-text-active: var(--color-secondary-contrast);`,
    `  --nav-btn-secondary-border: var(--color-secondary);`,
    
    // TABS - MINIMAL DESIGN
    '  /* Tab Colors */',
    `  --tab-bg: transparent;`,
    `  --tab-hover: rgba(var(--color-primary-rgb), 0.04);`,
    `  --tab-active: rgba(var(--color-primary-rgb), 0.08);`,
    `  --tab-text: var(--text-secondary);`,
    `  --tab-text-active: var(--color-primary);`,
    `  --tab-border: var(--border-primary);`,
    `  --tab-border-hover: var(--border-secondary);`,
    `  --tab-border-active: rgba(var(--color-primary-rgb), 0.2);`,
    `  --tab-indicator: var(--color-primary);`,
    `  --tab-shadow-active: none;`,
    `  --tab-shadow-hover: none;`,
    `  --tab-container-bg: var(--surface-secondary);`,
    `  --tab-container-shadow: 0 1px 2px ${alphaColor(grey900, 0.05)};`,
    
    // Secondary tabs for supporting content
    `  --tab-secondary-hover: rgba(var(--color-secondary-rgb), 0.04);`,
    `  --tab-secondary-active: rgba(var(--color-secondary-rgb), 0.08);`,
    `  --tab-secondary-text-active: var(--color-secondary);`,
    `  --tab-secondary-border-active: rgba(var(--color-secondary-rgb), 0.2);`,
    `  --tab-secondary-indicator: var(--color-secondary);`,
    
    // CARDS
    '  /* Card Colors */',
    `  --card-bg: var(--surface-primary);`,
    `  --card-hover: var(--surface-secondary);`,
    `  --card-border: var(--border-primary);`,
    `  --card-shadow: ${alphaColor(grey900, 0.05)};`,
    `  --card-shadow-hover: ${alphaColor(grey900, 0.1)};`,
    `  --card-shadow-elevated: ${alphaColor(grey900, 0.15)};`,
    
    // INPUTS
    '  /* Input Colors */',
    `  --input-bg: var(--surface-primary);`,
    `  --input-border: var(--border-primary);`,
    `  --input-border-hover: var(--border-secondary);`,
    `  --input-border-focus: var(--border-focus);`,
    `  --input-text: var(--text-primary);`,
    `  --input-placeholder: var(--text-tertiary);`,
    `  --input-shadow-hover: 0 2px 4px ${alphaColor(grey900, 0.08)};`,
    `  --input-shadow-focus: 0 0 0 3px ${alphaColor(primary, 0.1)};`,
    
    // STATUS COLORS
    '  /* Status Colors */',
    `  --status-success: ${colors.success || '#10b981'};`,
    `  --status-success-light: ${lightenColor(colors.success || '#10b981', 15)};`,
    `  --status-success-dark: ${darkenColor(colors.success || '#10b981', 15)};`,
    `  --status-success-bg: ${alphaColor(colors.success || '#10b981', 0.1)};`,
    `  --status-success-contrast: ${getContrastColor(colors.success || '#10b981')};`,
    
    `  --status-warning: ${colors.warning || '#f59e0b'};`,
    `  --status-warning-light: ${lightenColor(colors.warning || '#f59e0b', 15)};`,
    `  --status-warning-dark: ${darkenColor(colors.warning || '#f59e0b', 15)};`,
    `  --status-warning-bg: ${alphaColor(colors.warning || '#f59e0b', 0.1)};`,
    `  --status-warning-contrast: ${getContrastColor(colors.warning || '#f59e0b')};`,
    
    `  --status-error: ${colors.error || '#dc2626'};`,
    `  --status-error-light: ${lightenColor(colors.error || '#dc2626', 15)};`,
    `  --status-error-dark: ${darkenColor(colors.error || '#dc2626', 15)};`,
    `  --status-error-bg: ${alphaColor(colors.error || '#dc2626', 0.1)};`,
    `  --status-error-contrast: ${getContrastColor(colors.error || '#dc2626')};`,
    
    `  --status-info: ${colors.info || '#3b82f6'};`,
    `  --status-info-light: ${lightenColor(colors.info || '#3b82f6', 15)};`,
    `  --status-info-dark: ${darkenColor(colors.info || '#3b82f6', 15)};`,
    `  --status-info-bg: ${alphaColor(colors.info || '#3b82f6', 0.1)};`,
    `  --status-info-contrast: ${getContrastColor(colors.info || '#3b82f6')};`,
    
    // Secondary status for informational elements
    `  --status-secondary: var(--color-secondary);`,
    `  --status-secondary-light: var(--color-secondary-light);`,
    `  --status-secondary-dark: var(--color-secondary-dark);`,
    `  --status-secondary-bg: ${alphaColor(secondary, 0.1)};`,
    `  --status-secondary-contrast: var(--color-secondary-contrast);`,
    
    // Form element states
    '  /* Form Secondary States */',
    `  --form-secondary-focus: var(--color-secondary);`,
    `  --form-secondary-border: ${alphaColor(secondary, 0.3)};`,
    `  --form-secondary-bg: ${alphaColor(secondary, 0.05)};`,
    `  --form-label-secondary: var(--color-secondary);`,
    `  --form-help-text: ${alphaColor(secondary, 0.8)};`,
  ];
}

/**
 * Generates CSS custom properties (CSS variables) from the configuration
 * This allows SCSS/CSS files to use configuration values dynamically
 */
export function generateCSSVariables(config: MasterConfig): string {
  const { theme, layout, ui, componentStyles, branding, api, auth, features } = config;
  
  const cssVariables = [
    '/* Auto-generated CSS variables from configuration */',
    '/* Based on Material UI and Tailwind design system patterns */',
    ':root {',
    
    // Comprehensive semantic color system
    ...generateSemanticColorVariables(theme.colors),
    '',
    
    // Shadow system
    '  /* Shadow System */',
    `  --shadow-sm: ${theme.shadows.shadowSmall};`,
    `  --shadow-md: ${theme.shadows.shadowMedium};`,
    `  --shadow-lg: ${theme.shadows.shadowLarge};`,
    `  --shadow-xl: ${theme.shadows.shadowXLarge};`,
    `  --shadow-inner: ${theme.shadows.shadowInner};`,
    `  --shadow-focus: ${theme.shadows.shadowFocus};`,
    '',
    
    // Transition system
    '  /* Transition System */',
    `  --transition-fast: ${theme.transitions.transitionFast};`,
    `  --transition-medium: ${theme.transitions.transitionMedium};`,
    `  --transition-slow: ${theme.transitions.transitionSlow};`,
    `  --easing-default: ${theme.transitions.easingDefault};`,
    `  --easing-bounce: ${theme.transitions.easingBounce};`,
    `  --easing-sharp: ${theme.transitions.easingSharp};`,
    '',
    
    // Interactive states
    '  /* Interactive States */',
    `  --hover-opacity: ${theme.interactiveStates.hoverOpacity};`,
    `  --active-scale: ${theme.interactiveStates.activeScale};`,
    `  --focus-ring-width: ${theme.interactiveStates.focusRingWidth};`,
    `  --focus-ring-offset: ${theme.interactiveStates.focusRingOffset};`,
    `  --disabled-opacity: ${theme.interactiveStates.disabledOpacity};`,
    '',
    
    // Typography
    '  /* Typography */',
    `  --font-family-sans: ${theme.typography.fontFamilySans};`,
    `  --font-family-mono: ${theme.typography.fontFamilyMono};`,
    `  --font-size-small: ${theme.typography.fontSizeSmall};`,
    `  --font-size-medium: ${theme.typography.fontSizeMedium};`,
    `  --font-size-large: ${theme.typography.fontSizeLarge};`,
    `  --font-size-xlarge: ${theme.typography.fontSizeXLarge};`,
    `  --font-weight-normal: ${theme.typography.fontWeightNormal};`,
    `  --font-weight-medium: ${theme.typography.fontWeightMedium};`,
    `  --font-weight-semibold: ${theme.typography.fontWeightSemibold};`,
    `  --font-weight-bold: ${theme.typography.fontWeightBold};`,
    
    // Spacing (Tailwind-like)
    '  /* Spacing */',
    `  --spacing-1: ${theme.spacing.spacing1};`,
    `  --spacing-2: ${theme.spacing.spacing2};`,
    `  --spacing-3: ${theme.spacing.spacing3};`,
    `  --spacing-4: ${theme.spacing.spacing4};`,
    `  --spacing-5: ${theme.spacing.spacing5};`,
    `  --spacing-6: ${theme.spacing.spacing6};`,
    `  --spacing-8: ${theme.spacing.spacing8};`,
    `  --spacing-12: ${theme.spacing.spacing12};`,
    
    // Border Radius (Tailwind-like)
    '  /* Border Radius */',
    `  --radius-sm: ${theme.borderRadius.radiusSmall};`,
    `  --radius-md: ${theme.borderRadius.radiusMedium};`,
    `  --radius-lg: ${theme.borderRadius.radiusLarge};`,
    `  --radius-xl: ${theme.borderRadius.radiusXLarge};`,
    `  --radius-full: 9999px;`,
    
    // Layout
    '  /* Layout */',
    `  --sidebar-width-buttons: ${layout.sidebarWidth.buttons};`,
    `  --sidebar-width-labels: ${layout.sidebarWidth.labels};`,
    `  --topbar-height: ${layout.topBarHeight};`,
    `  --bottombar-height: ${layout.bottomBarHeight};`,
    `  --breakpoint-mobile: ${layout.breakpoints.mobile};`,
    `  --breakpoint-tablet: ${layout.breakpoints.tablet};`,
    `  --breakpoint-desktop: ${layout.breakpoints.desktop};`,
    `  --z-topbar: ${layout.zIndex.topbar};`,
    `  --z-sidebar: ${layout.zIndex.sidebar};`,
    `  --z-bottombar: ${layout.zIndex.bottombar};`,
    `  --z-modal: ${layout.zIndex.modal};`,
    `  --z-dropdown: ${layout.zIndex.dropdown};`,
    
    // UI Behavior (Legacy - use theme.transitions instead)
    '  /* Animations & Timing (Legacy) */',
    `  --transition-normal: ${ui.animationMedium};`,
    
    // Component Styles
    '  /* Component Variables */',
    `  --button-radius: ${componentStyles.buttons.borderRadius};`,
    `  --button-padding-y: ${componentStyles.buttons.paddingVertical};`,
    `  --button-padding-x: ${componentStyles.buttons.paddingHorizontal};`,
    `  --button-font-weight: ${componentStyles.buttons.fontWeight};`,
    `  --button-min-height: ${componentStyles.buttons.minHeight};`,
    `  --button-transform-hover: ${componentStyles.buttons.hoverTransform};`,
    
    `  --input-radius: ${componentStyles.inputs.borderRadius};`,
    `  --input-padding: ${componentStyles.inputs.padding};`,
    `  --input-font-size: ${componentStyles.inputs.fontSize};`,
    
    `  --card-radius: ${componentStyles.cards.borderRadius};`,
    `  --card-padding: ${componentStyles.cards.padding};`,
    
    // Branding
    '  /* Branding */',
    `  --brand-company-name: "${branding.company.name}";`,
    `  --brand-app-name: "${branding.app.name}";`,
    `  --brand-app-version: "${branding.app.version}";`,
    `  --brand-logo-src: "${branding.logo.src}";`,
    `  --brand-logo-alt: "${branding.logo.alt}";`,
    `  --brand-logo-width: ${branding.logo.width || 'auto'};`,
    `  --brand-logo-height: ${branding.logo.height || 'auto'};`,
    
    '}',
    '',
    '/* Legacy compatibility variables */',
    ':root {',
    `  --color-primary: ${theme.colors.primary};`,
    `  --color-accent: ${theme.colors.accent};`,
    `  --color-success: ${theme.colors.success};`,
    `  --color-warning: ${theme.colors.warning};`,
    `  --color-error: ${theme.colors.error};`,
    `  --color-grey-50: ${theme.colors.grey50};`,
    `  --color-grey-100: ${theme.colors.grey100};`,
    `  --color-grey-200: ${theme.colors.grey200};`,
    `  --color-grey-300: ${theme.colors.grey300};`,
    `  --color-grey-400: ${theme.colors.grey400};`,
    `  --color-grey-500: ${theme.colors.grey500};`,
    `  --color-grey-600: ${theme.colors.grey600};`,
    `  --color-grey-700: ${theme.colors.grey700};`,
    `  --color-grey-800: ${theme.colors.grey800};`,
    `  --color-grey-900: ${theme.colors.grey900};`,
    `  --color-white: ${theme.colors.white};`,
    '}',
  ];
  
  return cssVariables.join('\n');
}

/**
 * Injects CSS variables into the document head
 */
export function injectCSSVariables(config: MasterConfig): void {
  const cssContent = generateCSSVariables(config);
  
  // Remove existing config variables
  const existingStyle = document.getElementById('config-variables');
  if (existingStyle) {
    existingStyle.remove();
  }
  
  // Create and inject new style element
  const styleElement = document.createElement('style');
  styleElement.id = 'config-variables';
  styleElement.textContent = cssContent;
  document.head.appendChild(styleElement);
}

/**
 * Generates SCSS variables file content from configuration
 * Use this to create a _config-variables.scss file
 */
export function generateSCSSVariables(config: MasterConfig): string {
  const { theme, layout, ui, componentStyles, branding, api, auth, features } = config;
  
  const scssVariables = [
    '// Auto-generated SCSS variables from configuration',
    '// Do not edit this file directly - modify master.config.ts instead',
    '',
    
    // Theme Colors
    '// Theme Colors',
    `$color-primary: ${theme.colors.primary};`,
    `$color-primary-dark: ${theme.colors.primaryDark};`,
    `$color-primary-light: ${theme.colors.primaryLight};`,
    `$color-secondary: ${theme.colors.secondary};`,
    `$color-secondary-dark: ${theme.colors.secondaryDark};`,
    `$color-secondary-light: ${theme.colors.secondaryLight};`,
    `$color-accent: ${theme.colors.accent};`,
    `$color-accent-bg: ${theme.colors.accentBackground};`,
    `$color-success: ${theme.colors.success};`,
    `$color-warning: ${theme.colors.warning};`,
    `$color-error: ${theme.colors.error};`,
    `$color-info: ${theme.colors.info};`,
    `$color-grey-50: ${theme.colors.grey50};`,
    `$color-grey-100: ${theme.colors.grey100};`,
    `$color-grey-200: ${theme.colors.grey200};`,
    `$color-grey-300: ${theme.colors.grey300};`,
    `$color-grey-400: ${theme.colors.grey400};`,
    `$color-grey-500: ${theme.colors.grey500};`,
    `$color-grey-600: ${theme.colors.grey600};`,
    `$color-grey-700: ${theme.colors.grey700};`,
    `$color-grey-800: ${theme.colors.grey800};`,
    `$color-grey-900: ${theme.colors.grey900};`,
    `$color-white: ${theme.colors.white};`,
    '',
    
    // Legacy compatibility
    '// Legacy SCSS variables (for backward compatibility)',
    `$blue-500: ${theme.colors.primary};`,
    `$blue-600: ${theme.colors.accent};`,
    `$blue-100: ${theme.colors.accentBackground};`,
    `$grey-50: ${theme.colors.grey50};`,
    `$grey-100: ${theme.colors.grey100};`,
    `$grey-200: ${theme.colors.grey200};`,
    `$grey-300: ${theme.colors.grey300};`,
    `$grey-600: ${theme.colors.grey600};`,
    `$grey-700: ${theme.colors.grey700};`,
    `$grey-800: ${theme.colors.grey800};`,
    `$grey-900: ${theme.colors.grey900};`,
    `$white: ${theme.colors.white};`,
    `$accent-color: ${theme.colors.accent};`,
    `$accent-color-bg: ${theme.colors.accentBackground};`,
    '',
    
    // Typography
    '// Typography',
    `$font-family-sans: ${theme.typography.fontFamilySans};`,
    `$font-family-mono: ${theme.typography.fontFamilyMono};`,
    '',
    
    // Spacing
    '// Spacing',
    `$spacing-1: ${theme.spacing.spacing1};`,
    `$spacing-2: ${theme.spacing.spacing2};`,
    `$spacing-3: ${theme.spacing.spacing3};`,
    `$spacing-4: ${theme.spacing.spacing4};`,
    `$spacing-5: ${theme.spacing.spacing5};`,
    `$spacing-6: ${theme.spacing.spacing6};`,
    `$spacing-8: ${theme.spacing.spacing8};`,
    `$spacing-12: ${theme.spacing.spacing12};`,
    '',
    
    // Border Radius
    '// Border Radius',
    `$radius-sm: ${theme.borderRadius.radiusSmall};`,
    `$radius-md: ${theme.borderRadius.radiusMedium};`,
    `$radius-lg: ${theme.borderRadius.radiusLarge};`,
    `$radius-xl: ${theme.borderRadius.radiusXLarge};`,
    '',
    
    // Z-index
    '// Z-index layers',
    `$z-topbar: ${layout.zIndex.topbar};`,
    `$z-sidebar: ${layout.zIndex.sidebar};`,
    `$z-bottombar: ${layout.zIndex.bottombar};`,
    `$z-modal: ${layout.zIndex.modal};`,
    `$z-dropdown: ${layout.zIndex.dropdown};`,
  ];
  
  return scssVariables.join('\n');
} 