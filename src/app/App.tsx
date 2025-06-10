import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading, user, login } = useAuth();
  const navigation = useNavigationConfig();

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
        topRight={`retailerId: ${user?.retailerId}`}
        topCenter={<TestToggles />}
      >
        <Suspense
          fallback={<LoadingFallback message="Loading application..." />}
        >
          <Routes>
            {buildRoutes(navigation)}
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
