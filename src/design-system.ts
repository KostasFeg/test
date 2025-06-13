/**
 * 🎨 **Design‑System One‑Stop Shop v2**  (single‑file, zero‑deps)
 * ──────────────────────────────────────────────────────────────────
 *   • Accepts a gigantic JSON config (see README)
 *   • Returns fully‑typed design tokens ready for MUI `createTheme()` **or** any renderer
 *   • Colour science upgraded → hue‑preserving HSL tints, α‑aware parsing, WCAG contrast picks
 *   • Everything lives in **this one TS file** for drop‑in convenience.
 *
 *   import config from './design‑config.json'
 *   const tokens = buildDesignTokens(config)
 *   // → tokens.palette.primary[500] === '#2563eb'
 *
 *   No runtime dependencies, <4 KB gzipped.
 */

/* -------------------------------------------------- */
/*  0. Top‑level Config Types                         */
/* -------------------------------------------------- */

export interface DesignSystemConfig {
  theme: ThemeSection;
  layout?: LayoutSection;
  ui?: Record<string, any>;
  componentStyles?: Record<string, any>;
  branding?: Record<string, any>;
  api?: Record<string, any>;
  auth?: Record<string, any>;
  features?: Record<string, boolean>;
  navigation?: NavigationItem[];
}

/* ───── THEME SUB‑SECTION ─────────────────────────── */
export interface ThemeSection {
  colors: ColorConfig;
  typography?: TypographyConfig;
  spacing?: SpacingConfig;
  borderRadius?: BorderRadiusConfig;
  shadows?: ShadowsConfig;
  transitions?: TransitionsConfig;
  interactiveStates?: InteractiveStatesConfig;
}

/* colours are arbitrary keys → CSS colour strings */
export type ColorConfig = Record<string, string>;

export interface TypographyConfig {
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
}

export type SpacingConfig = Record<string, string>;
export type BorderRadiusConfig = Record<string, string>;
export type ShadowsConfig = Record<string, string>;
export type TransitionsConfig = Record<string, string | number>;
export type InteractiveStatesConfig = Record<string, string | number>;

export interface LayoutSection {
  sidebarWidth?: Record<string, string>;
  topBarHeight?: string;
  bottomBarHeight?: string;
  mobile?: Record<string, string>;
  breakpoints?: Record<string, string>;
  zIndex?: Record<string, number>;
}

export interface NavigationItem {
  slug: string;
  label: string;
  display?: string;
  children?: NavigationItem[];
}

/* -------------------------------------------------- */
/*  1. Public Return Types                            */
/* -------------------------------------------------- */

export interface DesignTokens {
  palette: Palette;
  typography: Required<TypographyConfig>;
  spacing: SpacingConfig;
  radius: BorderRadiusConfig;
  shadows: ShadowsConfig;
  transitions: TransitionsConfig;
  interactive: InteractiveStatesConfig;
  layout: LayoutSection;
  /** untouched extra sections (branding, api, etc.) */
  _raw?: Omit<DesignSystemConfig, "theme">;
}

/* -------------------------------------------------- */
/*  2. Build ‑ top entry‑point                        */
/* -------------------------------------------------- */

export const buildDesignTokens = (cfg: DesignSystemConfig): DesignTokens => {
  const {
    theme: {
      colors,
      typography = {},
      spacing = {},
      borderRadius = {},
      shadows = {},
      transitions = {},
      interactiveStates = {},
    },
    ...rest
  } = cfg;

  const palette = buildPalette(colors);

  const defaultType: Required<TypographyConfig> = {
    fontFamilySans: "system‑ui, sans‑serif",
    fontFamilyMono: "monospace",
    fontSizeSmall: "0.875rem",
    fontSizeMedium: "1rem",
    fontSizeLarge: "1.125rem",
    fontSizeXLarge: "1.25rem",
    fontWeightNormal: 400,
    fontWeightMedium: 500,
    fontWeightSemibold: 600,
    fontWeightBold: 700,
  };

  /* defaults then user‑override */
  const typo: Required<TypographyConfig> = { ...defaultType, ...typography };

  const defaultSpacing: SpacingConfig = {
    spacing1: "0.25rem",
    spacing2: "0.5rem",
    spacing3: "0.75rem",
    spacing4: "1rem",
    spacing5: "1.25rem",
    spacing6: "1.5rem",
  };
  const defaultRadius: BorderRadiusConfig = { radiusMedium: "0.5rem" };

  /* Default transition durations – used by many SCSS modules */
  const defaultTransitions: TransitionsConfig = {
    fast: "150ms",
    normal: "300ms",
    slow: "450ms",
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  };

  return {
    palette,
    typography: typo,
    spacing: { ...defaultSpacing, ...spacing },
    radius: { ...defaultRadius, ...borderRadius },
    shadows,
    /* merge so user-provided overrides win but sensible fallbacks always exist */
    transitions: { ...defaultTransitions, ...transitions },
    interactive: interactiveStates,
    layout: rest.layout ?? {},
    _raw: rest,
  };
};

/* -------------------------------------------------- */
/*  3. Palette Types                                  */
/* -------------------------------------------------- */

export type PaletteColorScale = {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  main: string;
  light: string;
  dark: string;
  contrastText: string;
};

export interface Palette {
  primary: PaletteColorScale;
  secondary: PaletteColorScale;
  accent: PaletteColorScale;
  success: PaletteColorScale;
  warning: PaletteColorScale;
  error: PaletteColorScale;
  info: PaletteColorScale;
  grey: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  text: { primary: string; secondary: string; disabled: string };
  divider: string;
  background: { paper: string; default: string };
}

/* -------------------------------------------------- */
/*  4. Colour‑science helpers (alpha + HSL)           */
/* -------------------------------------------------- */

/* internal RGBA model */
interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

/** Accepts #rgb, #rgba, #rrggbb, #rrggbbaa, rgb(), rgba(), hsl(), hsla() → RGBA */
const parseColor = (value: string | Partial<RGBA>): RGBA => {
  if (typeof value !== "string") return { ...value, a: value.a ?? 1 } as RGBA;
  const v = value.trim();
  /* hex */
  if (v.startsWith("#")) {
    const hex = v.slice(1);
    const len = hex.length;
    const isShort = len === 3 || len === 4;
    if (![3, 4, 6, 8].includes(len))
      throw new Error(`Bad hex length (${len}) in "${v}"`);
    const toByte = (i: number) => {
      const part = isShort ? hex[i] : hex.slice(i * 2, i * 2 + 2);
      return parseInt(isShort ? part + part : part, 16);
    };
    const r = toByte(0),
      g = toByte(1),
      b = toByte(2);
    const a = len === 4 || len === 8 ? toByte(isShort ? 3 : 3) / 255 : 1;
    return { r, g, b, a };
  }
  /* rgb/rgba */
  const rgbMatch = v.match(/rgba?\(([^)]+)\)/i);
  if (rgbMatch) {
    const parts = rgbMatch[1].split(/\s*,\s*/).map(Number);
    const [r, g, b, a = 1] = parts;
    return { r, g, b, a };
  }
  /* hsl/hsla */
  const hslMatch = v.match(/hsla?\(([^)]+)\)/i);
  if (hslMatch) {
    const [hRaw, sRaw, lRaw, aRaw] = hslMatch[1].split(/\s*,\s*/);
    const h = parseFloat(hRaw) / 360;
    const s = parseFloat(sRaw) / 100;
    const l = parseFloat(lRaw) / 100;
    const { r, g, b } = hslToRgb({ h, s, l });
    return { r, g, b, a: aRaw ? Number(aRaw) : 1 };
  }
  throw new Error(`Unsupported colour format: ${value}`);
};

const clampByte = (n: number) => Math.round(Math.max(0, Math.min(255, n)));
const rgbaToHex = ({ r, g, b, a }: RGBA): string =>
  `#${[r, g, b, clampByte(a * 255)].map((x) => clampByte(x).toString(16).padStart(2, "0")).join("")}`;

/* RGB <-> HSL helpers (0‑1 ranges) */
const rgbToHsl = ({ r, g, b }: RGBA) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h, s, l } as const;
};

const hslToRgb = ({
  h,
  s,
  l,
}: {
  h: number;
  s: number;
  l: number;
}): { r: number; g: number; b: number } => {
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  if (s === 0) {
    const v = clampByte(l * 255);
    return { r: v, g: v, b: v };
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = hue2rgb(p, q, h + 1 / 3);
  const g = hue2rgb(p, q, h);
  const b = hue2rgb(p, q, h - 1 / 3);
  return {
    r: clampByte(r * 255),
    g: clampByte(g * 255),
    b: clampByte(b * 255),
  };
};

/* perceptual lighten/darken via HSL L channel */
const lighten = (hex: string, amt = 0.2) => {
  const col = parseColor(hex);
  const hsl = rgbToHsl(col);
  return rgbaToHex({
    ...hslToRgb({ ...hsl, l: Math.min(1, hsl.l + amt) }),
    a: col.a,
  });
};

const darken = (hex: string, amt = 0.2) => {
  const col = parseColor(hex);
  const hsl = rgbToHsl(col);
  return rgbaToHex({
    ...hslToRgb({ ...hsl, l: Math.max(0, hsl.l - amt) }),
    a: col.a,
  });
};

/* WCAG luminance & contrast */
const relLuminance = (hex: string) => {
  const { r, g, b } = parseColor(hex);
  const toLinear = (c: number) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
};
const contrastRatio = (L1: number, L2: number) => (L1 + 0.05) / (L2 + 0.05);
const chooseReadable = (bg: string) => {
  const L = relLuminance(bg);
  const white = contrastRatio(1, L);
  const black = contrastRatio(L, 0);
  return white >= black ? "#ffffff" : "#000000";
};

/* -------------------------------------------------- */
/*  5. Palette builder                                */
/* -------------------------------------------------- */

/* perceptually‑weighted tint curve (closer to MUI) */
const STEPS: Record<number, number> = {
  50: 0.95,
  100: 0.9,
  200: 0.75,
  300: 0.6,
  400: 0.3,
  500: 0,
  600: 0.07,
  700: 0.15,
  800: 0.25,
  900: 0.4,
};

// memoise generated scales so repeated seeds are free.
const scaleCache = new Map<string, PaletteColorScale>();

const generateScale = (seed: string): PaletteColorScale => {
  if (scaleCache.has(seed)) return scaleCache.get(seed)!;
  const scale: Partial<PaletteColorScale> = {};
  Object.entries(STEPS).forEach(([k, amt]) => {
    const n = Number(k);
    scale[n] = n <= 500 ? lighten(seed, amt) : darken(seed, amt);
  });
  scale.main = seed;
  scale.light = scale[300]!;
  scale.dark = scale[700]!;
  scale.contrastText = chooseReadable(seed);
  const full = scale as PaletteColorScale;
  scaleCache.set(seed, full);
  return full;
};

const buildPalette = (c: ColorConfig): Palette => {
  return {
    primary: generateScale(c.primary ?? "#2563eb"),
    secondary: generateScale(c.secondary ?? "#64748b"),
    accent: generateScale(c.accent ?? "#06b6d4"),
    success: generateScale(c.success ?? "#10b981"),
    warning: generateScale(c.warning ?? "#f59e0b"),
    error: generateScale(c.error ?? "#ef4444"),
    info: generateScale(c.info ?? "#3b82f6"),
    grey: {
      50: c.grey50 ?? "#f9fafb",
      100: c.grey100 ?? "#f3f4f6",
      200: c.grey200 ?? "#e5e7eb",
      300: c.grey300 ?? "#d1d5db",
      400: c.grey400 ?? "#9ca3af",
      500: c.grey500 ?? "#6b7280",
      600: c.grey600 ?? "#4b5563",
      700: c.grey700 ?? "#374151",
      800: c.grey800 ?? "#1f2937",
      900: c.grey900 ?? "#111827",
    },
    divider: c.grey200 ?? "#e5e7eb",
    background: {
      paper: c.grey50 ?? "#ffffff",
      default: c.grey100 ?? "#f9fafb",
    },
    text: {
      primary: c.grey900 ?? "#111827",
      secondary: c.grey700 ?? "#374151",
      disabled: c.grey500 ?? "#6b7280",
    },
  };
};

/* -------------------------------------------------- */
/*  6. Utility Functions for CSS Variables Generation */
/* -------------------------------------------------- */

export const generateCSSVariables = (tokens: DesignTokens): string => {
  const {
    palette,
    typography,
    spacing,
    radius,
    shadows,
    transitions,
    interactive,
    layout,
  } = tokens;

  const cssVariables = [
    ":root {",
    "  /* Design System CSS Variables */",
    "",
    "  /* Palette Colors */",
    `  --color-primary: ${palette.primary.main};`,
    `  --color-primary-50: ${palette.primary[50]};`,
    `  --color-primary-100: ${palette.primary[100]};`,
    `  --color-primary-200: ${palette.primary[200]};`,
    `  --color-primary-300: ${palette.primary[300]};`,
    `  --color-primary-400: ${palette.primary[400]};`,
    `  --color-primary-500: ${palette.primary[500]};`,
    `  --color-primary-600: ${palette.primary[600]};`,
    `  --color-primary-700: ${palette.primary[700]};`,
    `  --color-primary-800: ${palette.primary[800]};`,
    `  --color-primary-900: ${palette.primary[900]};`,
    `  --color-primary-light: ${palette.primary.light};`,
    `  --color-primary-dark: ${palette.primary.dark};`,
    `  --color-primary-contrast: ${palette.primary.contrastText};`,
    "",
    `  --color-secondary: ${palette.secondary.main};`,
    `  --color-secondary-50: ${palette.secondary[50]};`,
    `  --color-secondary-100: ${palette.secondary[100]};`,
    `  --color-secondary-200: ${palette.secondary[200]};`,
    `  --color-secondary-300: ${palette.secondary[300]};`,
    `  --color-secondary-400: ${palette.secondary[400]};`,
    `  --color-secondary-500: ${palette.secondary[500]};`,
    `  --color-secondary-600: ${palette.secondary[600]};`,
    `  --color-secondary-700: ${palette.secondary[700]};`,
    `  --color-secondary-800: ${palette.secondary[800]};`,
    `  --color-secondary-900: ${palette.secondary[900]};`,
    `  --color-secondary-light: ${palette.secondary.light};`,
    `  --color-secondary-dark: ${palette.secondary.dark};`,
    `  --color-secondary-contrast: ${palette.secondary.contrastText};`,
    "",
    `  --color-accent: ${palette.accent.main};`,
    `  --color-accent-50: ${palette.accent[50]};`,
    `  --color-accent-100: ${palette.accent[100]};`,
    `  --color-accent-200: ${palette.accent[200]};`,
    `  --color-accent-300: ${palette.accent[300]};`,
    `  --color-accent-400: ${palette.accent[400]};`,
    `  --color-accent-500: ${palette.accent[500]};`,
    `  --color-accent-600: ${palette.accent[600]};`,
    `  --color-accent-700: ${palette.accent[700]};`,
    `  --color-accent-800: ${palette.accent[800]};`,
    `  --color-accent-900: ${palette.accent[900]};`,
    `  --color-accent-light: ${palette.accent.light};`,
    `  --color-accent-dark: ${palette.accent.dark};`,
    `  --color-accent-contrast: ${palette.accent.contrastText};`,
    "",
    `  --color-success: ${palette.success.main};`,
    `  --color-success-light: ${palette.success.light};`,
    `  --color-success-dark: ${palette.success.dark};`,
    `  --color-success-contrast: ${palette.success.contrastText};`,
    "",
    `  --color-warning: ${palette.warning.main};`,
    `  --color-warning-light: ${palette.warning.light};`,
    `  --color-warning-dark: ${palette.warning.dark};`,
    `  --color-warning-contrast: ${palette.warning.contrastText};`,
    "",
    `  --color-error: ${palette.error.main};`,
    `  --color-error-light: ${palette.error.light};`,
    `  --color-error-dark: ${palette.error.dark};`,
    `  --color-error-contrast: ${palette.error.contrastText};`,
    "",
    `  --color-info: ${palette.info.main};`,
    `  --color-info-light: ${palette.info.light};`,
    `  --color-info-dark: ${palette.info.dark};`,
    `  --color-info-contrast: ${palette.info.contrastText};`,
    "",
    "  /* Grey Scale */",
    `  --color-grey-50: ${palette.grey[50]};`,
    `  --color-grey-100: ${palette.grey[100]};`,
    `  --color-grey-200: ${palette.grey[200]};`,
    `  --color-grey-300: ${palette.grey[300]};`,
    `  --color-grey-400: ${palette.grey[400]};`,
    `  --color-grey-500: ${palette.grey[500]};`,
    `  --color-grey-600: ${palette.grey[600]};`,
    `  --color-grey-700: ${palette.grey[700]};`,
    `  --color-grey-800: ${palette.grey[800]};`,
    `  --color-grey-900: ${palette.grey[900]};`,
    "",
    "  /* Text Colors */",
    `  --text-primary: ${palette.text.primary};`,
    `  --text-secondary: ${palette.text.secondary};`,
    `  --text-disabled: ${palette.text.disabled};`,
    "",
    "  /* Background Colors */",
    `  --bg-default: ${palette.background.default};`,
    `  --bg-paper: ${palette.background.paper};`,
    `  --bg-divider: ${palette.divider};`,
    "",
    "  /* Typography */",
    `  --font-family-sans: ${typography.fontFamilySans};`,
    `  --font-family-mono: ${typography.fontFamilyMono};`,
    `  --font-size-small: ${typography.fontSizeSmall};`,
    `  --font-size-medium: ${typography.fontSizeMedium};`,
    `  --font-size-large: ${typography.fontSizeLarge};`,
    `  --font-size-xlarge: ${typography.fontSizeXLarge};`,
    `  --font-weight-normal: ${typography.fontWeightNormal};`,
    `  --font-weight-medium: ${typography.fontWeightMedium};`,
    `  --font-weight-semibold: ${typography.fontWeightSemibold};`,
    `  --font-weight-bold: ${typography.fontWeightBold};`,
    "",
    "  /* Spacing */",
    ...Object.entries(spacing).map(
      ([key, value]) => `  --spacing-${key.replace("spacing", "")}: ${value};`
    ),
    "",
    "  /* Border Radius */",
    ...Object.entries(radius).map(
      ([key, value]) =>
        `  --radius-${key.replace("radius", "").toLowerCase()}: ${value};`
    ),
    "",
    "  /* Shadows */",
    ...Object.entries(shadows).map(
      ([key, value]) =>
        `  --shadow-${key.replace("shadow", "").toLowerCase()}: ${value};`
    ),
    "",
    "  /* Transitions */",
    ...Object.entries(transitions).map(
      ([key, value]) =>
        `  --transition-${key.replace("transition", "").toLowerCase()}: ${value};`
    ),
    "",
    "  /* Animation Timings from UI Config */",
    `  --animation-fast: ${tokens._raw?.ui?.animationFast || "0.15s"};`,
    `  --animation-medium: ${tokens._raw?.ui?.animationMedium || "0.3s"};`,
    `  --animation-slow: ${tokens._raw?.ui?.animationSlow || "0.5s"};`,
    "",
    "  /* Backward compatibility - map old transition names to new animation values */",
    `  --transition-fast: ${tokens._raw?.ui?.animationFast || "0.15s"};`,
    `  --transition-normal: ${tokens._raw?.ui?.animationMedium || "0.3s"};`,
    `  --transition-slow: ${tokens._raw?.ui?.animationSlow || "0.5s"};`,
    "",
    "  /* Config Editor specific variables - ALWAYS FAST (immune to user settings) */",
    "  --config-transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);",
    "  --config-transition-fast: all 0.1s cubic-bezier(0.4, 0, 0.2, 1);",
    "",
    "  /* Easing Curves */",
    "  --easing-default: cubic-bezier(0.4, 0, 0.2, 1);",
    "  --easing-sharp: cubic-bezier(0.4, 0, 0.6, 1);",
    "",
    "  /* Button Variables – auto-derived from palette */",
    `  --btn-primary-bg: ${palette.primary.main};`,
    `  --btn-primary-border: ${palette.primary.dark};`,
    `  --btn-primary-border-hover: ${palette.primary.dark};`,
    `  --btn-primary-text: ${palette.primary.contrastText};`,
    `  --btn-primary-hover: ${palette.primary.dark};`,
    `  --btn-primary-active: ${palette.primary[700]};`,
    "",
    `  --btn-secondary-bg: ${palette.secondary.main};`,
    `  --btn-secondary-border: ${palette.secondary.main};`,
    `  --btn-secondary-border-hover: ${palette.secondary.dark};`,
    `  --btn-secondary-text: ${palette.secondary.contrastText};`,
    `  --btn-secondary-hover: ${palette.secondary.dark};`,
    `  --btn-secondary-active: ${palette.secondary[700]};`,
    "",
    `  --btn-shadow-hover: 0 2px 8px rgba(0,0,0,0.12);`,
    `  --btn-shadow-secondary: 0 0 0 2px ${palette.secondary.main};`,
    "",
    `  --btn-ghost-bg: transparent;`,
    `  --btn-ghost-border: transparent;`,
    `  --btn-ghost-text: ${palette.text.primary};`,
    `  --btn-ghost-hover: ${palette.grey[50]};`,
    `  --btn-ghost-border-hover: ${palette.grey[300]};`,
    `  --btn-ghost-active: ${palette.grey[100]};`,
    `  --btn-ghost-secondary-hover: ${palette.secondary.light};`,
    "",
    "  /* Disabled & State */",
    `  --state-disabled: ${palette.grey[200]};`,
    `  --border-focus: ${palette.accent.main};`,
    `  --border-tertiary: ${palette.grey[300]};`,
    "",
    "  /* Interactive States */",
    ...Object.entries(interactive).map(
      ([key, value]) => `  --interactive-${key}: ${value};`
    ),
    "",
    "  /* Layout */",
    `  --layout-sidebar-width-buttons: ${layout.sidebarWidth?.buttons || "80px"};`,
    `  --layout-sidebar-width-labels: ${layout.sidebarWidth?.labels || "240px"};`,
    `  --layout-topbar-height: ${layout.topBarHeight || "60px"};`,
    `  --layout-bottombar-height: ${layout.bottomBarHeight || "70px"};`,
    ...Object.entries(layout.zIndex || {}).map(
      ([key, value]) => `  --z-${key}: ${value};`
    ),
    "}",
  ];

  return cssVariables.join("\n");
};

/* -------------------------------------------------- */
/*  7. Helper Functions for Migration                 */
/* -------------------------------------------------- */

export const convertLegacyConfig = (legacyConfig: any): DesignSystemConfig => {
  // Convert your existing config structure to the new format
  return {
    theme: {
      colors: {
        primary: legacyConfig?.theme?.colors?.primary || "#2563eb",
        secondary: legacyConfig?.theme?.colors?.secondary || "#64748b",
        accent: legacyConfig?.theme?.colors?.accent || "#06b6d4",
        success: legacyConfig?.theme?.colors?.success || "#10b981",
        warning: legacyConfig?.theme?.colors?.warning || "#f59e0b",
        error: legacyConfig?.theme?.colors?.error || "#ef4444",
        info: legacyConfig?.theme?.colors?.info || "#3b82f6",
        grey50: legacyConfig?.theme?.colors?.grey50 || "#f9fafb",
        grey100: legacyConfig?.theme?.colors?.grey100 || "#f3f4f6",
        grey200: legacyConfig?.theme?.colors?.grey200 || "#e5e7eb",
        grey300: legacyConfig?.theme?.colors?.grey300 || "#d1d5db",
        grey400: legacyConfig?.theme?.colors?.grey400 || "#9ca3af",
        grey500: legacyConfig?.theme?.colors?.grey500 || "#6b7280",
        grey600: legacyConfig?.theme?.colors?.grey600 || "#4b5563",
        grey700: legacyConfig?.theme?.colors?.grey700 || "#374151",
        grey800: legacyConfig?.theme?.colors?.grey800 || "#1f2937",
        grey900: legacyConfig?.theme?.colors?.grey900 || "#111827",
      },
      typography: legacyConfig?.theme?.typography || {},
      spacing: legacyConfig?.theme?.spacing || {},
      borderRadius: legacyConfig?.theme?.borderRadius || {},
      shadows: legacyConfig?.theme?.shadows || {},
      transitions: legacyConfig?.theme?.transitions || {},
      interactiveStates: legacyConfig?.theme?.interactiveStates || {},
    },
    layout: legacyConfig?.layout || {},
    ui: legacyConfig?.ui || {},
    componentStyles: legacyConfig?.componentStyles || {},
    branding: legacyConfig?.branding || {},
    api: legacyConfig?.api || {},
    auth: legacyConfig?.auth || {},
    features: legacyConfig?.features || {},
    navigation: legacyConfig?.navigation || [],
  };
};

/* -------------------------------------------------- */
/*  8. Mini Demo (leave commented)                    */
/* -------------------------------------------------- */

// import sampleConfig from './design‑config.json';
// const tokens = buildDesignTokens(sampleConfig);
// console.log(tokens.palette.primary[200]);
