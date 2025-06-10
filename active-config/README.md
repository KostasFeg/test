# 🚀 Active Config Folder

## This is your designated config folder!

### How to use:

1. **Place a `config.json` file in this folder**
2. **The system will automatically detect and apply it**
3. **Changes take effect immediately**

### Expected file: `config.json`

Drop your configuration file here as `config.json` and it will become the active configuration for your application.

### Example config.json:

```json
{
  "name": "My Active Config",
  "description": "Custom configuration applied from active-config folder",
  "config": {
    "theme": {
      "colors": {
        "primary": "#007bff",
        "secondary": "#6c757d",
        "accent": "#17a2b8"
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

### Quick Start:

1. Download an example config from the Config Editor UI
2. Place it here as `config.json`
3. Watch your app update instantly!

---

**Note**: Currently the system uses the web interface for config management. For true file system watching, see the development notes in the main documentation.
