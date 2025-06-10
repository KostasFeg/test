# Master Configuration System

The Master Configuration System provides a single, comprehensive configuration that contains **every configurable variable** in the application. This system ensures that everything defined in the configuration is actually implemented in the layout and components.

## 🎯 Philosophy

> **"Everything that is a variable inside our configuration file, has to actually be implemented on our layout. Buttons, styles etc."**

This configuration system follows the principle that:

- **Single Source of Truth**: All configurable values live in one place
- **Type Safety**: Full TypeScript support with interfaces and validation
- **Component Interchangeability**: Components can be easily swapped between projects by updating the configuration
- **Dead Simple Reports**: Setting reports is easy with our slug implementation
- **Mature Architecture**: Built on top of your existing, proven systems

## 📁 File Structure

```
src/shared/config/
├── master.config.ts           # Master configuration interface & defaults
├── config.builder.ts          # Configuration builder & project overrides
├── css-variables.generator.ts # CSS custom properties generator
└── branding.config.ts         # Legacy branding config (still used)

src/shared/hooks/
└── useConfig.ts              # React hooks for accessing configuration

src/config/
└── reportConfig.ts           # Reports configuration (integrated)
```

## 🚀 Quick Start

### 1. Access Configuration in Components

```typescript
import {
  useConfig,
  useThemeConfig,
  useBrandingConfig,
} from "../shared/hooks/useConfig";

function MyComponent() {
  // Get complete config
  const config = useConfig();

  // Get specific sections
  const theme = useThemeConfig();
  const branding = useBrandingConfig();

  return (
    <div style={{ color: theme.colors.primary }}>{branding.company.name}</div>
  );
}
```

### 2. Customize for Your Project

Edit the `projectOverrides` in `src/shared/config/config.builder.ts`:

```typescript
const projectOverrides: ConfigOverrides = {
  theme: {
    colors: {
      primary: "#1f2937",
      accent: "#059669",
    },
  },

  ui: {
    defaultSidebarVariant: "buttons",
    defaultShowBottomBar: true,
  },

  features: {
    enableDebugReports: false,
    enableThemeCustomization: true,
  },
};
```

### 3. Add New Reports

Add to `src/config/reportConfig.ts` - they automatically appear in navigation:

```typescript
export const REPORTS: Record<string, ReportConfig> = {
  "my-new-report": {
    name: "My New Report",
    filters: ["fromDate", "toDate"],
    options: { withTime: true },
  },
};
```

## 🎨 Configuration Sections

### Theme Configuration

Controls all visual aspects of the application:

```typescript
theme: {
  colors: {
    primary: "#1d4ed8",           // Primary brand color
    accent: "#2563eb",            // Accent color for UI elements
    success: "#10b981",           // Success state color
    warning: "#f59e0b",           // Warning state color
    error: "#dc2626",             // Error state color
    // ... and more
  },
  typography: {
    fontFamilySans: '"Inter", system-ui, sans-serif',
    fontSizeSmall: "0.875rem",
    fontWeightSemibold: 600,
    // ... and more
  },
  spacing: {
    spacing1: "0.25rem",          // 4px
    spacing4: "1rem",             // 16px
    // ... and more
  },
  borderRadius: {
    radiusSmall: "0.25rem",
    radiusLarge: "1rem",
    // ... and more
  }
}
```

### Layout Configuration

Controls structural layout properties:

```typescript
layout: {
  sidebarWidth: {
    buttons: "320px",             // Width when sidebar shows buttons
    labels: "160px",              // Width when sidebar shows labels only
  },
  topBarHeight: "64px",
  bottomBarHeight: "72px",
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
  }
}
```

### UI Behavior Configuration

Controls animations, defaults, and interactions:

```typescript
ui: {
  defaultSidebarVariant: "labels",     // "labels" | "buttons"
  defaultShowBottomBar: false,
  animationFast: "0.15s",
  animationMedium: "0.3s",
  easingDefault: "cubic-bezier(0.4, 0, 0.2, 1)",
}
```

### Component Styles Configuration

Controls styling for specific component types:

```typescript
componentStyles: {
  buttons: {
    borderRadius: "0.5rem",
    paddingVertical: "0.75rem",
    paddingHorizontal: "1rem",
    fontWeight: 600,
    minHeight: "40px",
    minWidth: "120px",
  },
  inputs: {
    borderRadius: "0.5rem",
    padding: "0.75rem 1rem",
    fontSize: "0.875rem",
    focusRingWidth: "3px",
  },
  cards: {
    borderRadius: "1rem",
    padding: "1rem",
    shadowLight: "0 1px 3px rgba(0, 0, 0, 0.05)",
    shadowMedium: "0 4px 6px rgba(0, 0, 0, 0.07)",
  },
  navigation: {
    buttonGrid: {
      gap: "36px",
      itemMinWidth: "280px",
      itemMaxWidth: "350px",
    },
    tabs: {
      height: "40px",
      borderRadius: "12px",
      gap: "12px",
    },
  }
}
```

### Branding Configuration

Controls company identity and branding:

```typescript
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
    logo: { /* can be different from main logo */ },
  },
  app: {
    name: "Retailer Portal",
    version: "1.0.0",
    description: "Comprehensive lottery retailer management system",
  }
}
```

### Feature Flags

Control which features are enabled:

```typescript
features: {
  enableDebugReports: true,
  enableAdvancedFilters: true,
  enableThemeCustomization: false,
  enableBulkOperations: false,
  enableOfflineMode: false,
}
```

## 🎨 Using Configuration in Styles

### Option 1: CSS Custom Properties (Recommended)

The configuration automatically generates CSS custom properties:

```scss
.my-component {
  background: var(--color-primary);
  padding: var(--spacing-4);
  border-radius: var(--radius-medium);
  color: var(--color-white);

  &:hover {
    background: var(--color-primary-dark);
  }
}
```

### Option 2: React Hook for Inline Styles

```typescript
import { useThemeValues } from "../shared/hooks/useConfig";

function MyComponent() {
  const theme = useThemeValues();

  return (
    <div
      style={{
        backgroundColor: theme.primary,
        padding: theme.spacing[4],
        borderRadius: theme.borderRadius.medium,
      }}
    >
      Content
    </div>
  );
}
```

### Option 3: Generated SCSS Variables

```typescript
import { generateSCSSVariables } from "../shared/config/css-variables.generator";
import { appConfig } from "../shared/config/config.builder";

// Generate SCSS file content
const scssContent = generateSCSSVariables(appConfig);
// Write to _config-variables.scss file
```

## 🧩 Adding New Configuration Options

### 1. Define in Master Config Interface

```typescript
// In master.config.ts
export interface MyNewConfigSection {
  myProperty: string;
  myNumericProperty: number;
  myOptionalProperty?: boolean;
}

export interface MasterConfig {
  // ... existing sections
  myNewSection: MyNewConfigSection;
}
```

### 2. Add Default Values

```typescript
// In master.config.ts
export const defaultConfig: MasterConfig = {
  // ... existing sections
  myNewSection: {
    myProperty: "default value",
    myNumericProperty: 42,
    myOptionalProperty: true,
  },
};
```

### 3. Create Hook (Optional)

```typescript
// In useConfig.ts
export function useMyNewConfig() {
  return useMemo(() => appConfig.myNewSection, []);
}
```

### 4. Use in Components

```typescript
import { useMyNewConfig } from "../shared/hooks/useConfig";

function MyComponent() {
  const myConfig = useMyNewConfig();

  return <div>{myConfig.myProperty}</div>;
}
```

## 🔧 Migration from Legacy Configs

### Current State

Your existing configurations are automatically merged:

- ✅ `branding.config.ts` → `config.branding`
- ✅ `navigation.config.tsx` → `config.navigation`
- ✅ `reportConfig.ts` → `config.reports`
- ✅ `app.config.ts` → Merged into various sections

### Migration Steps

1. **Keep using existing files** - they're automatically merged
2. **Gradually move overrides** to `projectOverrides` in `config.builder.ts`
3. **Update imports** to use new hooks: `useConfig()`, `useThemeConfig()`, etc.
4. **Update styles** to use CSS custom properties: `var(--color-primary)`

## 🎯 Best Practices

### 1. Configuration Principles

- **Everything configurable must be implemented** - no unused config options
- **Type safety first** - use TypeScript interfaces for all configurations
- **Single source of truth** - avoid duplicating configuration values
- **Component agnostic** - configuration should work across different projects

### 2. Naming Conventions

- Use clear, descriptive names: `primaryColor` not `color1`
- Follow consistent patterns: `fontSizeSmall`, `fontSizeMedium`, `fontSizeLarge`
- Use semantic naming: `success`, `warning`, `error` instead of `green`, `yellow`, `red`

### 3. Responsive Design

- Use configuration breakpoints consistently
- Define responsive values in configuration when needed
- Use the `useBreakpoints()` hook for conditional rendering

### 4. Theme Consistency

- Define color palettes in configuration
- Use spacing scale consistently
- Define component styles centrally to ensure consistency

## 🚀 Advanced Usage

### Feature Flag Driven Development

```typescript
import { useFeature } from "../shared/hooks/useConfig";

function MyComponent() {
  const enableAdvancedFilters = useFeature("enableAdvancedFilters");

  return <div>{enableAdvancedFilters && <AdvancedFilters />}</div>;
}
```

### Dynamic Theme Switching

```typescript
import { buildConfig } from "../shared/config/config.builder";
import { injectCSSVariables } from "../shared/config/css-variables.generator";

function switchToDarkTheme() {
  const darkConfig = buildConfig({
    theme: {
      colors: {
        primary: "#1f2937",
        accent: "#059669",
        // ... dark theme colors
      },
    },
  });

  injectCSSVariables(darkConfig);
}
```

### Environment-Specific Configurations

```typescript
const productionOverrides: ConfigOverrides = {
  features: {
    enableDebugReports: false,
    enableThemeCustomization: false,
  },
  api: {
    timeout: 60000, // Longer timeout for production
  },
};

const config = buildConfig(
  process.env.NODE_ENV === "production"
    ? productionOverrides
    : developmentOverrides
);
```

## 🎉 Benefits

1. **Single Configuration**: Everything configurable is in one place
2. **Type Safety**: Full TypeScript support prevents configuration errors
3. **Component Interchangeability**: Easy to swap components between projects
4. **CSS Integration**: Automatic CSS custom properties generation
5. **React Integration**: Purpose-built hooks for accessing configuration
6. **Backward Compatibility**: Existing configurations continue to work
7. **Easy Reports**: Dead simple report configuration with slug system
8. **Feature Flags**: Easy to enable/disable features across environments
9. **Theme Consistency**: Centralized theme management
10. **Migration Path**: Gradual migration from existing configurations

This system builds on your mature architecture while providing a path forward for even more flexibility and maintainability!
