/**
 * Color utility functions for automatic theme generation
 */

export interface ColorPalette {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  accent: string;
  accentBackground: string;
}

/**
 * Converts hex color to RGB values
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Converts RGB values to hex color
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * Converts hex color to HSL
 */
export function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;

  const { r, g, b } = rgb;
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const diff = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);

    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / diff + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / diff + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / diff + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Converts HSL to hex color
 */
export function hslToHex(h: number, s: number, l: number): string {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h * 6) % 2 - 1));
  const m = l - c / 2;
  
  let r = 0, g = 0, b = 0;
  
  if (0 <= h * 6 && h * 6 < 1) {
    r = c; g = x; b = 0;
  } else if (1 <= h * 6 && h * 6 < 2) {
    r = x; g = c; b = 0;
  } else if (2 <= h * 6 && h * 6 < 3) {
    r = 0; g = c; b = x;
  } else if (3 <= h * 6 && h * 6 < 4) {
    r = 0; g = x; b = c;
  } else if (4 <= h * 6 && h * 6 < 5) {
    r = x; g = 0; b = c;
  } else if (5 <= h * 6 && h * 6 < 6) {
    r = c; g = 0; b = x;
  }
  
  const rHex = Math.round((r + m) * 255);
  const gHex = Math.round((g + m) * 255);
  const bHex = Math.round((b + m) * 255);
  
  return rgbToHex(rHex, gHex, bHex);
}

/**
 * Lightens a color by a percentage using HSL
 */
export function lightenColor(hex: string, percent: number): string {
  const hsl = hexToHsl(hex);
  if (!hsl) return hex;

  const newL = Math.min(100, hsl.l + percent);
  return hslToHex(hsl.h, hsl.s, newL);
}

/**
 * Darkens a color by a percentage using HSL
 */
export function darkenColor(hex: string, percent: number): string {
  const hsl = hexToHsl(hex);
  if (!hsl) return hex;

  const newL = Math.max(0, hsl.l - percent);
  return hslToHex(hsl.h, hsl.s, newL);
}

/**
 * Adjusts saturation of a color
 */
export function adjustSaturation(hex: string, percent: number): string {
  const hsl = hexToHsl(hex);
  if (!hsl) return hex;

  const newS = Math.max(0, Math.min(100, hsl.s + percent));
  return hslToHex(hsl.h, newS, hsl.l);
}

/**
 * Creates a complementary color (opposite on color wheel)
 */
export function getComplementaryColor(hex: string): string {
  const hsl = hexToHsl(hex);
  if (!hsl) return hex;

  const complementaryH = (hsl.h + 180) % 360;
  return hslToHex(complementaryH, hsl.s, hsl.l);
}

/**
 * Creates a triadic color scheme (120 degrees apart)
 */
export function getTriadicColors(hex: string): [string, string] {
  const hsl = hexToHsl(hex);
  if (!hsl) return [hex, hex];

  const triadic1 = hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l);
  const triadic2 = hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l);
  return [triadic1, triadic2];
}

/**
 * Creates an analogous color scheme (30 degrees apart)
 */
export function getAnalogousColors(hex: string): [string, string] {
  const hsl = hexToHsl(hex);
  if (!hsl) return [hex, hex];

  const analogous1 = hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l);
  const analogous2 = hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l);
  return [analogous1, analogous2];
}

/**
 * Creates an alpha version of a color
 */
export function alphaColor(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

/**
 * Automatically generates a complete color palette from a primary color
 */
export function generateColorPalette(primaryColor: string): ColorPalette {
  const hsl = hexToHsl(primaryColor);
  if (!hsl) {
    return {
      primary: primaryColor,
      primaryLight: primaryColor,
      primaryDark: primaryColor,
      accent: primaryColor,
      accentBackground: primaryColor,
    };
  }

  // Generate light and dark variants
  const primaryLight = lightenColor(primaryColor, 15);
  const primaryDark = darkenColor(primaryColor, 15);

  // Generate accent color (slightly shifted hue or complementary)
  let accent: string;
  if (hsl.s > 20) {
    // If color is saturated, create analogous accent
    accent = hslToHex((hsl.h + 30) % 360, Math.max(40, hsl.s - 10), hsl.l);
  } else {
    // If color is desaturated, create a more saturated version
    accent = adjustSaturation(primaryColor, 20);
  }

  // Generate accent background (very light version of accent)
  const accentBackground = lightenColor(accent, 45);

  return {
    primary: primaryColor,
    primaryLight,
    primaryDark,
    accent,
    accentBackground,
  };
}

/**
 * Generates a readable contrast color (black or white) for a given background
 */
export function getContrastColor(backgroundColor: string): string {
  const whiteContrast = getContrastRatio(backgroundColor, '#ffffff');
  const blackContrast = getContrastRatio(backgroundColor, '#000000');
  
  // Return color with better contrast ratio
  return whiteContrast > blackContrast ? '#ffffff' : '#000000';
}

/**
 * Checks if a color meets WCAG contrast requirements
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 1;

  const getLuminance = (r: number, g: number, b: number) => {
    const [rNorm, gNorm, bNorm] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rNorm + 0.7152 * gNorm + 0.0722 * bNorm;
  };

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Ensures a color meets minimum contrast requirements
 */
export function ensureContrast(foregroundColor: string, backgroundColor: string, minRatio: number = 4.5): string {
  let currentRatio = getContrastRatio(foregroundColor, backgroundColor);
  let adjustedColor = foregroundColor;
  
  if (currentRatio >= minRatio) {
    return foregroundColor;
  }

  // Try darkening first
  for (let i = 10; i <= 90; i += 10) {
    const darker = darkenColor(foregroundColor, i);
    if (getContrastRatio(darker, backgroundColor) >= minRatio) {
      return darker;
    }
  }

  // If darkening doesn't work, try lightening
  for (let i = 10; i <= 90; i += 10) {
    const lighter = lightenColor(foregroundColor, i);
    if (getContrastRatio(lighter, backgroundColor) >= minRatio) {
      return lighter;
    }
  }

  // Fallback to high contrast
  return getContrastColor(backgroundColor);
}

// Material Design color utilities
export const materialColors = {
  red: {
    50: '#ffebee',
    100: '#ffcdd2', 
    500: '#f44336',
    900: '#b71c1c'
  },
  blue: {
    50: '#e3f2fd',
    100: '#bbdefb',
    500: '#2196f3', 
    900: '#0d47a1'
  },
  green: {
    50: '#e8f5e8',
    100: '#c8e6c9',
    500: '#4caf50',
    900: '#1b5e20'
  },
  orange: {
    50: '#fff3e0',
    100: '#ffe0b2',
    500: '#ff9800',
    900: '#e65100'
  },
  grey: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121'
  }
};

// Tailwind-inspired color utilities
export function generateTailwindScale(baseColor: string) {
  return {
    50: lightenColor(baseColor, 45),
    100: lightenColor(baseColor, 35),
    200: lightenColor(baseColor, 25),
    300: lightenColor(baseColor, 15),
    400: lightenColor(baseColor, 5),
    500: baseColor,
    600: darkenColor(baseColor, 5),
    700: darkenColor(baseColor, 15),
    800: darkenColor(baseColor, 25),
    900: darkenColor(baseColor, 35),
  };
} 