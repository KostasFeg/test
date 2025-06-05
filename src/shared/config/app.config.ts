import { SidebarVariant } from '../types/ui';

interface AppConfig {
  app: {
    name: string;
    version: string;
  };
  auth: {
    persistKey: string;
    sessionTimeout?: number;
  };
  api: {
    baseUrl: string;
    timeout: number;
  };
  ui: {
    defaultSidebarVariant: SidebarVariant;
    defaultShowBottomBar: boolean;
  };
}

const config: AppConfig = {
  app: {
    name: "Retailer Portal",
    version: "1.0.0"
  },
  auth: {
    persistKey: "loggedIn",
    sessionTimeout: 8 * 60 * 60 * 1000 // 8 hours in milliseconds
  },
  api: {
    baseUrl: (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 30000
  },
  ui: {
    defaultSidebarVariant: 'labels',
    defaultShowBottomBar: false
  }
};

export default config; 