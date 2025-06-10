# 🚀 Active Config System

## Ultra-Simple Configuration Management

The Active Config System provides the simplest possible way to apply new configurations to your application without going through the editor interface.

## How It Works

### 📁 The Concept

- There's a designated space (simulated folder) for active configurations
- When you place a `config.json` file there, it becomes the active configuration
- The system automatically detects changes and applies them instantly
- No restart required, no complex processes

### 🎯 For the Team (Non-Technical Users)

#### Quick Start (3 steps):

1. **Get a template**: Use the "Download Example Config" button
2. **Modify the config**: Edit the JSON file with your desired settings
3. **Apply it**: Drag and drop the file onto the Active Config System interface

#### The config.json format:

```json
{
  "name": "My Custom Config",
  "description": "Brief description of this configuration",
  "config": {
    "theme": {
      "colors": {
        "primary": "#007bff",
        "secondary": "#6c757d"
      }
    },
    "branding": {
      "company": {
        "name": "Your Company Name"
      }
    }
  }
}
```

### 🔧 For Developers

#### Technical Implementation:

- Uses localStorage for web environment persistence
- Automatic change detection via polling
- Merges with existing configuration seamlessly
- Full TypeScript support with existing config types

#### Integration:

```typescript
import { configManager } from "./shared/config/config.manager";

// Check if active config is loaded
const info = configManager.getActiveConfigInfo();
console.log(info.isActive); // true/false

// Manually set active config
configManager.setActiveConfig(configData);

// Clear active config
configManager.clearActiveConfig();
```

## Features

### ✅ What Works

- **Instant Application**: Changes apply immediately
- **Auto-Detection**: System watches for config changes
- **Safe Fallback**: Can always revert to default config
- **Type Safety**: Full TypeScript support
- **Drag & Drop**: Simple file upload interface
- **Status Indicators**: Clear visual feedback

### 🎨 Supported Configuration Areas

- Theme colors and styling
- Branding and company information
- UI behavior and animations
- Layout settings
- API configuration
- Feature flags

### 🔄 Change Management

- **Apply**: New config becomes active instantly
- **Revert**: "Clear Active Config" returns to default
- **Status**: Always know what config is currently active
- **History**: See when config was last modified

## Examples

### Basic Color Theme Change

```json
{
  "name": "Dark Theme",
  "description": "Dark mode configuration",
  "config": {
    "theme": {
      "colors": {
        "primary": "#bb86fc",
        "background": "#121212",
        "surface": "#1e1e1e",
        "text": "#ffffff"
      }
    }
  }
}
```

### Branding Update

```json
{
  "name": "New Company Branding",
  "description": "Updated company branding for Q4",
  "config": {
    "branding": {
      "company": {
        "name": "New Company Name",
        "displayName": "New Company Display Name"
      }
    }
  }
}
```

### UI Behavior Changes

```json
{
  "name": "Faster Animations",
  "description": "Reduced animation duration for better performance",
  "config": {
    "ui": {
      "animations": {
        "duration": 150,
        "enabled": true
      }
    }
  }
}
```

## Best Practices

### 📝 For Config Creation

1. **Always include name and description** for clarity
2. **Test configurations** in a development environment first
3. **Keep backups** of working configurations
4. **Use meaningful names** that describe the purpose

### 🔒 For Team Management

1. **Version control** important configurations
2. **Document changes** in the description field
3. **Test thoroughly** before applying to production
4. **Keep the default config** as a fallback reference

### ⚡ For Performance

1. **Minimize config size** by only including necessary changes
2. **Avoid frequent changes** in production
3. **Monitor application** after applying new configs

## Troubleshooting

### 🚨 Common Issues

**Config not applying?**

- Check JSON syntax is valid
- Ensure file name is exactly `config.json`
- Verify the config structure matches expected format

**Want to revert changes?**

- Click "Clear Active Config" button
- This immediately restores default configuration

**Need to see current status?**

- Status indicator shows if active config is loaded
- Timestamp shows when it was last modified

### 🛠️ Developer Debug

```typescript
// Check current config manager state
console.log(configManager.getActiveConfigInfo());

// Force reload active config
configManager.loadActiveConfig();

// Get current effective configuration
console.log(configManager.getCurrentConfig());
```

## Integration with Existing Systems

### ✨ Editor Compatibility

- Active config system works alongside the visual editor
- Editor automatically detects and displays active config changes
- Can export current editor state as an active config

### 🔄 Profile System Integration

- Active configs can be saved as named profiles
- Profiles can be converted to active configs
- Full interoperability between all configuration methods

---

**🎯 Goal**: Make configuration changes as simple as dropping a file. No technical knowledge required for basic usage, while maintaining full power for developers.
