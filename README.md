# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Configuration System - Enhanced Version

## 🎨 What's New?

Your configuration system has been significantly enhanced to make styling changes more intuitive and automatic!

### Key Improvements:

1. **Automatic Color Derivation** 🌈

   - When you change the primary color, the system automatically generates harmonious variants
   - Light/dark versions, accent colors, and background tints are calculated automatically
   - Uses advanced color theory algorithms for pleasing color combinations

2. **Semantic CSS Variables** 🎯

   - New semantic variables like `--ui-sidebar-bg`, `--ui-button-primary-bg`, etc.
   - Clear mapping between configuration changes and visual results
   - Changing "primary color" now actually affects primary UI elements!

3. **Simplified Configuration Interface** ✨

   - Reorganized into 5 intuitive sections:
     - 🎨 Colors & Theming (most impactful changes)
     - 📐 Layout & Sizing
     - ⚡ Animations & Feel
     - 🏢 Branding & Identity
     - ⚙️ Advanced Settings
   - Auto-derivation toggle for colors
   - Live preview of derived colors

4. **Real-time CSS Injection** ⚡
   - Changes are applied instantly without page refresh
   - Automatic CSS variable generation and injection
   - Better performance and user experience

## How to Use:

### Quick Theme Change:

1. Open the Configuration Editor
2. Go to "Colors & Theming"
3. Change the "Primary Color" - watch everything update automatically!
4. The sidebar, buttons, and accent elements will all use harmonious colors derived from your choice

### Color Auto-Derivation:

- ✅ **Enabled**: Changing primary color generates light/dark variants automatically
- ❌ **Disabled**: Manual control over all color variants

### Example Usage:

```typescript
// Change primary color programmatically
configManager.updateConfig({
  theme: {
    colors: {
      primary: "#7c3aed", // Purple - auto-generates variants
    },
  },
});
```

The system will automatically:

- Generate `primaryLight: #8b5cf6`
- Generate `primaryDark: #6d28d9`
- Create harmonious `accent: #ec4899`
- Create subtle `accentBackground: #fdf4ff`
- Update all CSS variables in real-time

### Semantic CSS Variables Available:

```scss
// Sidebar theming
.my-sidebar {
  background: var(--ui-sidebar-bg);
  border: 1px solid var(--ui-sidebar-border);

  .active-item {
    background: var(--ui-sidebar-item-active);
    color: var(--ui-sidebar-item-active-text);
  }
}

// Button theming
.my-button {
  background: var(--ui-button-primary-bg);
  &:hover {
    background: var(--ui-button-primary-hover);
  }
}
```

## Benefits:

1. **Intuitive**: Changing "primary color" actually affects primary elements
2. **Automatic**: No need to manually calculate color variants
3. **Consistent**: Automatically generated colors follow design principles
4. **Fast**: Real-time preview without page refreshes
5. **Professional**: Uses color theory for harmonious combinations

## Try It Out:

1. Open your app
2. Navigate to the Configuration Editor
3. Change the primary color from blue to purple, green, or red
4. Watch your entire sidebar, buttons, and UI elements update with beautiful, harmonious colors!

The configuration system now provides the intuitive experience you wanted - changing key variables like "primary color" creates obvious, beautiful changes throughout your application! 🎨✨
