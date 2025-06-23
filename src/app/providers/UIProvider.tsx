import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { SidebarVariant } from "../../shared/types/ui";
import { useUIConfig } from "../../shared/hooks/useConfig";

interface UIContextType {
  sidebarVariant: SidebarVariant;
  setSidebarVariant: (variant: SidebarVariant) => void;
  showBottomBar: boolean;
  setShowBottomBar: (show: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

interface UIProviderProps {
  children: ReactNode;
}

export const UIProvider: React.FC<UIProviderProps> = ({ children }) => {
  const uiConfig = useUIConfig();

  // Initialize state from configuration
  const [sidebarVariant, setSidebarVariant] = useState<SidebarVariant>(
    (uiConfig?.defaultSidebarVariant as SidebarVariant) || "buttons"
  );
  const [showBottomBar, setShowBottomBar] = useState(
    uiConfig?.defaultShowBottomBar || false
  );

  // Update state when config changes
  useEffect(() => {
    setSidebarVariant(
      (uiConfig?.defaultSidebarVariant as SidebarVariant) || "buttons"
    );
    setShowBottomBar(uiConfig?.defaultShowBottomBar || false);
  }, [uiConfig?.defaultSidebarVariant, uiConfig?.defaultShowBottomBar]);

  const value = {
    sidebarVariant,
    setSidebarVariant,
    showBottomBar,
    setShowBottomBar,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
};
