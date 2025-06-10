import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { SidebarVariant } from "../../shared/types/ui";
import { useConfig } from "../../shared/hooks/useConfig";

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
  const config = useConfig();

  // Initialize state from configuration
  const [sidebarVariant, setSidebarVariant] = useState<SidebarVariant>(
    config.ui.defaultSidebarVariant
  );
  const [showBottomBar, setShowBottomBar] = useState(
    config.ui.defaultShowBottomBar
  );

  // Update state when config changes
  useEffect(() => {
    setSidebarVariant(config.ui.defaultSidebarVariant);
    setShowBottomBar(config.ui.defaultShowBottomBar);
  }, [config.ui.defaultSidebarVariant, config.ui.defaultShowBottomBar]);

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
