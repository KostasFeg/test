interface LogoConfig {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

interface BrandingConfig {
  // Main application logo (used in layout, navigation, etc.)
  logo: LogoConfig;

  // Login page specific branding
  loginPage: {
    title: string;
    logo?: LogoConfig; // Optional override for login page
  };

  // Company/Organization info
  company: {
    name: string;
    displayName?: string;
  };

  // Theme colors (optional for future use)
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
}

// Mock configuration - replace this with your actual branding
const brandingConfig: BrandingConfig = {
  logo: {
    src: "/nhlottery-logo.png",
    alt: "NH Lottery Logo",
    width: 180,
  },
  loginPage: {
    title: "Retailer Portal Login",
    // Using the same logo for login page, but could be different
    logo: {
      src: "/nhlottery-logo.png",
      alt: "NH Lottery Logo",
      width: 180,
    },
  },
  company: {
    name: "NH Lottery",
    displayName: "New Hampshire Lottery Commission",
  },
  colors: {
    primary: "#1d4ed8",
    secondary: "#2563eb",
    accent: "#dbeafe",
  },
};

export default brandingConfig;
export type { BrandingConfig, LogoConfig };
