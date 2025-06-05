import React, { createContext, useContext, useState, ReactNode } from "react";

export type SidebarVariant = "labels" | "buttons";

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
  const [sidebarVariant, setSidebarVariant] =
    useState<SidebarVariant>("labels");
  const [showBottomBar, setShowBottomBar] = useState(false);

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
