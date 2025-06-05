import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { UIProvider, useUI } from "./contexts/UIContext";
import LoginPage from "./pages/LoginPage";
import { Layout } from "./components/layout/Layout";
import { buildRoutes } from "./navigation/RouteBuilder";
import { navConfig } from "./config/navigation.config";
import { peripherals } from "./mocksHelper";
import LoadingFallback from "./components/ui/LoadingFallback";
import TestToggles from "./components/ui/TestToggles";
import ErrorBoundary from "./components/ErrorBoundary";
import { ROUTES } from "./types/routes";

const AppContent: React.FC = () => {
  const { isAuthenticated, user, login } = useAuth();
  const { sidebarVariant, showBottomBar } = useUI();

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={login} />;
  }

  return (
    <BrowserRouter>
      <Layout
        sidebarItems={navConfig}
        sidebarVariant={sidebarVariant}
        topLeft={"Retailer Portal"}
        topRight={`retailerId: ${user?.retailerId}`}
        bottomItems={showBottomBar ? peripherals : undefined}
        topCenter={<TestToggles />}
      >
        <Suspense
          fallback={<LoadingFallback message="Loading application..." />}
        >
          <Routes>
            {buildRoutes(navConfig)}
            <Route
              path="/"
              element={<Navigate to={ROUTES.MAINTENANCE_OPERATIONS} replace />}
            />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
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
