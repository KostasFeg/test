export interface ConfigOverrides {
  theme?: {
    colors?: Record<string, any>;
    typography?: Record<string, any>;
    spacing?: Record<string, any>;
    borderRadius?: Record<string, any>;
  };
  layout?: Record<string, any>;
  ui?: Record<string, any>;
  componentStyles?: Record<string, any>;
  branding?: Record<string, any>;
  api?: Record<string, any>;
  auth?: Record<string, any>;
  features?: Record<string, any>;
  navigation?: any[];
  reports?: Record<string, any>;
} 