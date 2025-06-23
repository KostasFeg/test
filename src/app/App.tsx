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
import { useDesignSystemInjection } from "../shared/design-system-integration";
import { TopBarControls } from "../components/layout/top-bar/TopBarControls";
import FullScreenPanel from "../components/ui/FullScreenPanel";
import {
  dynamicConfig,
  useHomeRoute,
} from "../shared/config/dynamic-config.service";
import { useShouldShowWelcome } from "../hooks/useActiveConfig";
import { shouldShowConfigEditor } from "../shared/config/app.config";

// Lazy load components - only load ConfigEditor in development
const ConfigEditor = shouldShowConfigEditor()
  ? React.lazy(() => import("../components/config-editor/ConfigEditor"))
  : null;

const WelcomeScreen = React.lazy(
  () => import("../components/ui/WelcomeScreen")
);

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading, user, login } = useAuth();
  const navigation = useNavigationConfig();
  const routes = React.useMemo(() => buildRoutes(navigation), [navigation]);
  const homeRoute = useHomeRoute();
  const shouldShowWelcome = useShouldShowWelcome();

  // Initialize the new design system and dynamic config
  useDesignSystemInjection();

  React.useEffect(() => {
    dynamicConfig.initialize();
  }, []);

  // Show loading while checking authentication state
  if (isLoading) {
    return <LoadingFallback message="Loading..." />;
  }

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={login} />;
  }

  // Show welcome screen if no config is loaded
  if (shouldShowWelcome) {
    return (
      <BrowserRouter>
        <Suspense
          fallback={<LoadingFallback message="Preparing your portal..." />}
        >
          <Routes>
            {shouldShowConfigEditor() && (
              <Route path="/configuration" element={<ConfigEditorWrapper />} />
            )}
            <Route path="*" element={<WelcomeScreen />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    );
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
            {routes}
            {/* Direct route for ConfigEditor - bypasses navigation config */}
            {shouldShowConfigEditor() && (
              <Route path="/configuration" element={<ConfigEditorWrapper />} />
            )}
            <Route path="/" element={<Navigate to={homeRoute} replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
};

// Wrapper so we can safely call useNavigate (requires Router context)
const ConfigEditorWrapper: React.FC = () => {
  const navigate = useNavigate();

  if (!shouldShowConfigEditor() || !ConfigEditor) {
    return <Navigate to="/" replace />;
  }

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
