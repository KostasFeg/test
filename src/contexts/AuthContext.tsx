import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { accessManager } from "../permissions/create-access-manager";
import { RetailerLevel, Permission } from "../permissions/access-model";
import config from "../config/app.config";

interface User {
  retailerId: string;
  level: RetailerLevel;
  name?: string;
}

interface AuthContextType {
  // Authentication state
  isAuthenticated: boolean;
  isOfflineMode: boolean;
  user?: User;

  // Authentication actions
  login: (user: User, isOffline?: boolean) => void;
  logout: () => void;

  // Permission helpers (delegated to access manager)
  hasPermission: (permission: Permission) => boolean;
  getUserLevel: () => RetailerLevel[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | undefined>();

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem(config.auth.persistKey);
    const storedUser = localStorage.getItem("user");

    if (storedAuth === "true" && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);

        // Restore access manager state
        accessManager.setLoggedIn(true);
        if (userData.level) {
          accessManager.setLevels([userData.level]);
        }
      } catch (error) {
        console.error("Failed to restore user session:", error);
        logout();
      }
    }
  }, []);

  const login = (userData: User, isOffline = false) => {
    setUser(userData);

    // Update access manager
    if (isOffline) {
      accessManager.setOfflineLoggedIn(true);
    } else {
      accessManager.setLoggedIn(true);
    }

    // Set user permissions based on level
    if (userData.level) {
      accessManager.setLevels([userData.level]);
    }

    // Persist to localStorage
    localStorage.setItem(config.auth.persistKey, "true");
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(undefined);

    // Clear access manager
    accessManager.reset();

    // Clear localStorage
    localStorage.removeItem(config.auth.persistKey);
    localStorage.removeItem("user");
  };

  const value: AuthContextType = {
    isAuthenticated: accessManager.isLoggedIn(),
    isOfflineMode: accessManager.isOfflineLoggedIn(),
    user,
    login,
    logout,
    hasPermission: accessManager.has,
    getUserLevel: accessManager.getLevels,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
