import { useMemo } from "react";
import config from "../shared/config/app.config";
import type {
  BrandingConfig,
  LogoConfig,
} from "../shared/config/branding.config";

interface BrandingHook {
  branding: BrandingConfig;
  logo: LogoConfig;
  loginLogo: LogoConfig;
  companyName: string;
  loginTitle: string;
}

/**
 * Custom hook to access branding configuration
 * Provides computed values and fallbacks for branding elements
 */
export const useBranding = (): BrandingHook => {
  return useMemo(() => {
    const branding = config.branding;

    // Use login-specific logo if available, otherwise fall back to main logo
    const loginLogo = branding.loginPage.logo || branding.logo;

    return {
      branding,
      logo: branding.logo,
      loginLogo,
      companyName: branding.company.displayName || branding.company.name,
      loginTitle: branding.loginPage.title,
    };
  }, []);
};

export default useBranding;
