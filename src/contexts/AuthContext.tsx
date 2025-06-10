import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { accessManager } from "../permissions/create-access-manager";
import { Permission, RetailerLevel } from "../permissions/access-model";
import config from "../shared/config/app.config";
import { User } from "../shared/types/auth";

interface AuthContextType {
  // Authentication state
  isAuthenticated: boolean;
  isOfflineMode: boolean;
  isLoading: boolean;
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Define logout function first so it can be used in useEffect

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

        // Update local state to trigger re-render
        setIsAuthenticated(true);
        setIsOfflineMode(false); // Assume online mode on reload unless specified
      } catch (error) {
        console.error("Failed to restore user session:", error);
        // Clear state on error instead of calling logout function
        setUser(undefined);
        setIsAuthenticated(false);
        setIsOfflineMode(false);
        accessManager.reset();
        localStorage.removeItem(config.auth.persistKey);
        localStorage.removeItem("user");
      }
    }

    // Always set loading to false after checking localStorage
    setIsLoading(false);
  }, []);

  const login = (userData: User, isOffline = false) => {
    setUser(userData);

    // Update access manager
    if (isOffline) {
      accessManager.setOfflineLoggedIn(true);
      setIsOfflineMode(true);
    } else {
      accessManager.setLoggedIn(true);
      setIsOfflineMode(false);
    }

    // Set user permissions based on level
    if (userData.level) {
      accessManager.setLevels([userData.level]);
    }

    // Update local state to trigger re-render
    setIsAuthenticated(true);

    // Persist to localStorage
    localStorage.setItem(config.auth.persistKey, "true");
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(undefined);

    // Clear access manager
    accessManager.reset();

    // Update local state to trigger re-render
    setIsAuthenticated(false);
    setIsOfflineMode(false);

    // Clear localStorage
    localStorage.removeItem(config.auth.persistKey);
    localStorage.removeItem("user");
  };

  const value: AuthContextType = {
    isAuthenticated,
    isOfflineMode,
    isLoading,
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
