import React, { Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { UIProvider } from "./providers/UIProvider";
import LoginPage from "../pages/LoginPage";
import { Layout } from "../components/layout/Layout";
import { buildRoutes } from "../navigation/RouteBuilder";
import { useNavigationConfig } from "../shared/hooks/useConfig";
import LoadingFallback from "../components/ui/LoadingFallback";
import TestToggles from "../components/ui/TestToggles";
import ErrorBoundary from "../components/feedback/ErrorBoundary";
import { ROUTES } from "../shared/constants/routes";
import { useDesignSystemInjection } from "../shared/design-system-integration";
import { TopBarControls } from "../components/layout/top-bar/TopBarControls";
import FullScreenPanel from "../components/ui/FullScreenPanel";

// Lazy load ConfigEditor for the dedicated route
const ConfigEditor = React.lazy(
  () => import("../components/config-editor/ConfigEditor")
);

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading, user, login } = useAuth();
  const navigation = useNavigationConfig();

  // Initialize the new design system
  useDesignSystemInjection();

  // Show loading while checking authentication state
  if (isLoading) {
    return <LoadingFallback message="Loading..." />;
  }

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={login} />;
  }

  return (
    <BrowserRouter>
      <Layout
        sidebarItems={navigation}
        topLeft={"Retailer Portal"}
        topRight={<TopBarControls retailerId={user?.retailerId} />}
        topCenter={<TestToggles />}
      >
        <Suspense
          fallback={<LoadingFallback message="Loading application..." />}
        >
          <Routes>
            {buildRoutes(navigation)}
            {/* Direct route for ConfigEditor - bypasses navigation config */}
            <Route path="/configuration" element={<ConfigEditorWrapper />} />
            <Route
              path={ROUTES.HOME}
              element={<Navigate to="/reports" replace />}
            />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
};

// Wrapper so we can safely call useNavigate (requires Router context)
const ConfigEditorWrapper: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Suspense
      fallback={<LoadingFallback message="Loading Configuration Editor..." />}
    >
      <FullScreenPanel onClose={() => navigate(-1)}>
        <ConfigEditor />
      </FullScreenPanel>
    </Suspense>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <UIProvider>
          <AppContent />
        </UIProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
