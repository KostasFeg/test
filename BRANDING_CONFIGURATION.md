# Branding Configuration

This application supports configurable branding to allow customization for different clients or deployments.

## Configuration Location

The branding configuration is located in:

```
src/shared/config/branding.config.ts
```

## Configuration Options

### Logo Configuration

The system supports two logo placements:

1. **Main Logo**: Used in the layout (bottom-left corner when sidebar is in button mode and bottom bar is shown)
2. **Login Page Logo**: Used on the login screen (can be different from main logo)

### Configuration Structure

```typescript
interface BrandingConfig {
  // Main application logo
  logo: {
    src: string; // Path to logo image (e.g., "/my-logo.png")
    alt: string; // Alt text for accessibility
    width?: number; // Optional width in pixels
    height?: number; // Optional height in pixels
  };

  // Login page specific branding
  loginPage: {
    title: string; // Login page title text
    logo?: LogoConfig; // Optional separate logo for login page
  };

  // Company information
  company: {
    name: string; // Company name
    displayName?: string; // Optional display name
  };

  // Optional theme colors (for future use)
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
}
```

## How to Customize

### 1. Add Your Logo

1. Place your logo image in the `public/` directory
2. Recommended formats: PNG, SVG, or JPG
3. Recommended size: 180px width for optimal display

### 2. Update Configuration

Edit `src/shared/config/branding.config.ts`:

```typescript
const brandingConfig: BrandingConfig = {
  logo: {
    src: "/your-company-logo.png",
    alt: "Your Company Logo",
    width: 180,
  },
  loginPage: {
    title: "Your Portal Login",
    logo: {
      src: "/your-login-logo.png", // Can be different from main logo
      alt: "Your Company Logo",
      width: 200,
    },
  },
  company: {
    name: "Your Company",
    displayName: "Your Company Inc.",
  },
  colors: {
    primary: "#your-color",
    secondary: "#your-color",
    accent: "#your-color",
  },
};
```

### 3. Logo Placement

- **Login Page**: Logo appears centered above the login form
- **Layout**: Logo appears in the bottom-left corner when:
  - Sidebar is in "buttons" variant (not "labels")
  - Bottom bar is visible

## Example Configurations

### Single Logo for Both Locations

```typescript
const brandingConfig: BrandingConfig = {
  logo: {
    src: "/company-logo.png",
    alt: "Company Logo",
    width: 180,
  },
  loginPage: {
    title: "Company Portal Login",
    // No separate logo specified - will use main logo
  },
  // ... other config
};
```

### Different Logos for Login and Layout

```typescript
const brandingConfig: BrandingConfig = {
  logo: {
    src: "/company-icon.png", // Small icon for layout
    alt: "Company Icon",
    width: 60,
  },
  loginPage: {
    title: "Company Portal Login",
    logo: {
      src: "/company-full-logo.png", // Full logo for login
      alt: "Company Full Logo",
      width: 200,
    },
  },
  // ... other config
};
```

## Notes

- Images in the `public/` directory are accessible at the root path (e.g., `/logo.png`)
- The system gracefully handles missing logos (no errors if logo is not configured)
- Width and height are optional - omit for natural sizing
- Alt text is important for accessibility compliance
