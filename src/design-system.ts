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
  const defaultRadius: BorderRadiusConfig = {
    radiusSmall: "0.25rem",
    radiusMedium: "0.5rem",
    radiusLarge: "1rem",
    radiusXLarge: "1.5rem",
  };

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

  /** Generic walker → converts object paths to CSS variable lines */
  const lines: string[] = [":root {"];

  const kebab = (str: string) =>
    str
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .replace(/\./g, "-")
      .toLowerCase();

  const walk = (obj: any, path: string[] = []) => {
    Object.entries(obj || {}).forEach(([k, v]) => {
      if (v && typeof v === "object" && !Array.isArray(v)) {
        walk(v, [...path, k]);
      } else {
        const name = kebab([...path, k].join("-"));
        lines.push(`  --${name}: ${v};`);
      }
    });
  };

  /* ───────── Alias variables for legacy SCSS ───────── */
  const add = (name: string, value: string | number) => {
    lines.push(`  --${name}: ${value};`);
  };

  // Palette → --color-* variables (incl. rgb & contrast)
  const toRgb = (hex: string) => {
    const { r, g, b } = parseColor(hex);
    return `${r}, ${g}, ${b}`;
  };

  (Object.entries(palette) as [string, any][]).forEach(([key, scale]) => {
    if (["grey", "text", "divider", "background"].includes(key)) return; // handled later
    add(`color-${key}`, scale.main);
    add(`color-${key}-light`, scale.light);
    add(`color-${key}-dark`, scale.dark);
    add(`color-${key}-contrast`, scale.contrastText);
    add(`color-${key}-rgb`, toRgb(scale.main));
    // individual numeric steps 50-900
    [50,100,200,300,400,500,600,700,800,900].forEach((step) => {
      if (scale[step]) add(`color-${key}-${step}`, scale[step]);
    });
  });

  // Greys
  Object.entries(palette.grey).forEach(([k, v]) => add(`color-grey-${k}`, v));

  // Text / background / divider
  add("text-primary", palette.text.primary);
  add("text-secondary", palette.text.secondary);
  add("text-disabled", palette.text.disabled);
  add("divider", palette.divider);
  add("bg-default", palette.background.default);
  add("bg-paper", palette.background.paper);

  // Spacing → --spacing-1 ...
  Object.entries(spacing).forEach(([k, v]) => {
    const m = k.match(/^spacing(\d+)$/);
    if (m) add(`spacing-${m[1]}`, v);
  });

  // Radius → --radius-small / medium / large / xlarge
  Object.entries(radius).forEach(([k, v]) => {
    const name = k
      .replace(/^radius/i, "radius-") // radiusMedium → radius-Medium
      .replace(/([A-Z])/g, "-$1")     // radius-Medium → radius--Medium
      .replace(/--+/g, "-")           // collapse any double hyphen
      .toLowerCase();
    add(name, v);
  });

  // Transitions & easings
  Object.entries(transitions).forEach(([k, v]) => {
    const keb = kebab(k);
    if (k.toLowerCase().includes("easing")) {
      const suffix = keb.replace(/^easing-?/, "");
      add(`easing-${suffix || "default"}`, v);
    } else {
      add(`transition-${keb}`, v);
    }
  });

  // Support legacy keys under ui.* (animationFast, animationMedium, animationSlow, easing*)
  const rawAny = tokens._raw as any | undefined;
  if (rawAny?.ui) {
    const ui = rawAny.ui as Record<string, any>;
    if (ui.animationFast) add("transition-fast", ui.animationFast);
    if (ui.animationMedium) add("transition-medium", ui.animationMedium);
    if (ui.animationSlow) add("transition-slow", ui.animationSlow);

    if (ui.easingDefault) add("easing-default", ui.easingDefault);
    if (ui.easingBounce) add("easing-bounce", ui.easingBounce);
    if (ui.easingSharp) add("easing-sharp", ui.easingSharp);
  }

  // Radius full helper
  add("radius-full", "9999px");

  // Button helper variables mapping to primary / secondary palettes
  const btnMap = (
    varName: string,
    colorKey: keyof typeof palette,
    variant: "main" | "dark" | "light" = "main"
  ) => {
    const colScale: any = (palette as any)[colorKey];
    if (!colScale) return;
    const col =
      variant === "main"
        ? colScale.main
        : variant === "dark"
        ? colScale.dark
        : colScale.light;
    add(varName, col);
  };

  btnMap("btn-primary-bg", "primary");
  btnMap("btn-primary-hover", "primary", "dark");
  btnMap("btn-primary-active", "primary", "dark");
  btnMap("btn-primary-border", "primary");
  add("btn-primary-text", palette.primary.contrastText);

  btnMap("btn-secondary-bg", "secondary");
  btnMap("btn-secondary-hover", "secondary", "dark");
  btnMap("btn-secondary-active", "secondary", "dark");
  btnMap("btn-secondary-border", "secondary");
  add("btn-secondary-text", palette.secondary.contrastText);

  // Ghost variant and shadow helper
  add("btn-ghost-bg", "transparent");
  add("btn-ghost-hover", palette.grey[100]);
  add("btn-ghost-active", palette.grey[200]);
  add("btn-ghost-border", "transparent");
  add("btn-ghost-text", palette.primary.main);
  add("btn-ghost-border-hover", palette.grey[200]);
  add("btn-shadow-secondary", `0 2px 6px rgba(${toRgb(palette.secondary.main)}, 0.15)`);

  // Status helper colours
  add("status-secondary-bg", palette.secondary.light);

  // Finally walk the raw object sections for generic variables
  if (rawAny) {
    walk(rawAny.theme || {});
    walk(rawAny.layout || {}, ["layout"]);
    walk(rawAny.ui || {}, ["ui"]);
    walk(rawAny.componentStyles || {}, ["component"]);
  }

  lines.push("}");
  return lines.join("\n");
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
